"""
Provider-agnostic AI enrichment layer.

The engine works fully offline; when an API key is present an AI provider
can enrich cards and the apex with distilled prose. Providers:

  - anthropic  Claude via the Messages API   (ANTHROPIC_API_KEY, or Claude
               Code OAuth via CLAUDE_CODE_OAUTH_TOKEN / ANTHROPIC_AUTH_TOKEN)
  - xai        Grok via chat/completions     (XAI_API_KEY / GROK_API_KEY)
  - mock       deterministic canned output   (tests / dry runs)

Selection: pass a provider name, or "auto" to pick the first configured
provider (anthropic, then xai), or "off" to disable enrichment entirely.
Raw-HTTP requests keep the dependency footprint identical to the existing
harmonize/grok_agent.py client.
"""

import email.utils
import json
import os
import time
from datetime import datetime, timezone
from typing import Dict, Optional

import requests

DEFAULT_TIMEOUT = 60
MAX_ATTEMPTS = 3
# Status codes worth another attempt: rate limits, overload and transient
# gateway errors.
RETRY_STATUSES = frozenset({429, 500, 502, 503, 504, 529})
# A server-sent Retry-After is honoured only inside this window, so one
# response can never stall the weekly build (timeout-minutes: 15).
RETRY_AFTER_MIN_S = 1.0
RETRY_AFTER_MAX_S = 30.0
# Build-level AI budget (see reset_budget): CONTEXT_AI_MAX_CALLS caps the
# number of provider calls (unset = unlimited); CONTEXT_AI_DEADLINE_S is the
# wall-clock window, in seconds from the first call, after which no new
# request is made.
DEFAULT_DEADLINE_S = 600.0

SYSTEM_PROMPT = (
    "You are the context engine of the bamr87 monorepo: you maintain the "
    "consolidated README that describes every project in the fleet. You are "
    "given structured facts extracted from a project's documentation corpus. "
    "Write for a developer skimming the fleet overview. Be concrete and "
    "faithful to the facts; never invent features, numbers, or file names. "
    "Output plain prose only - no headings, no lists, no markdown emphasis."
)


class AIError(RuntimeError):
    """Raised when an enrichment call fails after retries."""


class BaseProvider:
    name = "base"
    model = ""

    def complete(self, prompt: str, system: str = SYSTEM_PROMPT,
                 max_tokens: int = 700) -> str:
        raise NotImplementedError


_budget = {"calls": 0, "started": None}


def reset_budget() -> None:
    """Start a fresh build-level AI budget (called once per build)."""
    _budget["calls"] = 0
    _budget["started"] = None


def _env_number(name: str, default: Optional[float]) -> Optional[float]:
    raw = (os.getenv(name) or "").strip()
    if not raw:
        return default
    try:
        return float(raw)
    except ValueError:
        print(f"[ai] ignoring non-numeric {name}={raw!r}")
        return default


def _deadline_passed() -> bool:
    deadline = _env_number("CONTEXT_AI_DEADLINE_S", DEFAULT_DEADLINE_S)
    started = _budget["started"]
    return (deadline is not None and started is not None
            and time.monotonic() - started >= deadline)


def _spend_budget() -> None:
    """Count one provider call, or raise AIError when the budget is spent."""
    max_calls = _env_number("CONTEXT_AI_MAX_CALLS", None)
    if max_calls is not None and _budget["calls"] >= max_calls:
        raise AIError(f"AI budget exhausted (CONTEXT_AI_MAX_CALLS={max_calls:g})")
    if _budget["started"] is None:
        _budget["started"] = time.monotonic()
    elif _deadline_passed():
        raise AIError("AI budget exhausted (CONTEXT_AI_DEADLINE_S reached)")
    _budget["calls"] += 1


def _retry_after_seconds(value: Optional[str], default: float) -> float:
    """
    Parse a Retry-After header (RFC 9110 delay-seconds or HTTP-date) and
    clamp it to [RETRY_AFTER_MIN_S, RETRY_AFTER_MAX_S]. Anything missing or
    unparseable falls back to `default`.
    """
    seconds = float(default)
    raw = (value or "").strip()
    if raw:
        try:
            seconds = float(raw)
        except ValueError:
            try:
                when = email.utils.parsedate_to_datetime(raw)
            except (TypeError, ValueError, IndexError):
                when = None
            if when is not None:
                if when.tzinfo is None:
                    when = when.replace(tzinfo=timezone.utc)
                seconds = (when - datetime.now(timezone.utc)).total_seconds()
    if seconds != seconds:  # NaN
        seconds = float(default)
    return max(RETRY_AFTER_MIN_S, min(RETRY_AFTER_MAX_S, seconds))


def _post_with_retry(url: str, headers: Dict, payload: Dict) -> Dict:
    """
    POST with bounded retries. Every failure surfaces as AIError, so callers
    that catch AIError always fall back to heuristic text.
    """
    _spend_budget()
    last_error: Optional[Exception] = None
    for attempt in range(MAX_ATTEMPTS):
        if attempt and _deadline_passed():
            raise AIError("AI budget exhausted (CONTEXT_AI_DEADLINE_S reached) "
                          f"after {attempt} attempt(s): {last_error}")
        backoff = 2 * (attempt + 1)
        try:
            response = requests.post(url, headers=headers, json=payload,
                                     timeout=DEFAULT_TIMEOUT)
            if response.status_code == 200:
                data = response.json()
                if not isinstance(data, dict):
                    raise AIError(f"unexpected response body: {str(data)[:300]}")
                return data
            last_error = AIError(f"HTTP {response.status_code}: {response.text[:300]}")
            if response.status_code in RETRY_STATUSES and attempt < MAX_ATTEMPTS - 1:
                time.sleep(_retry_after_seconds(
                    response.headers.get("Retry-After"), backoff))
                continue
            raise last_error
        except AIError:
            raise
        except requests.RequestException as exc:
            last_error = exc
            if attempt < MAX_ATTEMPTS - 1:
                time.sleep(backoff)
        except Exception as exc:  # malformed response (bad JSON, headers, ...)
            raise AIError(f"unexpected provider response: "
                          f"{type(exc).__name__}: {exc}") from exc
    raise AIError(f"request failed after {MAX_ATTEMPTS} attempts: {last_error}")


class AnthropicProvider(BaseProvider):
    """
    Claude via the Anthropic Messages API (raw HTTP, no SDK dependency).

    Two auth modes, resolved in this order:
      1. API key      ANTHROPIC_API_KEY            -> x-api-key header
      2. OAuth token  ANTHROPIC_AUTH_TOKEN or
                      CLAUDE_CODE_OAUTH_TOKEN      -> Authorization: Bearer
                                                      + oauth beta header

    The OAuth path is how the engine wires into Claude Code locally:
    `claude setup-token` mints a long-lived token to export as
    CLAUDE_CODE_OAUTH_TOKEN (or use `ant auth login` + ANTHROPIC_AUTH_TOKEN).
    """

    name = "anthropic"
    API_URL = "https://api.anthropic.com/v1/messages"
    OAUTH_BETA = "oauth-2025-04-20"

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None,
                 oauth_token: Optional[str] = None):
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        self.oauth_token = oauth_token or os.getenv("ANTHROPIC_AUTH_TOKEN") \
            or os.getenv("CLAUDE_CODE_OAUTH_TOKEN")
        if not self.api_key and not self.oauth_token:
            raise AIError(
                "no Anthropic credential: set ANTHROPIC_API_KEY, or wire "
                "Claude Code OAuth via CLAUDE_CODE_OAUTH_TOKEN "
                "(`claude setup-token`) / ANTHROPIC_AUTH_TOKEN")
        self.model = model or os.getenv("CONTEXT_AI_MODEL", "claude-opus-5-5")

    @property
    def auth_mode(self) -> str:
        return "api-key" if self.api_key else "oauth"

    def _headers(self) -> Dict:
        headers = {
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }
        if self.api_key:
            headers["x-api-key"] = self.api_key
        else:
            headers["Authorization"] = f"Bearer {self.oauth_token}"
            headers["anthropic-beta"] = self.OAUTH_BETA
        return headers

    def complete(self, prompt: str, system: str = SYSTEM_PROMPT,
                 max_tokens: int = 700) -> str:
        payload = {
            "model": self.model,
            "max_tokens": max_tokens,
            "system": system,
            "thinking": {"type": "adaptive"},
            "messages": [{"role": "user", "content": prompt}],
        }
        data = _post_with_retry(self.API_URL, self._headers(), payload)
        if data.get("stop_reason") == "refusal":
            raise AIError("model declined the request (stop_reason: refusal)")
        text = "".join(block.get("text", "")
                       for block in data.get("content", [])
                       if block.get("type") == "text").strip()
        if not text:
            raise AIError(f"empty completion: {json.dumps(data)[:300]}")
        return text


class XAIProvider(BaseProvider):
    """Grok via xAI chat/completions (same API the harmonize package uses)."""

    name = "xai"
    API_URL = "https://api.x.ai/v1/chat/completions"

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or os.getenv("XAI_API_KEY") or os.getenv("GROK_API_KEY")
        if not self.api_key:
            raise AIError("XAI_API_KEY / GROK_API_KEY is not set")
        self.model = model or os.getenv("GROK_MODEL", "grok-4-1-fast-reasoning")

    def complete(self, prompt: str, system: str = SYSTEM_PROMPT,
                 max_tokens: int = 700) -> str:
        payload = {
            "model": self.model,
            "max_tokens": max_tokens,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": prompt},
            ],
        }
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        data = _post_with_retry(self.API_URL, headers, payload)
        choices = data.get("choices") or []
        text = (choices[0].get("message", {}).get("content") or "").strip() if choices else ""
        if not text:
            raise AIError(f"empty completion: {json.dumps(data)[:300]}")
        return text


class MockProvider(BaseProvider):
    """Deterministic provider for tests and --ai mock dry runs."""

    name = "mock"
    model = "mock-1"

    def complete(self, prompt: str, system: str = SYSTEM_PROMPT,
                 max_tokens: int = 700) -> str:
        return ("Mock enrichment: distilled context generated without an AI "
                "provider. First 80 chars of prompt follow. "
                + " ".join(prompt.split())[:80])


def get_provider(spec: str = "auto") -> Optional[BaseProvider]:
    """
    Resolve a provider from a spec string.

    "off"/"none" -> None; "auto" -> first configured of (anthropic, xai),
    else None; explicit names raise AIError when unconfigured.
    """
    spec = (spec or "auto").lower()
    if spec in ("off", "none", ""):
        return None
    if spec == "anthropic":
        return AnthropicProvider()
    if spec == "xai":
        return XAIProvider()
    if spec == "mock":
        return MockProvider()
    if spec == "auto":
        if (os.getenv("ANTHROPIC_API_KEY") or os.getenv("ANTHROPIC_AUTH_TOKEN")
                or os.getenv("CLAUDE_CODE_OAUTH_TOKEN")):
            return AnthropicProvider()
        if os.getenv("XAI_API_KEY") or os.getenv("GROK_API_KEY"):
            return XAIProvider()
        return None
    raise AIError(f"unknown AI provider: {spec}")
