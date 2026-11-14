"""
Integration runner: collect real repositories into a scratch corpus.
"""

import json
import sys
import tempfile
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from scripts.context_engine.collect import collect
from scripts.context_engine.registry import CollectRules, Project, Registry
from tests.config import TEST_CONFIG


class RepoTestRunner:
    """Runs the collect stage against repositories and reports what it took."""

    def __init__(self, output_dir: str):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def run_tests(self, repo_urls: Optional[List[str]] = None) -> Dict:
        urls = repo_urls or [repo["url"] for repo in TEST_CONFIG["test_repos"]]
        results: Dict = {"repos_tested": len(urls), "successful_repos": 0, "failed_repos": 0,
                         "total_files_processed": 0, "total_files_organized": 0, "repos": []}
        for url in urls:
            name = url.rstrip("/").rsplit("/", 1)[-1]
            repo = "/".join(url.rstrip("/").rsplit("/", 2)[-2:])
            project = Project(name=name, repo=repo, url=url)
            registry = Registry(hub={}, projects=[project], collect=CollectRules())
            with tempfile.TemporaryDirectory() as temp:
                root = Path(temp)
                try:
                    entries = collect(registry, docs_dir=root / "docs",
                                      cache_dir=root / "cache" / "collect",
                                      manifest_path=root / "collect.json",
                                      log_path=root / "log.jsonl")
                    pages = entries[name]["pages"]
                    results["successful_repos"] += 1
                    results["total_files_processed"] += entries[name]["tracked_markdown"]
                    results["total_files_organized"] += pages
                    results["repos"].append({"url": url, "pages": pages})
                except RuntimeError as exc:
                    results["failed_repos"] += 1
                    results["repos"].append({"url": url, "error": str(exc)})
        stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        path = self.output_dir / f"integration_repo_results_{stamp}.json"
        path.write_text(json.dumps(results, indent=2), encoding="utf-8")
        return results
