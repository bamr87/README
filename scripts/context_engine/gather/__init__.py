"""
Gather stage: turn a repository into a source manifest, cheaply.

The `git` adapter uses a shallow, blobless clone (`--depth=1
--filter=blob:none --no-checkout`), which gives the complete file tree
offline for a few hundred kilobytes and fetches individual blobs only when
a check actually reads one. A 100-file repository clones in under a second.

Output is one manifest per repository (`context/sources/<name>.json`): head
commit and date, the detected stack, the documentation inventory, and a
fingerprint. The manifest is a summary, not a mirror - the working clone
stays in the cache directory and is what link checks read.
"""

from .adapters import (  # noqa: F401
    CACHE_DIR, GatherError, RepoSource, gather_local, gather_repo, gather_fleet,
)
