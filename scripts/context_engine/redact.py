"""
Secret screen: find and redact credential-shaped strings in text.

Crawled upstream Markdown flows into the committed corpus (`docs/`), the
published site, AI prompts and MCP answers, so a credential committed
upstream by mistake has to stop at ingest: `collect.py` runs every page
through `redact()`, `hooks.py` screens hook output, and `AIError`
screens the provider response bodies it quotes.

Only shapes that are almost never anything but a credential are matched:
GitHub tokens (`ghp_`/`gho_`/`ghu_`/`ghs_`/`ghr_`, `github_pat_`), Anthropic
keys and OAuth tokens (`sk-ant-`), xAI keys (`xai-`), AWS access key ids
(`AKIA`), PEM private keys and Slack tokens (`xoxa-`/`xoxb-`/`xoxp-`/`xoxr-`/
`xoxs-`). Placeholders that documentation uses on purpose stay: a value
containing `your`, `example`, `xxxx` or another PLACEHOLDER_MARKERS word, a
prefix followed by one repeated character, a `<...>` template (no pattern
matches `<` or `>`), and a PEM block with no real key material in it.

A hit records the kind and the 1-based line of a match, never its value.
Stdlib only: the collect stage, the engine and the hook runner all import it.
"""

import re
from typing import Callable, List, NamedTuple, Optional, Tuple

REDACTED = "[REDACTED:{kind}]"

# Lower-case substrings that mark a value as a documentation placeholder.
PLACEHOLDER_MARKERS = (
    "your", "example", "xxxx", "placeholder", "redacted", "changeme",
    "dummy", "fake", "sample",
)
# A value with fewer distinct characters than this is a placeholder: its
# prefix plus one repeated character (`AKIA` and sixteen zeros). A real
# token's random part alone brings a dozen or more.
MIN_DISTINCT_CHARS = 6
# Base64 a PEM block must carry, in runs of 16 or more, to be a real key.
MIN_KEY_MATERIAL = 64

_START = r"(?<![A-Za-z0-9])"
_KEY_WORDS = r"(?:[A-Z0-9]+ )*PRIVATE KEY(?: BLOCK)?"
_PEM = re.compile(
    r"-----BEGIN " + _KEY_WORDS + r"-----"
    r"(?:(?P<body>[\s\S]{0,16384}?)-----END " + _KEY_WORDS + r"-----"
    r"|(?P<tail>(?:\s*[A-Za-z0-9+/=]{16,})*))"
)
_BASE64_RUN = re.compile(r"[A-Za-z0-9+/]{16,}")


class Hit(NamedTuple):
    """One credential found in a text: its kind and line, never its value."""

    kind: str
    line: int


def _is_placeholder(value: str) -> bool:
    lowered = value.lower()
    return (any(marker in lowered for marker in PLACEHOLDER_MARKERS)
            or len(set(value)) < MIN_DISTINCT_CHARS)


def _has_digit(value: str) -> bool:
    return any(ch.isdigit() for ch in value)


def _is_private_key(match: "re.Match[str]") -> bool:
    material = match.group("body")
    if material is None:
        material = match.group("tail") or ""
    return sum(len(run) for run in _BASE64_RUN.findall(material)) >= MIN_KEY_MATERIAL


# (kind, pattern, extra test a match must pass to count as a credential).
_TOKENS: Tuple[Tuple[str, "re.Pattern[str]", Optional[Callable[[str], bool]]], ...] = (
    # Personal, OAuth, user-to-server, server-to-server and refresh tokens.
    ("github-token", re.compile(_START + r"gh[pousr]_[A-Za-z0-9]{36,}"), None),
    # Fine-grained personal access tokens: github_pat_<22>_<59>.
    ("github-pat", re.compile(_START + r"github_pat_[A-Za-z0-9]{20,}_[A-Za-z0-9]{40,}"), None),
    # API keys (sk-ant-api03-...) and Claude OAuth tokens (sk-ant-oat01-...).
    ("anthropic-key", re.compile(_START + r"sk-ant-[A-Za-z0-9_-]{24,}"), None),
    ("xai-key", re.compile(_START + r"xai-[A-Za-z0-9]{32,}"), None),
    ("aws-access-key", re.compile(_START + r"AKIA[0-9A-Z]{16}(?![A-Za-z0-9])"), None),
    # Real Slack tokens always carry numeric team/user ids.
    ("slack-token", re.compile(_START + r"xox[abprs]-[A-Za-z0-9-]{10,}"), _has_digit),
)

KINDS = tuple(kind for kind, _, _ in _TOKENS) + ("private-key",)


def scan(text: str) -> List[Tuple[int, int, str]]:
    """Every credential in `text` as (start, end, kind), in order, non-overlapping."""
    spans: List[Tuple[int, int, str]] = []
    for match in _PEM.finditer(text):
        if _is_private_key(match):
            spans.append((match.start(), match.end(), "private-key"))
    for kind, pattern, test in _TOKENS:
        for match in pattern.finditer(text):
            value = match.group(0)
            if _is_placeholder(value) or (test is not None and not test(value)):
                continue
            spans.append((match.start(), match.end(), kind))
    spans.sort(key=lambda span: (span[0], -span[1]))
    kept: List[Tuple[int, int, str]] = []
    for span in spans:
        if not kept or span[0] >= kept[-1][1]:
            kept.append(span)
    return kept


def redact(text: str) -> Tuple[str, List[Hit]]:
    """
    Replace every credential in `text` with `[REDACTED:<kind>]`.

    Returns the redacted text and one Hit per credential, in order; a line
    number refers to `text` as given. Text without a credential comes back
    unchanged (the same object).
    """
    spans = scan(text)
    if not spans:
        return text, []
    parts: List[str] = []
    hits: List[Hit] = []
    position = 0
    for start, end, kind in spans:
        parts.append(text[position:start])
        parts.append(REDACTED.format(kind=kind))
        hits.append(Hit(kind, text.count("\n", 0, start) + 1))
        position = end
    parts.append(text[position:])
    return "".join(parts), hits
