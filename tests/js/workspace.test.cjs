// The workspace's logic, run under node with no browser: the explorer tree,
// search, tags, the long-list window and the saved layout. Run it with
// `node --test tests/js/workspace.test.cjs`; the Python suite runs it too
// (tests/unit/test_cases/test_brain_site.py).
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const core = require(path.join(__dirname, "..", "..", "brain_site", "assets", "workspace.js"));

const note = (f, t, extra) => ({ f, t, p: f.includes("/") ? f.split("/")[0] : "", k: "doc", g: [], s: "", ...extra });
const NODES = [
  note("it-journey/README.md", "IT Journey"),
  note("it-journey/quests/docker.md", "Docker basics", { g: ["Docker", "containers"], s: "Run a container." }),
  note("it-journey/quests/bash.md", "Bash 10 steps", { g: ["bash"] }),
  note("zer0/docs/setup.md", "Setup", { g: ["docker"], s: "Install with docker compose." }),
  note("brain/concepts/docker.md", "Docker", { k: "concept", g: ["brain/concept"] }),
  note("index.md", "Home"),
];

test("the tree follows the folders and counts what is below each", () => {
  const tree = core.buildTree(NODES);
  assert.equal(tree.count, 6);
  assert.deepEqual([...tree.folders.keys()].sort(), ["brain", "it-journey", "zer0"]);
  assert.equal(tree.folders.get("it-journey").count, 3);
  assert.equal(tree.folders.get("it-journey").folders.get("quests").path, "it-journey/quests");
  assert.deepEqual(tree.notes, [5]);
});

test("closed folders hide their contents; folders come before notes", () => {
  const tree = core.buildTree(NODES);
  const closed = core.flattenTree(tree, new Set(), NODES, "title");
  assert.deepEqual(closed.map((row) => row.name || row.label), ["brain", "it-journey", "zer0", "Home"]);
  assert.ok(closed.slice(0, 3).every((row) => row.type === "folder" && !row.open));

  const open = core.flattenTree(tree, new Set(["it-journey", "it-journey/quests"]), NODES, "title");
  assert.deepEqual(open.map((row) => `${row.depth}:${row.name || row.label}`),
    ["0:brain", "0:it-journey", "1:quests", "2:Bash 10 steps", "2:Docker basics", "1:IT Journey", "0:zer0", "0:Home"]);
});

test("file-name mode labels and sorts notes by file name", () => {
  const tree = core.buildTree(NODES);
  const rows = core.flattenTree(tree, new Set(["it-journey", "it-journey/quests"]), NODES, "file");
  assert.deepEqual(rows.filter((row) => row.type === "note").map((row) => row.label),
    ["bash.md", "docker.md", "README.md", "index.md"]);
});

test("ancestors are the folders to open to reveal a note", () => {
  assert.deepEqual(core.ancestors("a/b/c.md"), ["a", "a/b"]);
  assert.deepEqual(core.ancestors("index.md"), []);
});

test("a query parses into words, fields, phrases and exclusions", () => {
  assert.deepEqual(core.parseQuery('Docker tag:"ci cd" -draft path:Quests tag:#Bash'), [
    { field: null, value: "docker", negate: false },
    { field: "tag", value: "ci cd", negate: false },
    { field: null, value: "draft", negate: true },
    { field: "path", value: "quests", negate: false },
    { field: "tag", value: "bash", negate: false },
  ]);
  assert.deepEqual(core.parseQuery("  "), []);
  assert.deepEqual(core.parseQuery("tag:"), [], "a field with no value yet is not a clause");
});

test("search ranks a title above a tag above a summary, and every clause must hold", () => {
  const index = core.buildSearchIndex(NODES);
  const degrees = NODES.map(() => 0);
  const find = (text) => core.searchNotes(index, core.parseQuery(text), degrees).map((i) => NODES[i].f);

  assert.deepEqual(find("docker"),
    ["brain/concepts/docker.md", "it-journey/quests/docker.md", "zer0/docs/setup.md"]);
  assert.deepEqual(find("docker project:it-journey"), ["it-journey/quests/docker.md"]);
  assert.deepEqual(find("tag:docker"), ["it-journey/quests/docker.md", "zer0/docs/setup.md"]);
  assert.deepEqual(find("docker -kind:concept -compose"), ["it-journey/quests/docker.md"]);
  assert.deepEqual(find("kind:concept"), ["brain/concepts/docker.md"]);
  assert.deepEqual(find("path:quests bash"), ["it-journey/quests/bash.md"]);
  assert.deepEqual(find("nothing-matches-this"), []);
  assert.deepEqual(find(""), [], "an empty query lists nothing");
});

test("the more connected note wins a tie", () => {
  const nodes = [note("a/x.md", "Guide"), note("b/x.md", "Guide")];
  const index = core.buildSearchIndex(nodes);
  assert.deepEqual(core.searchNotes(index, core.parseQuery("guide"), [1, 9]), [1, 0]);
});

test("tags are counted once per note, whatever their case", () => {
  const tags = core.tagCounts([
    note("a.md", "A", { g: ["Docker", "docker", "ci"] }),
    note("b.md", "B", { g: ["docker"] }),
    note("c.md", "C", { g: ["docker"] }),
  ]);
  assert.deepEqual(tags, [{ key: "docker", count: 3, tag: "docker" }, { key: "ci", count: 1, tag: "ci" }]);
});

test("the list window covers the screen plus spare rows and stays in range", () => {
  assert.deepEqual(core.windowRange(0, 280, 28, 1000, 8), { start: 0, end: 18 });
  assert.deepEqual(core.windowRange(2800, 280, 28, 1000, 8), { start: 92, end: 118 });
  assert.deepEqual(core.windowRange(99999, 280, 28, 50, 8), { start: 50, end: 50 });
  assert.deepEqual(core.windowRange(0, 0, 28, 5, 8), { start: 0, end: 5 });
  assert.deepEqual(core.windowRange(0, 280, 28, 0, 8), { start: 0, end: 0 });
});

test("a saved layout keeps what still exists and falls back for the rest", () => {
  const exists = (p) => p === "a.md" || p === "b.md";
  const fresh = core.restoreLayout(null, exists);
  assert.deepEqual(fresh, core.defaultLayout());

  const restored = core.restoreLayout({
    groups: [
      { tabs: [{ kind: "note", path: "a.md" }, { kind: "note", path: "gone.md" }, { kind: "graph" }], active: 7 },
      { tabs: [{ kind: "note", path: "gone.md" }], active: 0 },
      { tabs: [{ kind: "bogus" }, { kind: "home" }], active: 1 },
    ],
    activeGroup: 2,
    left: { open: false, width: 5000, pane: "tags" },
    right: { open: true, width: "wide" },
    expanded: ["x", 3, "y"], closed: ["outline"], labels: "file",
    bookmarks: ["b.md", "gone.md"], recent: ["gone.md", "a.md"], depth: 9,
  }, exists);
  assert.deepEqual(restored.groups, [
    { tabs: [{ kind: "note", path: "a.md" }, { kind: "graph" }], active: 1 },
    { tabs: [{ kind: "home" }], active: 0 },
  ]);
  assert.equal(restored.activeGroup, 1, "the active group is clamped to the groups that survive");
  assert.deepEqual(restored.left, { open: false, width: 640, pane: "tags" });
  assert.deepEqual(restored.right, { open: true, width: null });
  assert.deepEqual(restored.expanded, ["x", "y"]);
  assert.deepEqual(restored.closed, ["outline"]);
  assert.equal(restored.labels, "file");
  assert.deepEqual(restored.bookmarks, ["b.md"]);
  assert.deepEqual(restored.recent, ["a.md"]);
  assert.equal(restored.depth, 3);
});

test("a layout that is not a layout is ignored", () => {
  for (const junk of ["text", 4, [], { groups: "no" }, { groups: [null, { tabs: 3 }] }]) {
    const layout = core.restoreLayout(junk, () => true);
    assert.deepEqual(layout.groups, [{ tabs: [{ kind: "home" }], active: 0 }]);
  }
});

test("a pane never restores more tabs or panes than the workspace allows", () => {
  const tabs = Array.from({ length: 50 }, () => ({ kind: "home" }));
  const layout = core.restoreLayout({ groups: [{ tabs }, { tabs }, { tabs }, { tabs }, { tabs }] }, () => true);
  assert.equal(layout.groups.length, core.MAX_GROUPS);
  assert.ok(layout.groups.every((group) => group.tabs.length === core.MAX_TABS));
});
