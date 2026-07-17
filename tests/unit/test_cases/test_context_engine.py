"""
Unit tests for the context engine, the SCHEMA.md drift gate, and the MCP
server dispatch. Everything runs offline against tempdir fixtures.
"""

import importlib.util
import json
import shutil
import sys
import tempfile
import unittest
from pathlib import Path

# Add the project root to the path
PROJECT_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(PROJECT_ROOT))

from scripts.context_engine import assembler, extractor, indexer, query  # noqa: E402
from scripts.context_engine.ai import MockProvider, get_provider  # noqa: E402
from scripts.context_engine.registry import (  # noqa: E402
    Registry, RegistryError, load_registry, sync_repos_txt,
)
from scripts.context_engine.synthesizer import build_card  # noqa: E402

REGISTRY_YAML = """
version: 1
hub:
  name: testhub
  repo: owner/hub
  url: https://github.com/owner/hub
  description: Test hub description.
defaults:
  status: active
  aggregate: true
projects:
  - name: alpha
    repo: owner/alpha
    url: https://github.com/owner/alpha
    kind: tooling
    description: Alpha automation tools.
    topics: [automation, python]
  - name: beta
    repo: owner/beta
    url: https://github.com/owner/beta
    branch: gh-pages
    kind: site
    status: archived
    description: Archived site.
  - name: gamma
    repo: owner/gamma
    url: https://github.com/owner/gamma
    kind: docs
    aggregate: false
    description: Reference docs, not aggregated.
"""


def _load_mcp_server():
    spec = importlib.util.spec_from_file_location(
        "mcp_server_under_test", PROJECT_ROOT / "mcp" / "server.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class ContextEngineFixture(unittest.TestCase):
    """Shared tempdir fixtures: a registry file and a mini corpus."""

    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, self.tmp, ignore_errors=True)
        self.registry_path = self.tmp / "projects.yml"
        self.registry_path.write_text(REGISTRY_YAML, encoding="utf-8")
        self.registry = load_registry(self.registry_path)

        self.docs_dir = self.tmp / "docs"
        alpha = self.docs_dir / "alpha"
        (alpha / "guides").mkdir(parents=True)
        (alpha / "README.md").write_text(
            "---\ntitle: Alpha Tools\n---\n\n# Alpha Tools\n\n"
            "Alpha is a toolkit for automating fleet chores with python "
            "scripts and reusable workflows.\n\n## Usage\n\ntext\n",
            encoding="utf-8")
        (alpha / "SCHEMA.md").write_text("# schema\n" + "x" * 600, encoding="utf-8")
        (alpha / "guides" / "install.md").write_text(
            "# Install\n\n" + "words " * 200, encoding="utf-8")


class TestRegistry(ContextEngineFixture):
    def test_defaults_and_fields(self):
        alpha = self.registry.get("alpha")
        self.assertEqual(alpha.kind, "tooling")
        self.assertTrue(alpha.aggregate)
        self.assertEqual(alpha.clone_spec, "https://github.com/owner/alpha")
        beta = self.registry.get("beta")
        self.assertEqual(beta.clone_spec, "https://github.com/owner/beta#gh-pages")

    def test_active_excludes_archived(self):
        names = [p.name for p in self.registry.active()]
        self.assertIn("alpha", names)
        self.assertNotIn("beta", names)

    def test_duplicate_names_rejected(self):
        bad = self.tmp / "dup.yml"
        bad.write_text(REGISTRY_YAML + """
  - name: alpha
    repo: owner/alpha2
    url: https://github.com/owner/alpha2
""", encoding="utf-8")
        with self.assertRaises(RegistryError):
            load_registry(bad)

    def test_sync_repos_txt_generates_and_is_idempotent(self):
        out = self.tmp / "repos.txt"
        self.assertTrue(sync_repos_txt(self.registry, out))
        content = out.read_text(encoding="utf-8")
        self.assertIn("GENERATED from _data/projects.yml", content)
        self.assertIn("https://github.com/owner/alpha", content)
        self.assertIn("# skipped (aggregate: false)", content)
        self.assertNotIn("\nhttps://github.com/owner/beta", content)  # archived
        self.assertFalse(sync_repos_txt(self.registry, out))  # unchanged


class TestExtractor(ContextEngineFixture):
    def test_facts_from_corpus(self):
        alpha = self.registry.get("alpha")
        facts = extractor.extract_facts(alpha, docs_dir=self.docs_dir)
        self.assertTrue(facts["corpus"]["present"])
        self.assertEqual(facts["corpus"]["file_count"], 3)
        self.assertEqual(facts["identity"]["title"], "Alpha Tools")
        self.assertIn("toolkit for automating", facts["identity"]["summary"])
        self.assertTrue(facts["signals"]["has_schema_md"])
        self.assertFalse(facts["signals"]["has_claude_md"])
        self.assertIn("README.md", facts["key_docs"])
        self.assertEqual(facts["structure"]["top_dirs"][0]["name"], "guides")

    def test_fingerprint_stable_and_change_sensitive(self):
        alpha = self.registry.get("alpha")
        fp1 = extractor.extract_facts(alpha, docs_dir=self.docs_dir)["corpus"]["fingerprint"]
        fp2 = extractor.extract_facts(alpha, docs_dir=self.docs_dir)["corpus"]["fingerprint"]
        self.assertEqual(fp1, fp2)
        (self.docs_dir / "alpha" / "new.md").write_text("# new\n", encoding="utf-8")
        fp3 = extractor.extract_facts(alpha, docs_dir=self.docs_dir)["corpus"]["fingerprint"]
        self.assertNotEqual(fp1, fp3)

    def test_missing_corpus_is_graceful(self):
        gamma = self.registry.get("gamma")
        facts = extractor.extract_facts(gamma, docs_dir=self.docs_dir)
        self.assertFalse(facts["corpus"]["present"])
        self.assertEqual(facts["key_docs"], [])


class TestSynthesizerAndAssembler(ContextEngineFixture):
    def _facts(self):
        return {name: extractor.extract_facts(self.registry.get(name),
                                              docs_dir=self.docs_dir)
                for name in ("alpha", "gamma")}

    def test_card_heuristic(self):
        card = build_card(self._facts()["alpha"])
        self.assertIn("# Alpha Tools", card)
        self.assertIn("repo: owner/alpha", card)
        self.assertIn("enrichment: heuristic", card)
        self.assertIn("carries its own SCHEMA.md pyramid", card)

    def test_card_mock_ai(self):
        card = build_card(self._facts()["alpha"], ai=MockProvider())
        self.assertIn("enrichment: ai:mock", card)
        self.assertIn("Mock enrichment", card)

    def test_apex_contains_fleet_table(self):
        facts = self._facts()
        apex = assembler.build_apex(self.registry, facts)
        self.assertIn("consolidated README", apex)
        self.assertIn("| [alpha](cards/alpha.md) | tooling | active |", apex)
        self.assertNotIn("| [beta]", apex)  # archived project excluded

    def test_auto_span_injection(self):
        readme = self.tmp / "README.md"
        readme.write_text(
            "# Repo\n\n<!-- AUTO:projects:begin -->\nstale\n"
            "<!-- AUTO:projects:end -->\ntail\n", encoding="utf-8")
        table = assembler.fleet_table(self.registry, self._facts())
        self.assertTrue(assembler.inject_auto_span(table, readme))
        text = readme.read_text(encoding="utf-8")
        self.assertIn("[alpha](context/cards/alpha.md)", text)
        self.assertNotIn("stale", text)
        self.assertIn("tail", text)
        self.assertFalse(assembler.inject_auto_span(table, readme))  # idempotent

    def test_auto_span_missing_markers(self):
        readme = self.tmp / "README.md"
        readme.write_text("no markers here\n", encoding="utf-8")
        with self.assertRaises(ValueError):
            assembler.inject_auto_span("|x|", readme)


class TestIndexAndQuery(ContextEngineFixture):
    def _index(self):
        facts = {"alpha": extractor.extract_facts(self.registry.get("alpha"),
                                                  docs_dir=self.docs_dir)}
        cards = {"alpha": build_card(facts["alpha"])}
        apex = assembler.build_apex(
            Registry(hub=self.registry.hub,
                     projects=[self.registry.get("alpha")]), facts)
        return indexer.build_index(
            Registry(hub=self.registry.hub,
                     projects=[self.registry.get("alpha")]),
            facts, cards, apex)

    def test_search_finds_project_by_topic(self):
        index = self._index()
        results = query.search(["automating"], index=index)
        self.assertTrue(results)
        self.assertEqual(results[0]["project"], "alpha")
        self.assertIn("automating", results[0]["matched_terms"])

    def test_search_prefix_expansion_and_miss(self):
        index = self._index()
        self.assertTrue(query.search(["automat"], index=index))
        self.assertEqual(query.search(["zzzznope"], index=index), [])

    def test_list_projects(self):
        projects = query.list_projects(index=self._index())
        self.assertEqual(projects[0]["name"], "alpha")
        self.assertEqual(projects[0]["card"], "context/cards/alpha.md")


class TestAIProviderSelection(unittest.TestCase):
    def test_off_and_mock(self):
        self.assertIsNone(get_provider("off"))
        self.assertIsInstance(get_provider("mock"), MockProvider)

    def test_auto_without_keys_is_none(self):
        import os
        saved = {k: os.environ.pop(k, None)
                 for k in ("ANTHROPIC_API_KEY", "XAI_API_KEY", "GROK_API_KEY")}
        try:
            self.assertIsNone(get_provider("auto"))
        finally:
            for key, value in saved.items():
                if value is not None:
                    os.environ[key] = value


class TestSchemaLint(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, self.tmp, ignore_errors=True)
        sys.path.insert(0, str(PROJECT_ROOT / "scripts"))
        import schema_lint
        self.lint = schema_lint

    def _write_schema(self, rows, coverage="listed"):
        (self.tmp / "SCHEMA.md").write_text(
            "---\nschema: \"0.1\"\ncoverage: " + coverage + "\n---\n\n"
            "# SCHEMA — test\n\n## Structure\n\n"
            "| entry | kind | purpose | rules |\n|---|---|---|---|\n"
            + "\n".join(rows) + "\n", encoding="utf-8")

    def test_clean_tree_passes(self):
        (self.tmp / "thing.md").write_text("x", encoding="utf-8")
        self._write_schema(["| `thing.md` | file | a thing | required |"])
        errors, _warnings = self.lint.lint_directory(self.tmp, [])
        self.assertEqual(errors, [])

    def test_missing_required_entry_fails(self):
        self._write_schema(["| `absent.md` | file | missing | required |"])
        errors, _ = self.lint.lint_directory(self.tmp, [])
        self.assertTrue(any("required file `absent.md` is missing" in e for e in errors))

    def test_coverage_full_flags_unlisted(self):
        (self.tmp / "listed.md").write_text("x", encoding="utf-8")
        (self.tmp / "rogue.md").write_text("x", encoding="utf-8")
        self._write_schema(["| `listed.md` | file | ok | required |"], coverage="full")
        errors, _ = self.lint.lint_directory(self.tmp, [])
        self.assertTrue(any("rogue.md" in e and "not listed" in e for e in errors))

    def test_generated_entries_may_be_absent(self):
        self._write_schema(["| `built/` | dir | build output | generated |"])
        errors, warnings = self.lint.lint_directory(self.tmp, [])
        self.assertEqual(errors, [])
        self.assertEqual(warnings, [])

    def test_repo_pyramid_is_clean(self):
        errors, _ = self.lint.lint_directory(PROJECT_ROOT, [])
        self.assertEqual(errors, [])


class TestMCPServer(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = _load_mcp_server()

    def _call(self, method, params=None, request_id=1):
        return self.server.handle_request(
            {"jsonrpc": "2.0", "id": request_id, "method": method,
             "params": params or {}})

    def test_initialize_echoes_protocol_version(self):
        response = self._call("initialize", {"protocolVersion": "2024-11-05"})
        self.assertEqual(response["result"]["protocolVersion"], "2024-11-05")
        self.assertEqual(response["result"]["serverInfo"]["name"],
                         "readme-context-engine")

    def test_notifications_get_no_response(self):
        self.assertIsNone(self.server.handle_request(
            {"jsonrpc": "2.0", "method": "notifications/initialized"}))

    def test_tools_list(self):
        response = self._call("tools/list")
        names = {tool["name"] for tool in response["result"]["tools"]}
        self.assertEqual(names, {"list_projects", "get_project", "search_context",
                                 "get_readme", "get_schema", "context_status"})

    def test_unknown_method_is_json_rpc_error(self):
        response = self._call("prompts/list")
        self.assertEqual(response["error"]["code"], -32601)

    def test_unknown_tool_is_invalid_params(self):
        response = self._call("tools/call", {"name": "nope", "arguments": {}})
        self.assertEqual(response["error"]["code"], -32602)

    def test_get_schema_rejects_escape(self):
        response = self._call("tools/call",
                              {"name": "get_schema",
                               "arguments": {"path": "../../etc"}})
        self.assertTrue(response["result"]["isError"])

    def test_get_schema_reads_root(self):
        response = self._call("tools/call", {"name": "get_schema", "arguments": {}})
        self.assertFalse(response["result"]["isError"])
        self.assertIn("SCHEMA", response["result"]["content"][0]["text"])

    @unittest.skipUnless(
        (PROJECT_ROOT / "context" / "index" / "context_index.json").is_file(),
        "context pyramid not built")
    def test_list_projects_over_built_context(self):
        response = self._call("tools/call", {"name": "list_projects", "arguments": {}})
        self.assertFalse(response["result"].get("isError"))
        projects = json.loads(response["result"]["content"][0]["text"])
        self.assertTrue(any(p["name"] == "bashcrawl" for p in projects))


if __name__ == "__main__":
    unittest.main()
