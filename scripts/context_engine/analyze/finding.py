"""The finding contract: one machine-readable result of one check."""

from dataclasses import dataclass, field
from typing import Dict, Optional

SEVERITIES = ("error", "warn", "info")
CLASSES = ("gap", "quality", "drift", "alignment")


@dataclass
class Finding:
    """
    One defect, with a stable key.

    `key` is `check:repo:subject` and must never contain volatile text (a
    count, a date, a fingerprint), so a finding that persists across runs
    keeps its identity and one that is fixed upstream simply disappears.
    """

    check: str
    cls: str
    severity: str
    repo: str
    message: str
    subject: str = ""
    path: Optional[str] = None
    remedy: str = ""
    evidence: Dict = field(default_factory=dict)
    # Which health component this finding charges, when it differs from the
    # check's default (a check can produce findings about different things).
    component: str = ""

    def __post_init__(self) -> None:
        if self.severity not in SEVERITIES:
            raise ValueError(f"unknown severity: {self.severity}")
        if self.cls not in CLASSES:
            raise ValueError(f"unknown class: {self.cls}")

    @property
    def key(self) -> str:
        return f"{self.check}:{self.repo}:{self.subject}" if self.subject \
            else f"{self.check}:{self.repo}"

    def to_dict(self) -> Dict:
        return {
            "key": self.key, "check": self.check, "class": self.cls,
            "severity": self.severity, "repo": self.repo,
            "subject": self.subject, "path": self.path,
            "message": self.message, "remedy": self.remedy,
            "component": self.component, "evidence": self.evidence,
        }
