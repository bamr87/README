"""Tests for the collect stage, the vault, the generated notes and the site hook."""

import importlib.util
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT))

from scripts.context_engine import brain, query  # noqa: E402
from scripts.context_engine.collect import (  # noqa: E402
    Source, _load, corpus_path, select, split_front_matter, transform, upstream_path,
)
from scripts.context_engine.registry import (  # noqa: E402
    BrainConfig, CollectRules, Project, Registry, load_registry,
)
from scripts.context_engine.vault import (  # noqa: E402
    Resolver, build_graph, extract_links, looks_like_link, map_prose, norm, parse_note,
    parse_wikilink, scan, split_note, weave_pages, weave_text, wikilink_for, write_graph,
)

PROJECT = Project(name="demo", repo="o/demo", url="https://github.com/o/demo")
SOURCE = Source(root=Path("."), commit="abc", commit_date="2026-01-01", branch="main")


def resolver(pages):
    return Resolver(parse_note(path, text) for path, text in pages.items())


class TestSelect(unittest.TestCase):
    def test_excludes_and_project_include(self):
        fleet = CollectRules(exclude=[".*/**", "**/.*/**", "tests/**"])
        project = CollectRules(include=[".github/skills/**"])
        paths = ["README.md", ".github/CODEOWNERS.md", ".github/skills/a/SKILL.md",
                 "tests/x.md", "apps/one/.vscode/notes.md"]
        self.assertEqual(select(paths, fleet, project),
                         [".github/skills/a/SKILL.md", "README.md"])

    def test_dot_segments_round_trip(self):
        path = ".github/skills/a.md"
        renamed = corpus_path(path, "dot-")
        self.assertEqual(renamed, "dot-github/skills/a.md")
        self.assertEqual(upstream_path(renamed, "dot-"), path)


class TestTransform(unittest.TestCase):
    def test_adds_provenance_without_a_commit(self):
        out = transform("# Title\n\nBody\n", "docs/a.md", PROJECT, SOURCE)
        meta, body = split_front_matter(out)
        self.assertEqual(meta["title"], "Title")
        self.assertEqual(meta["source_file"], "docs/a.md")
        self.assertEqual(meta["source_url"], "https://github.com/o/demo/blob/main/docs/a.md")
        self.assertNotIn("abc", out)
        self.assertIn("Body", body)

    def test_is_idempotent(self):
        once = transform("---\ntags: one\n---\n# T\n", "a.md", PROJECT, SOURCE)
        self.assertEqual(transform(once, "a.md", PROJECT, SOURCE), once)

    def test_relative_links_follow_renamed_directories(self):
        out = transform("[x](../.github/a.md) [y](https://e.com/.x) [z](#.a)\n", "d/a.md",
                        PROJECT, SOURCE)
        self.assertIn("](../dot-github/a.md)", out)
        self.assertIn("](https://e.com/.x)", out)

    def test_unparseable_front_matter_stays_in_the_body(self):
        text = "---\nbad: [\n---\n# T\n"
        self.assertEqual(split_front_matter(text), ({}, text))


class TestLoad(unittest.TestCase):
    def test_writes_changes_and_prunes(self):
        with tempfile.TemporaryDirectory() as temp:
            docs = Path(temp)
            first = _load(PROJECT, {"a.md": "1", "sub/b.md": "2"}, docs)
            self.assertEqual(first["added"], ["a.md", "sub/b.md"])
            same = _load(PROJECT, {"a.md": "1", "sub/b.md": "2"}, docs)
            self.assertFalse(any(same.values()))
            later = _load(PROJECT, {"a.md": "changed"}, docs)
            self.assertEqual((later["changed"], later["removed"]), (["a.md"], ["sub/b.md"]))
            self.assertFalse((docs / "demo" / "sub").exists())


class TestVaultParsing(unittest.TestCase):
    def test_norm_ignores_emoji_case_and_spacing(self):
        self.assertEqual(norm("🏰  Overworld -  Map"), norm("overworld - map"))

    def test_map_prose_skips_code(self):
        text = "a `b` c\n```\nd\n```\ne\n"
        self.assertEqual(map_prose(text, str.upper), "A `b` C\n```\nd\n```\nE\n")

    def test_parse_wikilink(self):
        self.assertEqual(parse_wikilink("a/b#c|d"), ("a/b", "c", "d"))
        self.assertEqual(parse_wikilink("a\\|d"), ("a", "", "d"))

    def test_shell_tests_are_not_links(self):
        self.assertFalse(looks_like_link('"$x" != true'))
        self.assertFalse(looks_like_link("-f file"))
        self.assertTrue(looks_like_link("Level 0101 - CI/CD"))

    def test_bad_front_matter_does_not_break_a_note(self):
        note = parse_note("p/a-b.md", "---\nx: [\n---\nBody long enough to summarize here please.\n")
        self.assertEqual(note.title, "A B")


class TestResolver(unittest.TestCase):
    def setUp(self):
        self.r = resolver({
            "one/guide.md": "---\ntitle: The Guide\npermalink: /guide/\n---\n",
            "two/guide.md": "---\ntitle: The Guide\n---\n",
            "two/sub/README.md": "---\ntitle: Sub\naliases: [Other Name]\n---\n",
        })

    def test_title_prefers_the_same_project(self):
        self.assertEqual(self.r.resolve("the guide", "two/x.md"), "two/guide.md")
        self.assertEqual(self.r.resolve("the guide", "one/x.md"), "one/guide.md")

    def test_a_bare_name_prefers_the_concept_note(self):
        r = resolver({"p/docs/DOCKER.md": "---\ntitle: Docker rules\n---\n",
                      "brain/concepts/docker.md": "---\ntitle: Docker\n---\n"})
        self.assertEqual(r.resolve("Docker"), "brain/concepts/docker.md")
        self.assertEqual(r.resolve("Docker", "p/a.md"), "p/docs/DOCKER.md")

    def test_alias_path_and_folder(self):
        self.assertEqual(self.r.resolve("Other Name"), "two/sub/README.md")
        self.assertEqual(self.r.resolve("two/guide"), "two/guide.md")
        self.assertEqual(self.r.resolve("two/sub"), "two/sub/README.md")

    def test_index_files_are_not_found_by_stem(self):
        self.assertIsNone(self.r.resolve("README"))

    def test_urls(self):
        self.assertEqual(self.r.resolve_url("/guide/", "two/a.md"), "one/guide.md")
        self.assertEqual(self.r.resolve_url("{{ site.baseurl }}/guide/#top", "two/a.md"),
                         "one/guide.md")
        self.assertEqual(self.r.resolve_url("sub/", "two/a.md"), "two/sub/README.md")
        self.assertEqual(self.r.resolve_url("/sub/index.html", "two/a.md"), "two/sub/README.md")
        self.assertIsNone(self.r.resolve_url("https://e.com/guide/", "two/a.md"))
        self.assertIsNone(self.r.resolve_url("/nowhere/", "two/a.md"))


class TestWeave(unittest.TestCase):
    PAGES = {
        "p/a.md": "---\ntitle: A\n---\n[[Target Page]] [t](/perma/) [[Missing]]\n"
                  "`[[Target Page]]`\n\n| [[Target Page]] |\n",
        "p/b.md": "---\ntitle: Target Page\npermalink: /perma/\n---\nBody\n",
    }

    def test_rewrites_only_what_resolves(self):
        out, count = weave_text("p/a.md", self.PAGES["p/a.md"], resolver(self.PAGES))
        self.assertIn("[[p/b|Target Page]]", out)
        self.assertIn("[[p/b|t]]", out)
        self.assertIn("[[Missing]]", out)
        self.assertIn("`[[Target Page]]`", out)
        self.assertIn("| [[p/b\\|Target Page]] |", out)
        self.assertEqual(count, 3)

    def test_is_idempotent(self):
        once, _ = weave_pages(self.PAGES)
        twice, stats = weave_pages(once)
        self.assertEqual(once, twice)
        self.assertEqual(stats["pages"], 0)


class TestGraph(unittest.TestCase):
    def _vault(self, docs):
        (docs / "p").mkdir()
        (docs / "browse").mkdir()
        (docs / ".obsidian").mkdir()
        (docs / "p" / "a.md").write_text("---\ntitle: A\n---\n[[p/b|B]] [[Nope]]\n")
        (docs / "p" / "b.md").write_text("---\ntitle: B\n---\n[back](a.md)\n")
        (docs / "p" / "c.md").write_text("---\ntitle: C\n---\nAlone.\n")
        (docs / "browse" / "x.md").write_text("# skipped\n")
        (docs / ".obsidian" / "y.md").write_text("# skipped\n")

    def test_scan_and_counts(self):
        with tempfile.TemporaryDirectory() as temp:
            docs = Path(temp)
            self._vault(docs)
            notes, _ = scan(docs)
            self.assertEqual(sorted(notes), ["p/a.md", "p/b.md", "p/c.md"])
            graph = build_graph(notes)
            self.assertEqual(graph["counts"],
                             {"notes": 3, "edges": 2, "orphans": 1, "unresolved": 1})
            self.assertEqual(graph["unresolved"], {"Nope": ["p/a.md"]})

    def test_written_graph_is_valid_json_and_stable(self):
        with tempfile.TemporaryDirectory() as temp:
            docs = Path(temp) / "docs"
            docs.mkdir()
            self._vault(docs)
            out = Path(temp) / "graph.json"
            graph = build_graph(scan(docs)[0])
            write_graph(graph, out)
            first = out.read_text()
            self.assertEqual(json.loads(first), json.loads(json.dumps(graph)))
            write_graph(build_graph(scan(docs)[0]), out)
            self.assertEqual(out.read_text(), first)

    def test_wikilink_for(self):
        self.assertEqual(wikilink_for("a/b.md", "L", "h"), "[[a/b#h|L]]")
        self.assertEqual(wikilink_for("a/b.md", "L", in_table=True), "[[a/b\\|L]]")


class TestBrain(unittest.TestCase):
    def _registry(self):
        return Registry(hub={}, projects=[Project(name="p", repo="o/p", url="u"),
                                          Project(name="q", repo="o/q", url="u")],
                        brain=BrainConfig(concept_min_pages=2, concept_min_links=2,
                                          concept_stop=["draft"],
                                          concept_aliases={"cicd": "ci-cd"}))

    def _docs(self, root):
        docs = root / "docs"
        for name, meta in (("p/a", "tags: [Docker, draft]"), ("q/b", "tags: [docker, cicd]"),
                           ("q/c", "tags: [ci-cd]")):
            path = docs / f"{name}.md"
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(f"---\ntitle: {name}\n{meta}\n---\n[[Ghost]]\n")
        return docs

    def _generate(self, root, ai=None):
        return brain.generate(self._registry(), ai=ai, docs_dir=root / "docs",
                              notes_dir=root / "notes",
                              cache_path=root / "synthesis.json",
                              log_path=root / "log.jsonl", manifest_path=root / "m.json")

    def test_tags_and_unresolved_links_become_concepts(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            self._docs(root)
            summary = self._generate(root)
            concepts = root / "docs" / "brain" / "concepts"
            self.assertEqual(sorted(p.stem for p in concepts.iterdir()),
                             ["ci-cd", "docker", "ghost"])
            self.assertEqual(summary["stubs"], 1)
            self.assertIn("[[p/a|p/a]]", (concepts / "docker.md").read_text())
            self.assertIn("brain/stub", (concepts / "ghost.md").read_text())

    def test_stub_answers_the_link_it_came_from(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            self._docs(root)
            self._generate(root)
            notes, _ = scan(root / "docs")
            self.assertIn("brain/concepts/ghost.md", notes["p/a.md"].links)
            self.assertEqual(notes["p/a.md"].unresolved, [])

    def test_a_rebuild_is_identical(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            self._docs(root)
            self._generate(root)
            read = lambda: {p: p.read_bytes() for p in (root / "docs").rglob("*")  # noqa: E731
                            if p.is_file()}
            first = read()
            self._generate(root)
            self.assertEqual(read(), first)

    def test_ai_summary_is_cached_and_survives_a_keyless_build(self):
        class Fake:
            model = "fake"
            calls = 0

            def complete(self, prompt, max_tokens=0):
                Fake.calls += 1
                return "A grounded summary."

        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            self._docs(root)
            self._generate(root, ai=Fake())
            calls = Fake.calls
            self.assertGreater(calls, 0)
            self._generate(root, ai=Fake())
            self.assertEqual(Fake.calls, calls)
            self._generate(root, ai=None)
            docker = root / "docs" / "brain" / "concepts" / "docker.md"
            self.assertIn("A grounded summary.", docker.read_text())

    def test_own_notes_join_the_vault(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            self._docs(root)
            path = brain.save_note("A Decision", "Because.", sources=["p/a"],
                                   notes_dir=root / "notes")
            self.assertEqual(path.name, "a-decision.md")
            with self.assertRaises(ValueError):
                brain.save_note("A Decision", "Again.", notes_dir=root / "notes")
            self._generate(root)
            self.assertTrue((root / "docs/brain/notes/a-decision.md").is_file())

    def test_obsidian_settings_colour_each_project(self):
        settings = brain.obsidian_settings(["p", "q"])
        groups = json.loads(settings["graph.json"])["colorGroups"]
        self.assertEqual(len(groups), 3)
        self.assertIn("graph", json.loads(settings["core-plugins.json"]))

    def test_canvas_is_json_canvas(self):
        note = parse_note("p/a.md", "---\ntitle: A\n---\n")
        other = parse_note("q/b.md", "---\ntitle: B\n---\n")
        concept = brain.Concept(slug="x", title="X", members=["p/a.md", "q/b.md"])
        board = json.loads(brain.render_canvas(["p", "q"], {}, [concept],
                                               {"p/a.md": note, "q/b.md": other}))
        ids = {n["id"] for n in board["nodes"]}
        self.assertEqual(len(board["edges"]), 2)
        self.assertTrue(all(e["fromNode"] in ids and e["toNode"] in ids for e in board["edges"]))


class TestRegistryRules(unittest.TestCase):
    def test_live_registry_parses_the_new_blocks(self):
        registry = load_registry()
        self.assertIn(".*/**", registry.collect.exclude)
        self.assertIn("warn", registry.brain.concept_stop)
        self.assertTrue(registry.get("skills").collect.include)
        self.assertEqual(registry.get("bashos").nav.tab, "Fleet")


class TestQuery(unittest.TestCase):
    GRAPH = {
        "counts": {"notes": 3, "edges": 2, "orphans": 1, "unresolved": 1},
        "nodes": [
            {"path": n, "title": t, "project": "p", "kind": "doc", "tags": [], "aliases": [],
             "permalink": "", "summary": "", "words": 1, "source_url": "", "degree": 1}
            for n, t in (("p/a.md", "A"), ("p/b.md", "B"), ("p/c.md", "C"))],
        "edges": [[0, 1], [1, 2]],
        "unresolved": {"Nope": ["p/a.md"]},
    }

    def test_neighbours_by_depth(self):
        rows = query.get_neighbours("A", depth=2, graph=self.GRAPH)
        self.assertEqual([(r["path"], r["distance"]) for r in rows],
                         [("p/b.md", 1), ("p/c.md", 2)])

    def test_unknown_note(self):
        self.assertIsNone(query.get_note("Nothing", graph=self.GRAPH))
        self.assertEqual(query.get_neighbours("Nothing", graph=self.GRAPH), [])

    def test_lint(self):
        report = query.vault_lint(self.GRAPH)
        self.assertEqual(report["orphans"], 0)
        self.assertEqual(report["unresolved"][0]["target"], "Nope")


def _load_hook():
    """The hook imports mkdocs; the unit suite runs without the site dependencies."""
    try:
        import mkdocs  # noqa: F401
    except ImportError:
        return None
    spec = importlib.util.spec_from_file_location("brain_hook", ROOT / "brain_site" / "hook.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


HOOK = _load_hook()


@unittest.skipIf(HOOK is None, "mkdocs is not installed")
class TestSiteHook(unittest.TestCase):
    def setUp(self):
        self.r = resolver({"p/a.md": "---\ntitle: A\n---\n", "q/deep/b.md": "---\ntitle: B\n---\n"})

    def test_wikilinks_become_relative_links(self):
        out = HOOK.render_wikilinks("[[q/deep/b#Some Head|see]] [[A]]", "p/a.md", self.r)
        self.assertIn("[see](../q/deep/b.md#some-head)", out)
        self.assertIn("[A](a.md)", out)

    def test_unresolved_is_marked_not_linked(self):
        out = HOOK.render_wikilinks("[[Ghost]]", "p/a.md", self.r)
        self.assertIn('class="brain-unresolved"', out)
        self.assertNotIn("](", out)

    def test_code_is_left_alone(self):
        text = '```\n[[A]]\n```\n`[[A]]` [[ "$x" = y ]]\n'
        self.assertEqual(HOOK.render_wikilinks(text, "p/a.md", self.r), text)

    def test_table_alias(self):
        self.assertIn("[x](a.md)", HOOK.render_wikilinks("| [[A\\|x]] |", "p/a.md", self.r))

    def test_callouts_become_admonitions(self):
        out = HOOK.render_callouts("> [!summary] Title\n> Body\n\nAfter\n")
        self.assertIn('!!! abstract "Title"', out)
        self.assertIn("    Body", out)
        self.assertIn("After", out)

    def test_folded_callout(self):
        self.assertIn("??? note", HOOK.render_callouts("> [!note]-\n> Hidden\n"))


if __name__ == "__main__":
    unittest.main()
