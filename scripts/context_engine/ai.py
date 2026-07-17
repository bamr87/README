"""
Provider-agnostic AI enrichment layer.

The engine works fully offline; when an API key is present an AI provider
can enrich cards and the apex with distilled prose. Providers:

  - anthropic  Claude via the Messages API   (ANTHROPIC_API_KEY)
  - xai        Grok via chat/completions     (XAI_API_KEY / GROK_API_KEY)
  - mock       deterministic canned output   (tests / dry runs)

Selection: pass a provider name, or "auto" to pick the first configured
provider (anthropic, then xai), or "off" to disable enrichment entirely.
Raw-HTTP requests keep the dependency footprint identical to the existing
harmonize/grok_agent.py client.
"""

import json
import os
import time
from typing import Dict, Optional

import requests

DEFAULT_TIMEOUT = 60
MAX_ATTEMPTS = 3

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


def _post_with_retry(url: str, headers: Dict, payload: Dict) -> Dict:
    last_error: Optional[Exception] = None
    for attempt in range(MAX_ATTEMPTS):
        try:
            response = requests.post(url, headers=headers, json=payload,
                                     timeout=DEFAULT_TIMEOUT)
            if response.status_code == 200:
                return response.json()
            if response.status_code in (429, 500, 529) and attempt < MAX_ATTEMPTS - 1:
                retry_after = float(response.headers.get("Retry-After", 2 * (attempt + 1)))
                time.sleep(retry_after)
                continue
            raise AIError(f"HTTP {response.status_code}: {response.text[:300]}")
        except requests.RequestException as exc:
            last_error = exc
            if attempt < MAX_ATTEMPTS - 1:
                time.sleep(2 * (attempt + 1))
    raise AIError(f"request failed after {MAX_ATTEMPTS} attempts: {last_error}")


class AnthropicProvider(BaseProvider):
    """Claude via the Anthropic Messages API (raw HTTP, no SDK dependency)."""

    name = "anthropic"
    API_URL = "https://api.anthropic.com/v1/messages"

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        if not self.api_key:
            raise AIError("ANTHROPIC_API_KEY is not set")
        self.model = model or os.getenv("CONTEXT_AI_MODEL", "claude-opus-4-8")

    def complete(self, prompt: str, system: str = SYSTEM_PROMPT,
                 max_tokens: int = 700) -> str:
        payload = {
            "model": self.model,
            "max_tokens": max_tokens,
            "system": system,
            "thinking": {"type": "adaptive"},
            "messages": [{"role": "user", "content": prompt}],
        }
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }
        data = _post_with_retry(self.API_URL, headers, payload)
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
        if os.getenv("ANTHROPIC_API_KEY"):
            return AnthropicProvider()
        if os.getenv("XAI_API_KEY") or os.getenv("GROK_API_KEY"):
            return XAIProvider()
        return None
    raise AIError(f"unknown AI provider: {spec}")
