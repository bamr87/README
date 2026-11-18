"""
Fake credentials for the secret-screen tests.

Every value is assembled at runtime from a seeded generator, so this
repository never commits a credential-shaped literal: GitHub push protection
and secret scanning would flag one, and so would the screen itself. None of
these values is or ever was a real credential.
"""

import random
import string

_ALNUM = string.ascii_letters + string.digits


def fake_secrets(seed: int = 53) -> dict:
    """One credential-shaped value per secret-screen kind (kind -> value)."""
    rng = random.Random(seed)

    def run(length: int, alphabet: str = _ALNUM) -> str:
        return "".join(rng.choice(alphabet) for _ in range(length))

    key_lines = "\n".join(run(64, _ALNUM + "+/") for _ in range(6))
    return {
        "github-token": "gh" + "p_" + run(36),
        "github-pat": "github" + "_pat_" + run(22) + "_" + run(59),
        "anthropic-key": "sk-" + "ant-api03-" + run(93, _ALNUM + "-_") + "AA",
        "xai-key": "xa" + "i-" + run(80),
        "aws-access-key": "AK" + "IA" + run(16, string.ascii_uppercase + "234567"),
        "slack-token": "xo" + "xb-" + run(11, string.digits) + "-"
                       + run(13, string.digits) + "-" + run(24),
        "private-key": pem("RSA", key_lines),
    }


def pem(label: str, body: str) -> str:
    """A PEM private-key block around `body` (the armour is split here too)."""
    armour = f"{label} PRIV" + "ATE KEY-----"
    return f"-----BEGIN {armour}\n{body}\n-----END {armour}"


# Documentation placeholders the screen must leave alone.
PLACEHOLDERS = (
    "gh" + "p_yourFinegrainedToken",
    "gh" + "p_" + "x" * 36,
    "github" + "_pat_" + "x" * 22 + "_" + "x" * 59,
    "sk-" + "ant-api03-your-api-key-goes-here-0123456789",
    "AK" + "IA" + "IOSFODNN7" + "EXAMPLE",
    "AK" + "IA" + "0" * 16,
    "xo" + "xb-your-bot-token-1234567890",
    pem("OPENSSH", "<your private key>"),
    pem("RSA", "..."),
)
