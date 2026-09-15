"""
Health scoring.

One number per repository, 100 minus the weighted penalty of each component.
A component's penalty is the share of its checks that failed, bounded to 1,
so a repository missing everything in one area cannot drag the score below
that component's weight. The components are published alongside the number:
a bare score tells you a repository needs work, the breakdown tells you what.
"""

from typing import Dict, Iterable, List

from .finding import Finding

# Component -> weight. Must sum to 100.
HEALTH_WEIGHTS: Dict[str, int] = {
    "governance": 20,   # README, LICENSE, CONTRIBUTING, CHANGELOG ...
    "readme": 25,       # the front door: sections and substance
    "links": 15,        # documentation that points somewhere real
    "structure": 15,    # directories that explain themselves
    "metadata": 10,     # the GitHub-side description, topics, license
    "quality": 10,      # well-formed, uncompromised markdown
    "agent": 5,         # guidance for the agents that read this fleet
}

# What one finding costs its component, by severity.
SEVERITY_COST = {"error": 1.0, "warn": 0.5, "info": 0.2}
# A component saturates here: beyond it, more findings say nothing new.
COMPONENT_CAP = 4.0

from .checks import CHECKS  # noqa: E402  (registry, imported after weights)


def _component_of(check_id: str) -> str:
    spec = CHECKS.get(check_id)
    return spec.weight_component if spec and spec.weight_component else "quality"


def score_repo(findings: Iterable[Finding]) -> Dict:
    """Score one repository from its findings."""
    raw: Dict[str, float] = {c: 0.0 for c in HEALTH_WEIGHTS}
    counts: Dict[str, int] = {c: 0 for c in HEALTH_WEIGHTS}
    for finding in findings:
        component = finding.component or _component_of(finding.check)
        if component not in raw:
            component = "quality"
        raw[component] += SEVERITY_COST.get(finding.severity, 0.2)
        counts[component] += 1

    components: Dict[str, Dict] = {}
    penalty_total = 0.0
    for component, weight in HEALTH_WEIGHTS.items():
        share = min(raw[component] / COMPONENT_CAP, 1.0)
        lost = weight * share
        penalty_total += lost
        components[component] = {
            "weight": weight,
            "score": round(weight - lost, 1),
            "findings": counts[component],
            "penalty": round(lost, 1),
        }
    score = max(0, round(100 - penalty_total))
    return {"score": score, "grade": grade(score), "components": components}


def grade(score: int) -> str:
    if score >= 90:
        return "A"
    if score >= 80:
        return "B"
    if score >= 70:
        return "C"
    if score >= 55:
        return "D"
    return "F"


def rank(scored: Dict[str, Dict]) -> List[str]:
    """Repository names worst-first, ties broken by name for stability."""
    return [name for name, _ in sorted(
        scored.items(), key=lambda kv: (kv[1]["score"], kv[0]))]
