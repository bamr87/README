"""
Unit tests for the context engine, its navigation layer, the SCHEMA.md drift
gate, and the MCP server dispatch. Everything runs offline against tempdir
fixtures.
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

from scripts.context_engine import (  # noqa: E402
    assembler, extractor, indexer, navigator, query,
)
from scripts.context_engine.ai import MockProvider, get_provider  # noqa: E402
from scripts.context_engine.registry import (  # noqa: E402
    NavDefaults, NavSpec, Registry, RegistryError, load_registry,
    sync_repos_txt,
)
from scripts.context_engine.synthesizer import build_card  # noqa: E402

REGISTRY_YAML = """
version: 1
hub:
  name: testhub
  repo: owner/hub
  url: https://github.com/owner/hub
  description: Test hub description.
navigation:
  max_depth: 3
  publish_hidden: true
  exclude: ["**/noise/**"]
  section_titles:
    .github: GitHub
    guides: Guides
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
    nav:
      title: Alpha Tools
      order: 5
      exclude: ["drafts/**"]
      groups:
        - title: Repository
          match: [".github"]
        - title: Deep Dive
          match: ["deep"]
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
        (alpha / "guides" / "index.md").write_text(
            "---\ntitle: Guides Landing\n---\n\n# Guides Landing\n", encoding="utf-8")
        (alpha / "guides" / "advanced.md").write_text(
            "---\ntitle: Advanced\nnav_order: 1\n---\n\n# Advanced\n",
            encoding="utf-8")
        (alpha / "guides" / "hidden.md").write_text(
            "---\ntitle: Hidden\nnav_exclude: true\n---\n\n# Hidden\n",
            encoding="utf-8")
        (alpha / ".github").mkdir()
        (alpha / ".github" / "WORKFLOW.md").write_text(
            "---\ntitle: Workflow\n---\n\n# Workflow\n", encoding="utf-8")
        (alpha / "solo").mkdir()
        (alpha / "solo" / "SKILL.md").write_text(
            "---\ntitle: Skill\n---\n\n# Skill\n", encoding="utf-8")
        (alpha / "drafts").mkdir()
        (alpha / "drafts" / "wip.md").write_text("# WIP\n", encoding="utf-8")
        deep = alpha / "deep" / "one" / "two" / "three"
        deep.mkdir(parents=True)
        (deep / "buried.md").write_text(
            "---\ntitle: Buried\n---\n\n# Buried\n", encoding="utf-8")


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
        self.assertEqual(facts["corpus"]["file_count"], 10)
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

    def test_rollups_match_documents_by_path_prefix(self):
        # The corpus index's `repository` field is legacy (holds the
        # project's subdirectory); rollups must attribute by path prefix.
        docs_index = {"documents": [
            {"path": "alpha/guides/x.md", "repository": "guides",
             "word_count": 100, "tags": ["Python"], "category": "alpha",
             "code_blocks": [{"language": "bash", "lines": 3}]},
            {"path": "alpha/y.md", "repository": None, "word_count": 50,
             "tags": ["automation"], "category": "alpha", "code_blocks": []},
            {"path": "alphabet/z.md", "repository": "alpha",  # decoy
             "word_count": 999, "tags": ["decoy"], "category": "alphabet",
             "code_blocks": []},
        ]}
        alpha = self.registry.get("alpha")
        facts = extractor.extract_facts(alpha, docs_dir=self.docs_dir,
                                        docs_index=docs_index)
        rollups = facts["rollups"]
        self.assertEqual(rollups["indexed_documents"], 2)
        self.assertEqual(rollups["total_words"], 150)
        self.assertIn("python", rollups["top_tags"])
        self.assertNotIn("decoy", rollups["top_tags"])
        self.assertEqual(rollups["code_languages"], ["bash"])


class TestNavigator(ContextEngineFixture):
    """The navigation layer: folder hierarchy + registry contract -> sidebar."""

    def _nav(self, name="alpha"):
        project = self.registry.get(name)
        return navigator.build_project_nav(
            name, project.nav_title, project.nav, self.registry.navigation,
            docs_dir=self.docs_dir)

    def _pages(self, node, out=None):
        out = [] if out is None else out
        for child in node.get("children") or []:
            if child["type"] == "page":
                out.append(child["path"])
            else:
                self._pages(child, out)
        return out

    def _titles(self, node):
        return [child["title"] for child in node.get("children") or []]

    def test_registry_navigation_contract_parses(self):
        alpha = self.registry.get("alpha")
        self.assertEqual(alpha.nav_title, "Alpha Tools")
        self.assertEqual(alpha.nav.order, 5)
        self.assertEqual(alpha.nav.exclude, ["drafts/**"])
        self.assertEqual([g.title for g in alpha.nav.groups],
                         ["Repository", "Deep Dive"])
        self.assertEqual(self.registry.navigation.max_depth, 3)
        self.assertEqual(self.registry.navigation.section_titles["guides"], "Guides")
        # nav_ordered puts an explicit order ahead of registry order
        self.assertEqual(self.registry.nav_ordered()[0].name, "alpha")

    def test_registry_rejects_malformed_nav(self):
        bad = self.tmp / "bad.yml"
        bad.write_text(REGISTRY_YAML.replace(
            "      order: 5", "      order: not-a-number"), encoding="utf-8")
        with self.assertRaises(RegistryError):
            load_registry(bad)

    def test_tree_covers_every_publishable_page(self):
        nav = self._nav()
        paths = set(self._pages(nav["tree"]))
        self.assertIn("alpha/README.md", paths)
        self.assertIn("alpha/guides/install.md", paths)
        self.assertIn("alpha/deep/one/two/three/buried.md", paths)  # past max_depth
        # GitHub Pages 404s dot-paths, so hidden dirs stay out of the sidebar.
        self.assertNotIn("alpha/.github/WORKFLOW.md", paths)
        self.assertNotIn("alpha/drafts/wip.md", paths)      # nav.exclude
        self.assertNotIn("alpha/guides/hidden.md", paths)   # nav_exclude frontmatter
        self.assertEqual(nav["counts"]["pages"], len(paths))

    def test_hidden_dirs_enter_the_nav_only_when_asked(self):
        defaults = self.registry.navigation
        self.assertFalse(defaults.navigate_hidden)      # registry default
        project = self.registry.get("alpha")
        defaults.navigate_hidden = True
        nav = navigator.build_project_nav(
            "alpha", project.nav_title, project.nav, defaults,
            docs_dir=self.docs_dir)
        self.assertIn("alpha/.github/WORKFLOW.md", self._pages(nav["tree"]))
        # ...and the group that targets it fires again.
        self.assertEqual(nav["tree"]["children"][0]["title"], "Repository")

    def test_titles_and_index_pages(self):
        nav = self._nav()
        guides = next(c for c in nav["tree"]["children"]
                      if c["type"] != "page" and c["title"] == "Guides")
        self.assertEqual(guides["index"], "alpha/guides/index.md")
        # landing page first (keeping its own title), then the explicit
        # nav_order, then the rest by title
        self.assertEqual([c["title"] for c in guides["children"]],
                         ["Guides Landing", "Advanced", "Install"])
        self.assertTrue(guides["children"][0]["is_index"])

    def test_section_title_from_registry_beats_index_title(self):
        # `guides` is mapped in navigation.section_titles, so the curated
        # label wins over the index page's own "Guides Landing" title.
        titles = self._titles(self._nav()["tree"])
        self.assertIn("Guides", titles)
        self.assertNotIn("Guides Landing", titles)

    def test_groups_lift_matching_paths_to_the_top(self):
        children = self._nav()["tree"]["children"]
        # "Repository" targets .github, which is not navigated: an empty group
        # is dropped rather than rendered as a dead section.
        self.assertNotIn("Repository", [c["title"] for c in children])
        self.assertEqual(children[0]["title"], "Deep Dive")
        self.assertEqual(children[0]["type"], "group")
        self.assertTrue(
            all(p.startswith("alpha/deep/") for p in self._pages(children[0])))

    def test_depth_cap_flattens_instead_of_dropping(self):
        nav = self._nav()
        self.assertLessEqual(nav["counts"]["max_depth"],
                             self.registry.navigation.max_depth + 1)
        buried = [p for p in self._pages(nav["tree"])
                  if p.endswith("buried.md")]
        self.assertEqual(len(buried), 1)

    def test_single_page_folder_is_collapsed(self):
        # alpha/solo holds one generically-named page (SKILL.md): the folder
        # becomes one entry titled after itself, not a click-through.
        children = self._nav()["tree"]["children"]
        solo = [c for c in children if c.get("path") == "alpha/solo/SKILL.md"]
        self.assertEqual(len(solo), 1)
        self.assertEqual(solo[0]["type"], "page")
        self.assertEqual(solo[0]["title"], "Solo")
        self.assertEqual(solo[0]["folder"], "solo")

    def test_readme_shadowed_by_index_is_skipped(self):
        # MkDocs drops README.md when a sibling index.md exists; so must we.
        (self.docs_dir / "alpha" / "index.md").write_text(
            "---\ntitle: Alpha Home\n---\n\n# Alpha Home\n", encoding="utf-8")
        paths = self._pages(self._nav()["tree"])
        self.assertIn("alpha/index.md", paths)
        self.assertNotIn("alpha/README.md", paths)

    def test_fingerprint_is_stable_and_change_sensitive(self):
        first = self._nav()["fingerprint"]
        self.assertEqual(first, self._nav()["fingerprint"])
        (self.docs_dir / "alpha" / "guides" / "extra.md").write_text(
            "# Extra\n", encoding="utf-8")
        self.assertNotEqual(first, self._nav()["fingerprint"])

    def test_missing_corpus_yields_empty_tree(self):
        nav = navigator.build_project_nav(
            "gamma", "Gamma", NavSpec(), NavDefaults(), docs_dir=self.docs_dir)
        self.assertEqual(nav["counts"]["pages"], 0)
        self.assertEqual(nav["tree"]["children"], [])

    def test_glob_matching_segment_semantics(self):
        single = navigator.GlobSet(["a/*"])
        self.assertTrue(single.matches("a/b"))
        self.assertFalse(single.matches("a/b/c"))     # `*` stays in one segment
        deep = navigator.GlobSet(["a/**"])
        self.assertTrue(deep.matches("a/b/c"))
        self.assertTrue(navigator.GlobSet(["**/.*/**"]).matches("x/.git/y"))

    def test_titles_are_flattened_for_the_sidebar(self):
        self.assertEqual(navigator.clean_title("`.quests/` — **data** layer"),
                         ".quests/ — data layer")
        self.assertTrue(navigator.clean_title("word " * 40).endswith("…"))
        self.assertEqual(navigator.humanize("cms-curator"), "CMS Curator")

    def test_fleet_nav_finds_unregistered_corpora(self):
        (self.docs_dir / "orphan").mkdir()
        (self.docs_dir / "orphan" / "note.md").write_text(
            "# Note\n", encoding="utf-8")
        fleet = navigator.build_fleet_nav(self.registry, docs_dir=self.docs_dir)
        self.assertEqual([e["project"] for e in fleet["extras"]], ["orphan"])
        self.assertIn("alpha", fleet["projects"])
        self.assertNotIn("beta", fleet["projects"])       # archived

    def test_mkdocs_nav_renders_valid_yaml_and_exclusions(self):
        import yaml as _yaml
        fleet = navigator.build_fleet_nav(self.registry, docs_dir=self.docs_dir)
        rendered = navigator.render_mkdocs_nav(fleet, self.registry)
        parsed = _yaml.safe_load(rendered)
        self.assertIn("nav", parsed)
        self.assertIn("exclude_docs", parsed)
        self.assertIn("!**/.*", parsed["exclude_docs"])         # publish_hidden
        self.assertIn("alpha/drafts/**", parsed["exclude_docs"])  # project rule
        self.assertIn("**/noise/**", parsed["exclude_docs"])      # fleet rule
        top = [next(iter(entry)) for entry in parsed["nav"]]
        self.assertEqual(top[0], "Home")
        self.assertIn("Alpha Tools", top)
        self.assertIn("Browse", top)

    def test_mkdocs_nav_declares_published_but_unlisted_pages(self):
        import yaml as _yaml
        fleet = navigator.build_fleet_nav(self.registry, docs_dir=self.docs_dir)
        parsed = _yaml.safe_load(navigator.render_mkdocs_nav(fleet, self.registry))
        # Built (exclude_docs re-includes them) but intentionally out of the
        # nav, so MkDocs must be told rather than warning about orphan pages.
        self.assertIn("!**/.*", parsed["exclude_docs"])
        self.assertIn("**/.*", parsed["not_in_nav"])

        self.registry.navigation.navigate_hidden = True
        parsed = _yaml.safe_load(navigator.render_mkdocs_nav(
            navigator.build_fleet_nav(self.registry, docs_dir=self.docs_dir),
            self.registry))
        self.assertNotIn("not_in_nav", parsed)   # nothing is unlisted now

    def test_every_nav_target_exists_on_disk(self):
        fleet = navigator.build_fleet_nav(self.registry, docs_dir=self.docs_dir)
        for path in self._pages(fleet["projects"]["alpha"]["tree"]):
            self.assertTrue((self.docs_dir / path).is_file(), path)

    def test_browse_pages_render(self):
        fleet = navigator.build_fleet_nav(self.registry, docs_dir=self.docs_dir)
        page = navigator.render_browse_project(fleet["projects"]["alpha"])
        self.assertIn("# Alpha Tools - content map", page)
        self.assertIn("nav_exclude: true", page)          # maps stay out of the nav
        self.assertIn("(../alpha/guides/install.md)", page)
        index = navigator.render_browse_index(fleet, self.registry)
        self.assertIn("# Content map", index)
        self.assertIn("[Alpha Tools](alpha.md)", index)

    def test_writers_are_idempotent(self):
        fleet = navigator.build_fleet_nav(self.registry, docs_dir=self.docs_dir)
        nav_dir = self.tmp / "context" / "nav"
        fleet_path = nav_dir / "index.json"
        navigator.write_nav_tree(fleet, nav_dir=nav_dir, fleet_path=fleet_path)
        stamps = {p: p.stat().st_mtime_ns for p in sorted(nav_dir.glob("*.json"))}
        navigator.write_nav_tree(fleet, nav_dir=nav_dir, fleet_path=fleet_path)
        self.assertEqual(
            stamps, {p: p.stat().st_mtime_ns for p in sorted(nav_dir.glob("*.json"))})
        self.assertTrue((nav_dir / "alpha.json").is_file())

    def test_check_nav_reports_drift(self):
        from unittest.mock import patch
        nav_dir = self.tmp / "context" / "nav"
        browse_dir = self.tmp / "docs" / "browse"
        mkdocs_nav = self.tmp / "nav.yml"
        fleet_path = nav_dir / "index.json"
        targets = {
            "NAV_DIR": nav_dir, "NAV_FLEET_PATH": fleet_path,
            "BROWSE_DIR": browse_dir, "MKDOCS_NAV_PATH": mkdocs_nav,
            "ROOT": self.tmp,
        }
        with patch.multiple(navigator, **targets):
            self.assertTrue(navigator.check_nav(
                self.registry, docs_dir=self.docs_dir))     # nothing written yet
            navigator.navigate(self.registry, docs_dir=self.docs_dir)
            self.assertEqual(navigator.check_nav(
                self.registry, docs_dir=self.docs_dir), [])
            (self.docs_dir / "alpha" / "brand-new.md").write_text(
                "# Brand New\n", encoding="utf-8")
            drift = navigator.check_nav(self.registry, docs_dir=self.docs_dir)
            self.assertTrue(any("stale" in entry for entry in drift))

    def test_nav_facts_fold_into_the_fact_sheet(self):
        nav = self._nav()
        facts = extractor.extract_facts(self.registry.get("alpha"),
                                        docs_dir=self.docs_dir)
        extractor.attach_nav_facts(facts, nav)
        self.assertTrue(facts["navigation"]["present"])
        self.assertEqual(facts["navigation"]["pages"], nav["counts"]["pages"])
        self.assertEqual(facts["navigation"]["browse"], "docs/browse/alpha.md")
        card = build_card(facts)
        self.assertIn("## Navigation", card)
        self.assertIn("Repository", card)
        extractor.attach_nav_facts(facts, None)
        self.assertFalse(facts["navigation"]["present"])


class TestIconNormalizer(unittest.TestCase):
    """Unresolvable `icon:` frontmatter is what used to break nav rendering."""

    def setUp(self):
        sys.path.insert(0, str(PROJECT_ROOT / "scripts"))
        import fix_frontmatter_icons
        self.fixer = fix_frontmatter_icons
        self.tmp = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, self.tmp, ignore_errors=True)

    def test_resolve_known_bootstrap_names(self):
        self.assertEqual(self.fixer.resolve_icon("bi-gear"), "material/cog")
        self.assertEqual(self.fixer.resolve_icon("bi bi-gear"), "material/cog")
        self.assertEqual(self.fixer.resolve_icon("globe"), "material/web")
        self.assertEqual(self.fixer.resolve_icon('"bi-robot"'), "material/robot")

    def test_already_valid_is_left_alone(self):
        self.assertEqual(self.fixer.resolve_icon("material/cog"), "material/cog")
        fm, changed = self.fixer.normalize_frontmatter({"icon": "material/cog"})
        self.assertFalse(changed)
        self.assertNotIn("source_icon", fm)

    def test_unknown_icon_is_dropped_but_preserved(self):
        fm, changed = self.fixer.normalize_frontmatter({"icon": "made-up"})
        self.assertTrue(changed)
        self.assertNotIn("icon", fm)
        self.assertEqual(fm["source_icon"], "made-up")

    def test_file_rewrite_is_idempotent(self):
        path = self.tmp / "page.md"
        path.write_text("---\ntitle: T\nicon: bi-gear\n---\n\n# T\n",
                        encoding="utf-8")
        self.assertIsNotNone(self.fixer.process_file(path, apply=True))
        text = path.read_text(encoding="utf-8")
        self.assertIn("icon: material/cog", text)
        self.assertIn("source_icon: bi-gear", text)
        self.assertIn("# T", text)
        self.assertIsNone(self.fixer.process_file(path, apply=True))

    def test_file_without_icon_is_untouched(self):
        path = self.tmp / "plain.md"
        original = "---\ntitle: T\n---\n\n# T\n"
        path.write_text(original, encoding="utf-8")
        self.assertIsNone(self.fixer.process_file(path, apply=True))
        self.assertEqual(path.read_text(encoding="utf-8"), original)



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
        self.assertIn("| Project | Kind | Status | Docs | Sections |", apex)
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


AUTH_ENV_KEYS = ("ANTHROPIC_API_KEY", "ANTHROPIC_AUTH_TOKEN",
                 "CLAUDE_CODE_OAUTH_TOKEN", "XAI_API_KEY", "GROK_API_KEY")


class TestAIProviderSelection(unittest.TestCase):
    def _clean_env(self, **values):
        from unittest.mock import patch
        env = {key: "" for key in AUTH_ENV_KEYS}
        env.update(values)
        # empty-string values behave as unset for os.getenv-or-chains
        patcher = patch.dict("os.environ", env)
        patcher.start()
        self.addCleanup(patcher.stop)

    def test_off_and_mock(self):
        self.assertIsNone(get_provider("off"))
        self.assertIsInstance(get_provider("mock"), MockProvider)

    def test_auto_without_keys_is_none(self):
        self._clean_env()
        self.assertIsNone(get_provider("auto"))

    def test_auto_picks_anthropic_on_oauth_token(self):
        from scripts.context_engine.ai import AnthropicProvider
        self._clean_env(CLAUDE_CODE_OAUTH_TOKEN="dummy-oauth-token")
        provider = get_provider("auto")
        self.assertIsInstance(provider, AnthropicProvider)
        self.assertEqual(provider.auth_mode, "oauth")
        headers = provider._headers()
        self.assertEqual(headers["Authorization"], "Bearer dummy-oauth-token")
        self.assertEqual(headers["anthropic-beta"], AnthropicProvider.OAUTH_BETA)
        self.assertNotIn("x-api-key", headers)

    def test_api_key_wins_over_oauth(self):
        from scripts.context_engine.ai import AnthropicProvider
        self._clean_env(ANTHROPIC_API_KEY="dummy-key",
                        ANTHROPIC_AUTH_TOKEN="dummy-oauth-token")
        provider = AnthropicProvider()
        self.assertEqual(provider.auth_mode, "api-key")
        headers = provider._headers()
        self.assertEqual(headers["x-api-key"], "dummy-key")
        self.assertNotIn("Authorization", headers)
        self.assertNotIn("anthropic-beta", headers)

    def test_anthropic_without_any_credential_raises(self):
        from scripts.context_engine.ai import AIError, AnthropicProvider
        self._clean_env()
        with self.assertRaises(AIError):
            AnthropicProvider()


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
                                 "get_readme", "get_nav", "get_schema",
                                 "context_status"})

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

    def test_get_nav_prunes_to_requested_depth(self):
        tree = {"type": "section", "title": "root", "children": [
            {"type": "section", "title": "a", "children": [
                {"type": "section", "title": "b", "children": [
                    {"type": "page", "title": "p", "path": "x/p.md"}]}]}]}
        pruned = self.server._prune_depth(tree, 1)
        self.assertEqual(pruned["children"][0]["children_omitted"], 1)
        self.assertNotIn("children", pruned["children"][0])

    @unittest.skipUnless(
        (PROJECT_ROOT / "context" / "nav" / "index.json").is_file(),
        "navigation not built")
    def test_get_nav_over_built_context(self):
        response = self._call("tools/call", {"name": "get_nav", "arguments": {}})
        self.assertFalse(response["result"].get("isError"))
        corpora = json.loads(response["result"]["content"][0]["text"])
        self.assertTrue(any(c["name"] == "bashcrawl" for c in corpora))
        self.assertTrue(all("pages" in c for c in corpora))

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
