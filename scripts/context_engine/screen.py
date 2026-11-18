"""
Injection screen: the build-side gate on untrusted upstream text.

Every string in a fact sheet came from an upstream repository's Markdown,
and the engine pastes those strings into AI prompts, then commits and serves
what comes back. This module checks both directions with the survey's Q4
patterns (`analyze/checks.INJECTION_RE`, the single pattern source):

  - `screen_facts` runs them over every string of a fact sheet (or the apex
    digest) before it reaches a prompt;
  - `screen_text` runs them over an AI completion before it is written;
  - `completion_problem` holds a completion to its output contract: one plain
    paragraph under a length cap, with no URL or link the facts do not
    already contain and no hidden markup.

A Q4 hit quarantines the project: the card keeps the heuristic essence and
records `enrichment: quarantined`, the build log prints
`[screen] <project>: <label> in <field>`, the manifest lists the hit, and
CONTEXT_INJECTION_STRICT=1 makes `build` exit non-zero. A completion that
breaks the output contract falls back to heuristic text without a quarantine.
"""

import os
import re
import unicodedata
from typing import Dict, Iterator, List, Optional, Tuple

from .analyze.checks import INJECTION_RE

STRICT_ENV = "CONTEXT_INJECTION_STRICT"
# Twice the longest essence a real provider has written (about 600 chars).
MAX_COMPLETION_CHARS = 1200

Hit = Tuple[str, str]   # (field, label)

_URL = re.compile(r"(?:https?|ftp)://[^\s<>()\[\]{}\"'`]+|\bwww\.[^\s<>()\[\]{}\"'`]+", re.I)
_LINK_TARGET = re.compile(r"\]\(\s*<?([^)\s>]+)|\b(?:href|src)\s*=\s*[\"']?([^\"'\s>]+)", re.I)
_TRAILING = ".,;:!?)]}'\"/"


def _normalized(text: str) -> str:
    """
    The text a model reads: compatibility forms folded and invisible format
    characters dropped, so a keyword split by a zero-width character
    (`ig\\u200bnore`) or spelled in full-width letters still matches.
    """
    folded = unicodedata.normalize("NFKC", text)
    return "".join(ch for ch in folded if unicodedata.category(ch) != "Cf")


def screen_text(text: str) -> List[str]:
    """Q4 labels that match `text`, raw or normalized, in pattern order."""
    variants = (text, _normalized(text))
    labels: List[str] = []
    for pattern, label in INJECTION_RE:
        if label not in labels and any(pattern.search(v) for v in variants):
            labels.append(label)
    return labels


def _strings(value, path: str = "") -> Iterator[Tuple[str, str]]:
    if isinstance(value, str):
        yield path, value
    elif isinstance(value, dict):
        for key, item in value.items():
            yield from _strings(item, f"{path}.{key}" if path else str(key))
    elif isinstance(value, list):
        for index, item in enumerate(value):
            yield from _strings(item, f"{path}[{index}]")


def screen_facts(facts: Dict) -> List[Hit]:
    """Every (field, label) Q4 hit across the strings of a fact sheet."""
    return [(field, label)
            for field, text in _strings(facts)
            for label in screen_text(text)]


def source_text(facts: Dict) -> str:
    """Every string of a fact sheet, for checking what a completion cites."""
    return "\n".join(text for _, text in _strings(facts))


def completion_problem(text: str, source: str,
                       limit: int = MAX_COMPLETION_CHARS) -> Optional[str]:
    """Why an AI completion breaks the output contract, or None."""
    if len(text) > limit:
        return f"longer than {limit} characters"
    if "<!--" in text or any(unicodedata.category(ch) == "Cf" for ch in text):
        return "hidden markup"
    targets = [m.group(0) for m in _URL.finditer(text)]
    targets += [m.group(1) or m.group(2) for m in _LINK_TARGET.finditer(text)]
    for target in targets:
        cited = target.rstrip(_TRAILING)
        if cited and cited not in source:
            return f"cites {cited}, which is not in the facts"
    return None


def one_paragraph(text: str) -> str:
    """A completion as the single line a card's `> essence` quote holds."""
    return " ".join(text.split())


def report(subject: str, hits: List[Hit],
           findings: Optional[List[Dict]] = None) -> None:
    """Print each hit for the build log and record it for the manifest."""
    for field, label in hits:
        print(f"[screen] {subject}: {label} in {field}")
        if findings is not None:
            findings.append({"subject": subject, "field": field, "label": label})


def quarantined(findings: List[Dict]) -> Dict[str, List[str]]:
    """Findings grouped by subject, as the manifest records them."""
    grouped: Dict[str, List[str]] = {}
    for finding in findings:
        entry = f"{finding['label']} in {finding['field']}"
        entries = grouped.setdefault(finding["subject"], [])
        if entry not in entries:
            entries.append(entry)
    return dict(sorted(grouped.items()))


def strict() -> bool:
    """CONTEXT_INJECTION_STRICT=1: a quarantine fails the build."""
    return os.environ.get(STRICT_ENV) == "1"
