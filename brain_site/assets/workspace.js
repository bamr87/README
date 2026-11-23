/* The vault workspace: Obsidian's window over the published vault. A file
   explorer, tabs and split panes, backlinks, an outline, a local graph and a
   command palette, on /brain/workspace/. It reads what the site already
   serves: the graph (assets/brain/graph.json) and each note's rendered page.
   So hook.py stays the only renderer and vault.py the only link resolver,
   and nothing here writes anywhere but the reader's own localStorage. */
(function () {
  "use strict";

  /* ---- logic with no DOM in it; tests/js loads this file under node ------ */
  const MAX_GROUPS = 3;
  const MAX_TABS = 20;
  const RECENT_LIMIT = 20;
  const MIN_SIDE = 180;
  const MAX_SIDE = 640;
  const TAB_KINDS = ["home", "note", "graph", "canvas"];
  const PANES = ["files", "search", "tags", "bookmarks"];
  const FIELDS = ["tag", "project", "kind", "path"];

  const lower = (text) => String(text === null || text === undefined ? "" : text).toLowerCase();
  const collator = new Intl.Collator("en", { sensitivity: "base", numeric: true });
  const compare = (a, b) => collator.compare(a, b);
  const basename = (path) => path.slice(path.lastIndexOf("/") + 1);
  const clamp = (value, low, high) => Math.min(Math.max(value, low), high);

  // The vault's folders, from the note paths. A folder knows how many notes
  // sit anywhere below it; notes are indices into `nodes`.
  function buildTree(nodes) {
    const folder = (name, path) => ({ name, path, folders: new Map(), notes: [], count: 0, order: {} });
    const root = folder("", "");
    nodes.forEach((node, i) => {
      const parts = node.f.split("/");
      let dir = root;
      dir.count += 1;
      for (let depth = 0; depth < parts.length - 1; depth += 1) {
        const name = parts[depth];
        let next = dir.folders.get(name);
        if (!next) {
          next = folder(name, dir.path ? `${dir.path}/${name}` : name);
          dir.folders.set(name, next);
        }
        next.count += 1;
        dir = next;
      }
      dir.notes.push(i);
    });
    return root;
  }

  const noteLabel = (node, mode) => (mode === "file" ? basename(node.f) : node.t || basename(node.f));

  // The rows the explorer shows: folders first, then notes, open folders
  // followed by their contents. `mode` is "title" or "file".
  function flattenTree(root, expanded, nodes, mode) {
    const rows = [];
    (function walk(dir, depth) {
      if (!dir.order[mode]) {
        dir.order[mode] = {
          folders: [...dir.folders.values()].sort((a, b) => compare(a.name, b.name)),
          notes: dir.notes.slice().sort((a, b) => compare(noteLabel(nodes[a], mode), noteLabel(nodes[b], mode))
            || compare(nodes[a].f, nodes[b].f)),
        };
      }
      dir.order[mode].folders.forEach((child) => {
        const open = expanded.has(child.path);
        rows.push({ type: "folder", depth, path: child.path, name: child.name, count: child.count, open });
        if (open) walk(child, depth + 1);
      });
      dir.order[mode].notes.forEach((i) => {
        rows.push({ type: "note", depth, index: i, label: noteLabel(nodes[i], mode) });
      });
    })(root, 0);
    return rows;
  }

  // The folders a note sits in, outermost first: what to open to reveal it.
  function ancestors(path) {
    const parts = path.split("/").slice(0, -1);
    return parts.map((_, i) => parts.slice(0, i + 1).join("/"));
  }

  // "docker tag:ci -draft path:quests" -> clauses. A quoted value keeps its
  // spaces; a leading minus excludes.
  function parseQuery(text) {
    const clauses = [];
    const pattern = /(-)?(?:(tag|project|kind|path):)?(?:"([^"]*)"|(\S+))/gi;
    let match;
    while ((match = pattern.exec(String(text || "")))) {
      const value = lower(match[3] !== undefined ? match[3] : match[4]).trim();
      const field = match[2] ? match[2].toLowerCase() : null;
      // "tag:" with nothing after it is a clause still being typed.
      if (!value || (!field && FIELDS.includes(value.replace(/:$/, "")) && value.endsWith(":"))) continue;
      clauses.push({ field, value: field === "tag" ? value.replace(/^#/, "") : value, negate: Boolean(match[1]) });
    }
    return clauses;
  }

  function buildSearchIndex(nodes) {
    return nodes.map((node) => ({
      t: lower(node.t), g: (node.g || []).map(lower), f: lower(node.f),
      s: lower(node.s), p: lower(node.p), k: lower(node.k),
    }));
  }

  // How well one note answers one clause; 0 means it does not.
  function matchClause(entry, clause) {
    const value = clause.value;
    if (clause.field === "tag") {
      if (entry.g.includes(value)) return 8;
      return entry.g.some((tag) => tag.includes(value)) ? 5 : 0;
    }
    if (clause.field === "project") return entry.p === value ? 4 : entry.p.includes(value) ? 2 : 0;
    if (clause.field === "kind") return entry.k === value ? 4 : 0;
    if (clause.field === "path") return entry.f.includes(value) ? 3 : 0;
    const at = entry.t.indexOf(value);
    if (at === 0) return entry.t.length === value.length ? 30 : 20;
    if (at > 0) return /[\s\-_/:(]/.test(entry.t[at - 1]) ? 14 : 10;
    if (entry.g.includes(value)) return 8;
    if (entry.g.some((tag) => tag.includes(value))) return 5;
    if (entry.f.includes(value)) return 3;
    return entry.s.includes(value) ? 2 : 0;
  }

  // Indices of the notes every clause accepts, best first; the more connected
  // note wins a tie.
  function searchNotes(index, clauses, degrees) {
    if (!clauses.length) return [];
    const hits = [];
    for (let i = 0; i < index.length; i += 1) {
      let total = 0;
      let ok = true;
      for (const clause of clauses) {
        const points = matchClause(index[i], clause);
        if (clause.negate ? points > 0 : points === 0) { ok = false; break; }
        if (!clause.negate) total += points;
      }
      if (ok) hits.push([total, i]);
    }
    hits.sort((a, b) => b[0] - a[0] || (degrees[b[1]] || 0) - (degrees[a[1]] || 0) || a[1] - b[1]);
    return hits.map((hit) => hit[1]);
  }

  // Every tag with the number of notes that carry it, most used first. Tags
  // differing only in case are one tag, shown in its most common spelling.
  function tagCounts(nodes) {
    const tags = new Map();
    nodes.forEach((node) => {
      const seen = new Set();
      (node.g || []).forEach((tag) => {
        const key = lower(tag);
        if (!key || seen.has(key)) return;
        seen.add(key);
        const entry = tags.get(key) || { key, count: 0, spelled: new Map() };
        entry.count += 1;
        entry.spelled.set(tag, (entry.spelled.get(tag) || 0) + 1);
        tags.set(key, entry);
      });
    });
    return [...tags.values()].map((entry) => ({
      key: entry.key, count: entry.count,
      tag: [...entry.spelled.entries()].sort((a, b) => b[1] - a[1] || compare(a[0], b[0]))[0][0],
    })).sort((a, b) => b.count - a.count || compare(a.key, b.key));
  }

  // Which rows of a long list are on screen, with a few spare either side.
  function windowRange(scrollTop, viewHeight, rowHeight, total, spare) {
    const start = clamp(Math.floor(scrollTop / rowHeight) - spare, 0, total);
    const end = clamp(Math.ceil((scrollTop + viewHeight) / rowHeight) + spare, start, total);
    return { start, end };
  }

  const defaultLayout = () => ({
    groups: [{ tabs: [{ kind: "home" }], active: 0 }], activeGroup: 0,
    left: { open: true, width: null, pane: "files" }, right: { open: true, width: null },
    expanded: [], closed: [], labels: "title", bookmarks: [], recent: [], depth: 1,
  });

  // A saved layout is the reader's own data, but it outlives builds: notes
  // move and disappear. Keep what still exists and fall back for the rest.
  function restoreLayout(saved, exists) {
    const layout = defaultLayout();
    if (!saved || typeof saved !== "object") return layout;
    const strings = (list) => (Array.isArray(list) ? list.filter((item) => typeof item === "string") : []);
    const groups = (Array.isArray(saved.groups) ? saved.groups : []).slice(0, MAX_GROUPS).map((group) => {
      const tabs = (group && Array.isArray(group.tabs) ? group.tabs : [])
        .filter((tab) => tab && TAB_KINDS.includes(tab.kind)
          && (tab.kind !== "note" || (typeof tab.path === "string" && exists(tab.path))))
        .slice(0, MAX_TABS)
        .map((tab) => (tab.kind === "note" ? { kind: "note", path: tab.path } : { kind: tab.kind }));
      const active = group && Number.isInteger(group.active) ? group.active : 0;
      return { tabs, active: clamp(active, 0, Math.max(tabs.length - 1, 0)) };
    }).filter((group) => group.tabs.length);
    if (groups.length) {
      layout.groups = groups;
      layout.activeGroup = Number.isInteger(saved.activeGroup) ? clamp(saved.activeGroup, 0, groups.length - 1) : 0;
    }
    ["left", "right"].forEach((side) => {
      const from = saved[side];
      if (!from || typeof from !== "object") return;
      layout[side].open = from.open !== false;
      if (Number.isFinite(from.width)) layout[side].width = clamp(Math.round(from.width), MIN_SIDE, MAX_SIDE);
    });
    if (saved.left && PANES.includes(saved.left.pane)) layout.left.pane = saved.left.pane;
    layout.expanded = strings(saved.expanded).slice(0, 2000);
    layout.closed = strings(saved.closed).slice(0, 20);
    layout.labels = saved.labels === "file" ? "file" : "title";
    layout.bookmarks = strings(saved.bookmarks).filter(exists).slice(0, 200);
    layout.recent = strings(saved.recent).filter(exists).slice(0, RECENT_LIMIT);
    layout.depth = Number.isInteger(saved.depth) ? clamp(saved.depth, 1, 3) : 1;
    return layout;
  }

  const core = {
    MAX_GROUPS, MAX_TABS, RECENT_LIMIT, buildTree, flattenTree, ancestors, parseQuery,
    buildSearchIndex, matchClause, searchNotes, tagCounts, windowRange,
    defaultLayout, restoreLayout,
  };
  if (typeof module !== "undefined" && module.exports) { module.exports = core; return; }

  const api = typeof window !== "undefined" ? window.BrainVault : null;
  if (!api) return;

  /* ---- small DOM helpers -------------------------------------------------- */
  const ICONS = {
    files: '<path d="M3 6h6l2 2h10v11H3z"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l5 5"/>',
    tags: '<path d="M5 9h14M5 15h14M10 4L8 20M16 4l-2 16"/>',
    star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8z"/>',
    graph: '<circle cx="6" cy="7" r="2.2"/><circle cx="18" cy="6" r="2.2"/><circle cx="12" cy="18" r="2.2"/><path d="M8.1 6.8l7.7-.6M7 9l4 7M16.9 8l-3.9 8"/>',
    canvas: '<rect x="3" y="4" width="7" height="5" rx="1"/><rect x="14" y="4" width="7" height="5" rx="1"/><rect x="8.5" y="15" width="7" height="5" rx="1"/><path d="M6.5 9v3h11V9M12 12v3"/>',
    home: '<path d="M4 11l8-7 8 7M6 10v9h12v-9"/>',
    command: '<path d="M5 7l5 5-5 5M12 17h7"/>',
    switcher: '<path d="M4 6h16M4 12h9M4 18h16M16 10l3 2-3 2z"/>',
    split: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    forward: '<path d="M9 5l7 7-7 7"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5H5V6h5"/>',
    details: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/>',
    chevron: '<path d="M9 6l6 6-6 6"/>',
    reveal: '<circle cx="12" cy="12" r="3"/><path d="M12 3v4M12 17v4M3 12h4M17 12h4"/>',
    collapse: '<path d="M7 5l5 5 5-5M7 19l5-5 5 5"/>',
    labels: '<path d="M5 6h14M12 6v13M9 19h6"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    note: '<path d="M7 3h7l4 4v14H7zM14 3v4h4"/>',
    random: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 9h.01M15 15h.01M12 12h.01M15 9h.01M9 15h.01"/>',
    leave: '<path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9"/>',
  };
  const TAB_TITLES = { home: "New tab", graph: "Graph view", canvas: "Canvas" };
  const TAB_ICONS = { home: "home", graph: "graph", canvas: "canvas", note: "note" };
  // Notes that are a view of the vault rather than a page to read.
  const SPECIAL = { "brain/graph.md": "graph", "brain/canvas.md": "canvas", "brain/workspace.md": "home" };
  const EMBEDDED = ["graph", "canvas", "table"];
  // Views the site draws at build time: a note keeps the picture and brain.js wires it up.
  const DRAWN = ["atlas"];
  const STORE_KEY = "brain-workspace";
  const TREE_ROW = 28;
  const RESULT_ROW = 50;
  const LINK_LIMIT = 100;
  const LOCAL_GRAPH_CAP = 120;
  const MAC = /Mac|iPhone|iPad/.test(navigator.platform || "");
  const withMod = (key) => (MAC ? `⌘${key}` : `Ctrl+${key}`);
  const plural = (n, one, many) => `${Number(n).toLocaleString()} ${n === 1 ? one : many}`;

  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (value === null || value === undefined || value === false) return;
      if (key === "class") node.className = value;
      else if (key === "text") node.textContent = value;
      else if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
      else node.setAttribute(key, value === true ? "" : String(value));
    });
    children.flat().forEach((child) => { if (child !== null && child !== undefined && child !== false) node.append(child); });
    return node;
  }
  function icon(name) {
    const span = el("span", { class: "brain-ws-icon", "aria-hidden": "true" });
    span.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;
    return span;
  }
  function iconButton(label, name, action, extra) {
    return el("button", { type: "button", class: `brain-ws-btn${extra ? ` ${extra}` : ""}`, title: label, "aria-label": label, onclick: action }, icon(name));
  }
  // replaceChildren, minus the "null" a missing child would be written as.
  function fill(node, ...children) {
    node.replaceChildren(...children.flat().filter((child) => child !== null && child !== undefined && child !== false));
  }
  const isTyping = (target) => target instanceof Element
    && Boolean(target.closest("input, textarea, select, [contenteditable='true']"));

  function loadStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "null"); } catch (error) { return null; }
  }
  let storeWorks = true;
  function saveStore(value) {
    if (!storeWorks) return;
    // Private windows and full quotas refuse writes; the layout is a
    // convenience, so stop trying rather than fail the workspace.
    try { localStorage.setItem(STORE_KEY, JSON.stringify(value)); } catch (error) { storeWorks = false; }
  }

  // A long list that only builds the rows on screen. `draw(row, i)` returns
  // the element for one row; every row is `rowHeight` pixels tall.
  function virtualList(container, rowHeight, draw) {
    const space = el("div", { class: "brain-ws-vspace" });
    container.append(space);
    let rows = [];
    let first = -1;
    let last = -1;
    function paint(force) {
      const { start, end } = windowRange(container.scrollTop, container.clientHeight, rowHeight, rows.length, 8);
      if (!force && start === first && end === last) return;
      first = start;
      last = end;
      const items = [];
      for (let i = start; i < end; i += 1) {
        const item = draw(rows[i], i);
        item.style.top = `${i * rowHeight}px`;
        item.style.height = `${rowHeight}px`;
        items.push(item);
      }
      space.replaceChildren(...items);
    }
    const onScroll = () => paint(false);
    container.addEventListener("scroll", onScroll, { passive: true });
    const observer = new ResizeObserver(() => paint(true));
    observer.observe(container);
    return {
      set(next) { rows = next; space.style.height = `${rows.length * rowHeight}px`; paint(true); },
      refresh() { paint(true); },
      reveal(i) {
        const top = i * rowHeight;
        if (top < container.scrollTop) container.scrollTop = top;
        else if (top + rowHeight > container.scrollTop + container.clientHeight) container.scrollTop = top + rowHeight - container.clientHeight;
        paint(true);
      },
      destroy() { observer.disconnect(); container.removeEventListener("scroll", onScroll); },
    };
  }

  /* ---- reading a note off the site ---------------------------------------- */
  const pages = new Map();
  const DROPPED = "script, style, link, meta, base, .brain-panel, .md-content__button, #main-content, "
    + ".md-source-file, .md-feedback, .headerlink";

  // The page MkDocs rendered is the note: take its article, drop what belongs
  // to the page around it, and make every address absolute.
  function parseNote(text, pageUrl) {
    const doc = new DOMParser().parseFromString(text, "text/html");
    const article = doc.querySelector("article.md-content__inner");
    if (!article) throw new Error("the page has no article");
    const origin = article.querySelector(".brain-source a[href]");
    const source = origin ? { href: origin.getAttribute("href"), text: origin.textContent } : null;
    article.querySelectorAll(DROPPED).forEach((node) => node.remove());
    const absolute = (node, name) => {
      try { node.setAttribute(name, new URL(node.getAttribute(name), pageUrl).href); } catch (error) { node.removeAttribute(name); }
    };
    article.querySelectorAll("a[href]").forEach((node) => absolute(node, "href"));
    article.querySelectorAll("img[src], source[src], video[src], audio[src], iframe[src]").forEach((node) => absolute(node, "src"));
    const template = document.createElement("template");
    template.content.append(...article.childNodes);
    return { template, source };
  }
  function fetchNote(url) {
    if (!pages.has(url)) {
      const job = fetch(url).then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text().then((text) => parseNote(text, response.url || url));
      });
      job.catch(() => pages.delete(url));
      pages.set(url, job);
      if (pages.size > 40) pages.delete(pages.keys().next().value);
    }
    return pages.get(url);
  }
  // Two open notes may both have a heading called "overview": every id, and
  // everything that points at one, gets the tab's own prefix.
  function scopeIds(fragment, prefix) {
    fragment.querySelectorAll("[id]").forEach((node) => { node.id = prefix + node.id; });
    fragment.querySelectorAll("[for]").forEach((node) => node.setAttribute("for", prefix + node.getAttribute("for")));
    fragment.querySelectorAll("input[name]").forEach((node) => { node.name = prefix + node.name; });
    ["aria-labelledby", "aria-describedby", "aria-controls"].forEach((name) => {
      fragment.querySelectorAll(`[${name}]`).forEach((node) => {
        node.setAttribute(name, node.getAttribute(name).split(/\s+/).filter(Boolean).map((id) => prefix + id).join(" "));
      });
    });
  }

  /* ---- the workspace ------------------------------------------------------ */
  function createWorkspace(v, shell) {
    const layout = restoreLayout(loadStore(), (path) => v.byPath.has(path));
    const tree = buildTree(v.nodes);
    const searchIndex = buildSearchIndex(v.nodes);
    const degrees = v.nodes.map((_, i) => v.neighbours[i].size);
    const incoming = v.nodes.map(() => []);
    const outgoing = v.nodes.map(() => []);
    v.edges.forEach(([a, b]) => { if (a !== b) { outgoing[a].push(b); incoming[b].push(a); } });
    const expanded = new Set(layout.expanded);
    const closedSections = new Set(layout.closed);
    const narrow = window.matchMedia("(max-width: 760px)");
    const groups = [];
    const cleanup = [];
    let activeGroup = null;
    let nextId = 1;
    let drawer = null;
    let destroyed = false;
    let saveTimer = 0;
    let toastTimer = 0;
    let localGraph = null;
    let localAsk = 0;
    let detailsKey = "";

    const titleOf = (i) => v.nodes[i].t || basename(v.nodes[i].f);
    const tabNode = (tab) => (tab && tab.kind === "note" ? tab.history[tab.cursor] : -1);
    const tabTitle = (tab) => (tab.kind === "note" ? titleOf(tabNode(tab)) : TAB_TITLES[tab.kind]);
    const currentTab = () => (activeGroup ? activeGroup.tabs[activeGroup.active] : null);
    const activeNote = () => tabNode(currentTab());

    /* -- skeleton -- */
    const root = el("div", { class: "brain-ws", "aria-label": "Vault workspace" });
    const ribbon = el("nav", { class: "brain-ws-ribbon", "aria-label": "Workspace" });
    const left = el("aside", { class: "brain-ws-side brain-ws-left", "aria-label": "Vault" });
    const leftGrip = el("div", { class: "brain-ws-grip", role: "separator", tabindex: "0", "aria-orientation": "vertical", "aria-label": "Resize the left sidebar" });
    const main = el("section", { class: "brain-ws-main", "aria-label": "Open notes" });
    const rightGrip = el("div", { class: "brain-ws-grip", role: "separator", tabindex: "0", "aria-orientation": "vertical", "aria-label": "Resize the right sidebar" });
    const right = el("aside", { class: "brain-ws-side brain-ws-right", "aria-label": "Note details" });
    const toast = el("span", { class: "brain-ws-toast", role: "status" });
    const vaultStats = el("span", { text: `${plural(v.nodes.length, "note", "notes")} · ${plural(v.edges.length, "link", "links")}` });
    const noteStats = el("span", { class: "brain-ws-note-stats" });
    const status = el("footer", { class: "brain-ws-status" }, vaultStats,
      v.fingerprint ? el("span", { title: "The build of the vault this page reads", text: `vault ${v.fingerprint.slice(0, 8)}` }) : null,
      toast, noteStats);
    const backdrop = el("div", { class: "brain-ws-backdrop", onclick: () => setDrawer(null) });
    root.append(ribbon, left, leftGrip, main, rightGrip, right, status, backdrop);
    // In the page before anything is drawn: lists and tabs measure themselves.
    shell.replaceChildren(root);

    function say(message) {
      toast.textContent = message;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => { toast.textContent = ""; }, 2600);
    }

    /* -- persistence -- */
    function snapshot() {
      return {
        groups: groups.map((group) => ({
          tabs: group.tabs.map((tab) => (tab.kind === "note" ? { kind: "note", path: v.nodes[tabNode(tab)].f } : { kind: tab.kind })),
          active: group.active,
        })),
        activeGroup: Math.max(groups.indexOf(activeGroup), 0),
        left: layout.left, right: layout.right, expanded: [...expanded], closed: [...closedSections],
        labels: layout.labels, bookmarks: layout.bookmarks, recent: layout.recent, depth: layout.depth,
      };
    }
    function persist() {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => saveStore(snapshot()), 200);
    }

    /* -- sidebars -- */
    function applySides() {
      root.classList.toggle("is-left-closed", !layout.left.open);
      root.classList.toggle("is-right-closed", !layout.right.open);
      root.style.setProperty("--brain-ws-left", layout.left.width ? `${layout.left.width}px` : "");
      root.style.setProperty("--brain-ws-right", layout.right.width ? `${layout.right.width}px` : "");
      if (drawer) root.dataset.drawer = drawer; else delete root.dataset.drawer;
      paneButtons.forEach((button, pane) => button.setAttribute("aria-pressed", String(paneShown(pane))));
      detailsButton.setAttribute("aria-pressed", String(narrow.matches ? drawer === "right" : layout.right.open));
    }
    function setDrawer(side) {
      drawer = side;
      applySides();
      if (side === "right") renderDetails();
    }
    function toggleSide(side) {
      if (narrow.matches) { setDrawer(drawer === side ? null : side); return; }
      layout[side].open = !layout[side].open;
      applySides();
      if (side === "right" && layout.right.open) renderDetails();
      persist();
    }
    const paneShown = (pane) => layout.left.pane === pane && (narrow.matches ? drawer === "left" : layout.left.open);
    const ensurePane = (pane) => { if (!paneShown(pane)) showPane(pane); };
    function showPane(pane) {
      if (paneShown(pane)) { toggleSide("left"); return; }
      layout.left.pane = pane;
      panes.forEach((node, name) => { node.hidden = name !== pane; });
      if (narrow.matches) drawer = "left"; else layout.left.open = true;
      applySides();
      if (pane === "files") treeList.refresh();
      if (pane === "search") resultList.refresh();
      if (pane === "tags") tagList.refresh();
      if (pane === "bookmarks") renderBookmarks();
      persist();
    }
    function gripFor(grip, side, sign) {
      const resize = (width) => {
        layout[side].width = clamp(Math.round(width), MIN_SIDE, Math.min(MAX_SIDE, Math.round(window.innerWidth * 0.5)));
        applySides();
      };
      const element = side === "left" ? left : right;
      grip.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        grip.setPointerCapture(event.pointerId);
        const from = element.getBoundingClientRect().width;
        const origin = event.clientX;
        const move = (next) => resize(from + sign * (next.clientX - origin));
        const stop = () => {
          grip.removeEventListener("pointermove", move);
          grip.removeEventListener("pointerup", stop);
          grip.removeEventListener("pointercancel", stop);
          persist();
        };
        grip.addEventListener("pointermove", move);
        grip.addEventListener("pointerup", stop);
        grip.addEventListener("pointercancel", stop);
      });
      grip.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        resize(element.getBoundingClientRect().width + sign * (event.key === "ArrowRight" ? 16 : -16));
        persist();
      });
    }
    gripFor(leftGrip, "left", 1);
    gripFor(rightGrip, "right", -1);

    /* -- ribbon -- */
    const paneButtons = new Map();
    const paneButton = (pane, label, name, extra) => {
      const button = iconButton(label, name, () => showPane(pane), extra);
      paneButtons.set(pane, button);
      return button;
    };
    const detailsButton = iconButton("Note details", "details", () => toggleSide("right"));
    ribbon.append(
      paneButton("files", "Files", "files"),
      paneButton("search", "Search", "search"),
      paneButton("tags", "Tags", "tags", "brain-ws-wide"),
      paneButton("bookmarks", "Bookmarks", "star"),
      el("span", { class: "brain-ws-ribbon-gap" }),
      iconButton("Graph view", "graph", () => openView("graph")),
      iconButton("Canvas", "canvas", () => openView("canvas"), "brain-ws-wide"),
      iconButton(`Quick switcher (${withMod("O")})`, "switcher", () => api.openSwitcher()),
      iconButton(`Command palette (${withMod("P")})`, "command", () => openPalette()),
      el("span", { class: "brain-ws-ribbon-fill" }),
      detailsButton,
      iconButton("Leave the workspace", "leave", () => api.open("brain/", true)),
    );

    /* -- left: files -- */
    const panes = new Map();
    const pane = (name, title, tools, ...body) => {
      const node = el("div", { class: "brain-ws-pane", "data-pane": name },
        el("div", { class: "brain-ws-pane-head" }, el("h2", { text: title }), tools || null), ...body);
      node.hidden = name !== layout.left.pane;
      panes.set(name, node);
      left.append(node);
      return node;
    };

    let treeRows = [];
    let treeCursor = -1;
    const treeEl = el("div", { class: "brain-ws-vlist", role: "tree", tabindex: "0", "aria-label": "Files" });
    function drawTreeRow(row, i) {
      const cursor = i === treeCursor ? " is-cursor" : "";
      const indent = `${row.depth * 14 + 8}px`;
      if (row.type === "folder") {
        const swatch = row.depth === 0 && v.colours.has(row.name)
          ? el("span", { class: "brain-swatch" }) : null;
        if (swatch) swatch.style.background = v.colours.get(row.name);
        const node = el("div", {
          class: `brain-ws-row is-folder${row.open ? " is-open" : ""}${cursor}`, role: "treeitem", id: `brain-ws-tree-${i}`,
          "aria-level": row.depth + 1, "aria-expanded": String(row.open), "data-row": i, title: row.path,
        }, icon("chevron"), swatch, el("span", { class: "brain-ws-label", text: row.name }),
        el("span", { class: "brain-ws-count", text: row.count.toLocaleString() }));
        node.style.paddingLeft = indent;
        return node;
      }
      const note = v.nodes[row.index];
      const node = el("a", {
        class: `brain-ws-row is-note${row.index === activeNote() ? " is-active" : ""}${cursor}`, role: "treeitem",
        id: `brain-ws-tree-${i}`, "aria-level": row.depth + 1, "aria-current": row.index === activeNote() ? "page" : null,
        href: api.siteUrl(note.u), "data-note": row.index, "data-row": i, tabindex: "-1", title: note.f,
      }, el("span", { class: "brain-ws-label", text: row.label }));
      node.style.paddingLeft = `${row.depth * 14 + 26}px`;
      return node;
    }
    const treeList = virtualList(treeEl, TREE_ROW, drawTreeRow);
    cleanup.push(() => treeList.destroy());
    function markCursor() {
      if (treeCursor >= 0) treeEl.setAttribute("aria-activedescendant", `brain-ws-tree-${treeCursor}`);
      else treeEl.removeAttribute("aria-activedescendant");
    }
    function refreshTree() {
      treeRows = flattenTree(tree, expanded, v.nodes, layout.labels);
      treeCursor = Math.min(treeCursor, treeRows.length - 1);
      treeList.set(treeRows);
      markCursor();
    }
    function moveCursor(to) {
      if (!treeRows.length) return;
      treeCursor = clamp(to, 0, treeRows.length - 1);
      treeList.reveal(treeCursor);
      markCursor();
    }
    function toggleFolder(path) {
      if (expanded.has(path)) expanded.delete(path); else expanded.add(path);
      refreshTree();
      const at = treeRows.findIndex((row) => row.type === "folder" && row.path === path);
      if (at >= 0) moveCursor(at);
      persist();
    }
    function revealPath(folders, match) {
      folders.forEach((path) => expanded.add(path));
      ensurePane("files");
      refreshTree();
      const at = treeRows.findIndex(match);
      if (at >= 0) moveCursor(at);
      persist();
    }
    const revealNote = (i) => revealPath(ancestors(v.nodes[i].f), (row) => row.type === "note" && row.index === i);
    treeEl.addEventListener("click", (event) => {
      const row = event.target.closest("[data-row]");
      if (!row) return;
      treeCursor = Number(row.dataset.row);
      markCursor();
      const data = treeRows[treeCursor];
      if (data && data.type === "folder") toggleFolder(data.path);
    });
    // Only a keyboard focus gets a cursor: repainting the rows under a
    // pointer between its press and its release would swallow the click.
    treeEl.addEventListener("focus", () => { if (treeCursor < 0 && treeEl.matches(":focus-visible")) moveCursor(0); });
    treeEl.addEventListener("keydown", (event) => {
      const row = treeRows[treeCursor];
      const keys = {
        ArrowDown: () => moveCursor(treeCursor + 1),
        ArrowUp: () => moveCursor(treeCursor - 1),
        Home: () => moveCursor(0),
        End: () => moveCursor(treeRows.length - 1),
        ArrowRight: () => {
          if (!row || row.type !== "folder") return;
          if (row.open) moveCursor(treeCursor + 1); else toggleFolder(row.path);
        },
        ArrowLeft: () => {
          if (!row) return;
          if (row.type === "folder" && row.open) { toggleFolder(row.path); return; }
          for (let i = treeCursor - 1; i >= 0; i -= 1) {
            if (treeRows[i].type === "folder" && treeRows[i].depth === row.depth - 1) { moveCursor(i); return; }
          }
        },
        Enter: () => {
          if (!row) return;
          if (row.type === "folder") toggleFolder(row.path);
          else openNote(row.index, { newTab: event.ctrlKey || event.metaKey });
        },
      };
      const action = keys[event.key === " " ? "Enter" : event.key];
      if (!action) return;
      event.preventDefault();
      action();
    });
    pane("files", "Files", el("div", { class: "brain-ws-tools" },
      iconButton("Reveal the open note", "reveal", () => { const i = activeNote(); if (i >= 0) revealNote(i); else say("No note is open"); }),
      iconButton("Collapse all folders", "collapse", () => { expanded.clear(); treeCursor = -1; refreshTree(); persist(); }),
      iconButton("Show titles or file names", "labels", () => toggleLabels())), treeEl);
    function toggleLabels() {
      layout.labels = layout.labels === "title" ? "file" : "title";
      refreshTree();
      say(layout.labels === "file" ? "Showing file names" : "Showing note titles");
      persist();
    }

    /* -- left: search -- */
    let results = [];
    const searchInput = el("input", { type: "search", class: "brain-ws-input", placeholder: "Search notes", "aria-label": "Search notes", autocomplete: "off" });
    const searchCount = el("p", { class: "brain-ws-hint", role: "status" });
    const resultsEl = el("div", { class: "brain-ws-vlist", role: "list", "aria-label": "Search results" });
    const resultList = virtualList(resultsEl, RESULT_ROW, (i) => {
      const note = v.nodes[i];
      const dot = el("span", { class: "brain-swatch" });
      dot.style.background = api.colourOf(v, note);
      return el("a", { class: "brain-ws-row brain-ws-result", role: "listitem", href: api.siteUrl(note.u), "data-note": i, title: note.f },
        el("span", { class: "brain-ws-result-title" }, dot, el("span", { class: "brain-ws-label", text: titleOf(i) })),
        el("span", { class: "brain-ws-result-meta", text: [note.p || "vault", note.k !== "doc" ? note.k : "", note.s].filter(Boolean).join(" · ") }));
    });
    cleanup.push(() => resultList.destroy());
    const SEARCH_HELP = "Titles, tags, paths and summaries. Narrow with tag:, project:, kind: or path:, and exclude with a minus. The header search reads page text.";
    function runSearch() {
      const clauses = parseQuery(searchInput.value);
      results = searchNotes(searchIndex, clauses, degrees);
      resultsEl.scrollTop = 0;
      resultList.set(results);
      searchCount.textContent = clauses.length ? plural(results.length, "note", "notes") : SEARCH_HELP;
    }
    searchInput.addEventListener("input", runSearch);
    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && results.length) openNote(results[0], { newTab: event.ctrlKey || event.metaKey });
    });
    pane("search", "Search", null, searchInput, searchCount, resultsEl);
    function searchFor(query) {
      ensurePane("search");
      searchInput.value = query;
      runSearch();
      searchInput.focus();
    }

    /* -- left: tags -- */
    const allTags = tagCounts(v.nodes);
    const tagInput = el("input", { type: "search", class: "brain-ws-input", placeholder: "Filter tags", "aria-label": "Filter tags", autocomplete: "off" });
    const tagsEl = el("div", { class: "brain-ws-vlist", role: "list", "aria-label": "Tags" });
    const tagList = virtualList(tagsEl, TREE_ROW, (entry) => el("button", {
      type: "button", class: "brain-ws-row brain-ws-tag", role: "listitem",
      onclick: () => searchFor(`tag:"${entry.tag}"`),
    }, el("span", { class: "brain-ws-label", text: `#${entry.tag}` }), el("span", { class: "brain-ws-count", text: entry.count.toLocaleString() })));
    cleanup.push(() => tagList.destroy());
    const filterTags = () => {
      const term = lower(tagInput.value).trim().replace(/^#/, "");
      tagsEl.scrollTop = 0;
      tagList.set(term ? allTags.filter((entry) => entry.key.includes(term)) : allTags);
    };
    tagInput.addEventListener("input", filterTags);
    pane("tags", "Tags", null, tagInput, tagsEl);

    /* -- left: bookmarks and recent -- */
    const bookmarksEl = el("div", { class: "brain-ws-scroll", "data-brain-preview": true });
    pane("bookmarks", "Bookmarks", null, bookmarksEl);
    const noteLink = (i, chip) => el("a", { href: api.siteUrl(v.nodes[i].u), "data-note": i, title: v.nodes[i].f },
      el("span", { class: "brain-ws-label", text: titleOf(i) }),
      chip === false ? null : el("span", { class: "brain-ws-chip", text: v.nodes[i].p || "vault" }));
    const linkList = (indices) => el("ul", { class: "brain-ws-links" }, indices.map((i) => el("li", null, noteLink(i))));
    const known = (paths) => paths.map((path) => v.byPath.get(path)).filter((i) => i !== undefined);
    function renderBookmarks() {
      const starred = known(layout.bookmarks);
      const recent = known(layout.recent);
      bookmarksEl.replaceChildren(
        starred.length ? linkList(starred) : el("p", { class: "brain-ws-hint", text: "Star a note to keep it here. Bookmarks stay in this browser." }),
        el("h3", { text: "Recent" }),
        recent.length ? linkList(recent) : el("p", { class: "brain-ws-hint", text: "Notes you open show up here." }),
      );
    }
    function toggleBookmark(i) {
      const path = v.nodes[i].f;
      const at = layout.bookmarks.indexOf(path);
      if (at >= 0) layout.bookmarks.splice(at, 1); else layout.bookmarks.unshift(path);
      say(at >= 0 ? "Bookmark removed" : "Bookmarked");
      renderBookmarks();
      if (activeGroup) renderBar(activeGroup);
      persist();
    }
    function remember(i) {
      const path = v.nodes[i].f;
      layout.recent = [path, ...layout.recent.filter((other) => other !== path)].slice(0, RECENT_LIMIT);
      if (layout.left.pane === "bookmarks") renderBookmarks();
    }

    /* -- tabs and groups -- */
    function newTab(kind, index) {
      const id = nextId;
      nextId += 1;
      return {
        id, kind, prefix: `w${id}-`, history: kind === "note" ? [index] : [], cursor: 0,
        el: null, scroll: 0, token: 0, handles: [], outline: [], source: null, loaded: false,
      };
    }
    function release(tab) {
      tab.handles.splice(0).forEach((handle) => handle.destroy());
    }
    function createGroup(at) {
      const group = { tabs: [], active: -1 };
      group.tabsEl = el("div", { class: "brain-ws-tabs", role: "tablist", "aria-label": "Open tabs" });
      group.barEl = el("div", { class: "brain-ws-bar" });
      group.bodyEl = el("div", { class: "brain-ws-body", tabindex: "-1" });
      group.el = el("div", { class: "brain-ws-group" },
        el("div", { class: "brain-ws-tabrow" }, group.tabsEl,
          iconButton("New tab (Alt+T)", "plus", () => { activate(group); addTab(group, newTab("home")); })),
        group.barEl, group.bodyEl);
      group.el.addEventListener("pointerdown", () => activate(group), true);
      group.el.addEventListener("focusin", () => activate(group));
      group.tabsEl.addEventListener("click", (event) => {
        const holder = event.target.closest("[data-tab]");
        if (!holder) return;
        const tab = group.tabs[Number(holder.dataset.tab)];
        if (event.target.closest(".brain-ws-tab-close")) closeTab(group, tab); else showTab(group, tab);
      });
      group.tabsEl.addEventListener("auxclick", (event) => {
        const holder = event.target.closest("[data-tab]");
        if (!holder || event.button !== 1) return;
        event.preventDefault();
        closeTab(group, group.tabs[Number(holder.dataset.tab)]);
      });
      group.tabsEl.addEventListener("keydown", (event) => {
        const step = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
        if (step) {
          event.preventDefault();
          showTab(group, group.tabs[(group.active + step + group.tabs.length) % group.tabs.length]);
          focusTab(group);
        } else if (event.key === "Delete") {
          event.preventDefault();
          closeTab(group, group.tabs[group.active]);
          if (group.el.isConnected) focusTab(group);
        }
      });
      groups.splice(at === undefined ? groups.length : at, 0, group);
      main.insertBefore(group.el, main.children[groups.indexOf(group)] || null);
      return group;
    }
    const focusTab = (group) => {
      const button = group.tabsEl.querySelector('[aria-selected="true"]');
      if (button) button.focus();
    };
    function activate(group) {
      if (activeGroup === group || destroyed) return;
      activeGroup = group;
      groups.forEach((other) => other.el.classList.toggle("is-active", other === group));
      afterChange();
    }
    function renderTabs(group) {
      const focused = group.tabsEl.contains(document.activeElement);
      group.tabsEl.replaceChildren(...group.tabs.map((tab, i) => {
        const selected = i === group.active;
        const title = tabTitle(tab);
        return el("div", { class: `brain-ws-tab${selected ? " is-active" : ""}`, role: "presentation", "data-tab": i },
          el("button", { type: "button", class: "brain-ws-tab-main", role: "tab", "aria-selected": String(selected), tabindex: selected ? "0" : "-1", title },
            icon(TAB_ICONS[tab.kind]), el("span", { class: "brain-ws-label", text: title })),
          el("button", { type: "button", class: "brain-ws-tab-close", tabindex: "-1", "aria-label": `Close ${title}`, title: "Close (Alt+W)" }, icon("close")));
      }));
      const current = group.tabsEl.querySelector(".is-active");
      if (current) current.scrollIntoView({ block: "nearest", inline: "nearest" });
      if (focused) focusTab(group);
    }
    function renderBar(group) {
      const tab = group.tabs[group.active];
      const i = tabNode(tab);
      if (i < 0) {
        group.barEl.replaceChildren(el("span", { class: "brain-ws-crumbs", text: tab ? TAB_TITLES[tab.kind] : "" }),
          el("span", { class: "brain-ws-tools" }, iconButton("Split right", "split", () => splitRight())));
        return;
      }
      const note = v.nodes[i];
      const parts = note.f.split("/");
      const crumbs = el("span", { class: "brain-ws-crumbs" });
      parts.forEach((part, depth) => {
        if (depth) crumbs.append(el("span", { class: "brain-ws-sep", "aria-hidden": "true", text: "/" }));
        if (depth === parts.length - 1) { crumbs.append(el("span", { class: "brain-ws-crumb is-file", text: part })); return; }
        const path = parts.slice(0, depth + 1).join("/");
        crumbs.append(el("button", {
          type: "button", class: "brain-ws-crumb", text: part, title: `Show ${path} in files`,
          onclick: () => revealPath(ancestors(`${path}/x`), (row) => row.type === "folder" && row.path === path),
        }));
      });
      const starred = layout.bookmarks.includes(note.f);
      const back = iconButton("Back (Alt+←)", "back", () => go(tab, -1));
      const forward = iconButton("Forward (Alt+→)", "forward", () => go(tab, 1));
      back.disabled = tab.cursor === 0;
      forward.disabled = tab.cursor >= tab.history.length - 1;
      const star = iconButton(starred ? "Remove bookmark" : "Bookmark", "star", () => toggleBookmark(i), starred ? "is-on" : "");
      star.setAttribute("aria-pressed", String(starred));
      group.barEl.replaceChildren(back, forward, crumbs, el("span", { class: "brain-ws-tools" },
        star,
        iconButton("Reveal in files", "reveal", () => revealNote(i)),
        iconButton("Copy a link to this note", "link", () => copyLink()),
        el("a", { class: "brain-ws-btn", href: api.siteUrl(note.u), "data-site": true, title: "Open on the site", "aria-label": "Open on the site" }, icon("external")),
        iconButton(`Split right (${withMod("\\")})`, "split", () => splitRight())));
    }

    /* -- tab content -- */
    function contentFor(tab) {
      if (tab.el) return tab.el;
      if (tab.kind === "note") {
        tab.el = el("article", { class: "brain-ws-note md-typeset", "data-brain-preview": true });
        renderNote(tab);
      } else if (tab.kind === "home") {
        tab.el = el("div", { class: "brain-ws-home", "data-brain-preview": true });
      } else {
        tab.el = el("div", { class: "brain-ws-view", "data-view": tab.kind });
        const host = tab.el;
        Promise.resolve().then(() => api.views[tab.kind](host, { embedded: true })).then((handle) => {
          if (!handle) return;
          if (tab.el === host) tab.handles.push(handle); else handle.destroy();
        }).catch((error) => {
          console.error(`brain: the ${tab.kind} view failed to load`, error);
          host.textContent = "This view could not be loaded.";
        });
      }
      return tab.el;
    }
    function findAnchor(tab, anchor) {
      return anchor && tab.el ? tab.el.querySelector(`[id="${CSS.escape(tab.prefix + anchor)}"]`) : null;
    }
    function renderNote(tab, anchor) {
      const i = tabNode(tab);
      const note = v.nodes[i];
      tab.token += 1;
      const token = tab.token;
      const body = tab.el;
      release(tab);
      tab.outline = [];
      tab.source = null;
      tab.loaded = false;
      tab.scroll = 0;
      body.setAttribute("aria-busy", "true");
      body.replaceChildren(el("p", { class: "brain-ws-hint", text: `Loading ${titleOf(i)}…` }));
      const stale = () => destroyed || tab.el !== body || tab.token !== token;
      fetchNote(api.siteUrl(note.u)).then((page) => {
        if (stale()) return;
        const fragment = page.template.content.cloneNode(true);
        scopeIds(fragment, tab.prefix);
        body.replaceChildren(fragment);
        tab.source = page.source;
        tab.outline = [...body.querySelectorAll("h1, h2, h3, h4")]
          .map((heading) => ({ level: Number(heading.tagName[1]), text: heading.textContent.trim(), heading }))
          .filter((item) => item.text);
        body.querySelectorAll("[data-brain-view]").forEach((host) => {
          const name = host.dataset.brainView;
          if (DRAWN.includes(name)) { if (api.views[name]) api.views[name](host); return; }
          host.replaceChildren();
          if (!EMBEDDED.includes(name)) return;
          Promise.resolve().then(() => api.views[name](host, { embedded: true })).then((handle) => {
            if (!handle) return;
            if (stale()) handle.destroy(); else tab.handles.push(handle);
          }).catch((error) => console.error("brain: an embedded view failed to load", error));
        });
      }, (error) => {
        if (stale()) return;
        body.replaceChildren(
          el("h1", { text: titleOf(i) }),
          el("p", { text: `This note could not be loaded (${error.message}).` }),
          el("p", null, el("button", { type: "button", class: "brain-ws-action", text: "Try again", onclick: () => renderNote(tab) }),
            " ", el("a", { href: api.siteUrl(note.u), "data-site": true, text: "Open it on the site" })));
      }).then(() => {
        if (stale()) return;
        tab.loaded = true;
        body.removeAttribute("aria-busy");
        const group = groups.find((other) => other.tabs[other.active] === tab);
        if (!group) return;
        const target = findAnchor(tab, anchor);
        if (target) target.scrollIntoView({ block: "start" }); else group.bodyEl.scrollTop = 0;
        if (group === activeGroup) afterChange();
      });
    }
    function renderHome(tab) {
      const projects = v.nodes.map((note, i) => [note, i]).filter(([note]) => note.k === "project");
      const concepts = v.nodes.map((note, i) => [note, i]).filter(([note]) => note.k === "concept")
        .sort((a, b) => degrees[b[1]] - degrees[a[1]]).slice(0, 24);
      const recent = known(layout.recent).slice(0, 8);
      const shortcut = (label, name, action) => el("button", { type: "button", class: "brain-ws-action", onclick: action }, icon(name), label);
      const keys = [
        [withMod("O"), "Find a note"], [withMod("P"), "Run a command"], [withMod("Shift+F"), "Search"],
        [withMod("G"), "Graph view"], [withMod("\\"), "Split right"], ["Alt+T", "New tab"], ["Alt+W", "Close tab"],
        ["Alt+← / →", "Back and forward"], [MAC ? "⌘ click" : "Ctrl+click", "Open a link in a new tab"],
      ];
      const hot = v.byPath.get("brain/hot.md");
      fill(tab.el,
        el("h1", { text: "Second Brain" }),
        el("p", { class: "brain-ws-lede", text: `${v.nodes.length.toLocaleString()} notes and ${v.edges.length.toLocaleString()} links from ${projects.length} repositories, as one vault. Pick a note on the left, or start here.` }),
        el("div", { class: "brain-ws-actions" },
          shortcut("Find a note", "switcher", () => api.openSwitcher()),
          hot === undefined ? null : shortcut("Hot cache", "note", () => openNote(hot)),
          shortcut("Graph view", "graph", () => openView("graph")),
          shortcut("Canvas", "canvas", () => openView("canvas")),
          shortcut("Random note", "random", () => openRandom()),
          shortcut("Commands", "command", () => openPalette())),
        recent.length ? el("h2", { text: "Recent" }) : null,
        recent.length ? linkList(recent) : null,
        el("h2", { text: "Projects" }),
        el("div", { class: "brain-ws-cards" }, projects.map(([note, i]) => {
          const name = basename(note.f).replace(/\.md$/, "");
          const folder = tree.folders.get(name);
          const dot = el("span", { class: "brain-swatch" });
          dot.style.background = v.colours.get(name) || "currentColor";
          return el("a", { class: "brain-ws-card", href: api.siteUrl(note.u), "data-note": i },
            el("strong", null, dot, titleOf(i)),
            el("span", { text: plural(folder ? folder.count : 0, "note", "notes") }));
        })),
        el("h2", { text: "Most connected concepts" }),
        el("div", { class: "brain-ws-chips" }, concepts.map(([, i]) => el("a", { class: "brain-ws-chip", href: api.siteUrl(v.nodes[i].u), "data-note": i, text: titleOf(i) }))),
        el("h2", { text: "Keys" }),
        el("dl", { class: "brain-ws-keys" }, keys.map(([key, what]) => [el("dt", null, el("kbd", { text: key })), el("dd", { text: what })])),
      );
    }

    // `quiet` is for the first paint, which puts every pane's tab up before
    // any of them is the one in front.
    function showTab(group, tab, quiet) {
      const previous = group.tabs[group.active];
      if (previous && previous.el && previous.el.parentNode === group.bodyEl) previous.scroll = group.bodyEl.scrollTop;
      group.active = group.tabs.indexOf(tab);
      const content = contentFor(tab);
      if (tab.kind === "home") renderHome(tab);
      group.bodyEl.replaceChildren(content);
      group.bodyEl.classList.toggle("is-view", tab.kind === "graph" || tab.kind === "canvas");
      group.bodyEl.scrollTop = tab.scroll;
      renderTabs(group);
      renderBar(group);
      if (quiet) return;
      if (group === activeGroup) afterChange(); else activate(group);
      persist();
    }
    function addTab(group, tab, at) {
      if (group.tabs.length >= MAX_TABS) {
        say(`A pane holds ${MAX_TABS} tabs; close one first`);
        return group.tabs[group.active];
      }
      group.tabs.splice(at === undefined ? group.active + 1 : at, 0, tab);
      showTab(group, tab);
      return tab;
    }
    function closeTab(group, tab) {
      const at = group.tabs.indexOf(tab);
      if (at < 0) return;
      release(tab);
      tab.token += 1;
      if (tab.el) tab.el.remove();
      tab.el = null;
      group.tabs.splice(at, 1);
      if (!group.tabs.length) {
        if (groups.length > 1) {
          const index = groups.indexOf(group);
          groups.splice(index, 1);
          group.el.remove();
          if (activeGroup === group) { activeGroup = null; activate(groups[Math.max(index - 1, 0)]); }
          persist();
          return;
        }
        group.active = -1;
        addTab(group, newTab("home"), 0);
        return;
      }
      if (at === group.active) {
        group.active = -1;
        showTab(group, group.tabs[Math.min(at, group.tabs.length - 1)]);
        return;
      }
      if (at < group.active) group.active -= 1;
      renderTabs(group);
      persist();
    }
    function splitRight() {
      const tab = currentTab();
      if (!tab) return;
      if (groups.length >= MAX_GROUPS) { say(`${MAX_GROUPS} panes side by side is the limit`); return; }
      const group = createGroup(groups.indexOf(activeGroup) + 1);
      addTab(group, newTab(tab.kind, tabNode(tab)), 0);
    }
    function go(tab, step) {
      const to = tab.cursor + step;
      if (tab.kind !== "note" || to < 0 || to >= tab.history.length) return;
      tab.cursor = to;
      renderNote(tab);
      const group = groups.find((other) => other.tabs.includes(tab));
      renderTabs(group);
      renderBar(group);
      afterChange();
      persist();
    }

    /* -- opening -- */
    function openView(kind) {
      for (const group of groups) {
        const tab = group.tabs.find((other) => other.kind === kind);
        if (tab) { showTab(group, tab); return; }
      }
      addTab(activeGroup, newTab(kind));
    }
    // Obsidian's rule: a plain click replaces the tab's note, and a modified
    // click opens a new tab. A view (graph, canvas) is never replaced.
    function openNote(i, options) {
      const { newTab: fresh = false, split = false, anchor = "", group: wanted } = options || {};
      const special = SPECIAL[v.nodes[i].f];
      if (special) { openView(special); return; }
      let group = wanted && groups.includes(wanted) ? wanted : activeGroup;
      if (split && groups.length < MAX_GROUPS) {
        group = createGroup(groups.indexOf(group) + 1);
        addTab(group, newTab("note", i), 0);
      } else {
        const tab = group.tabs[group.active];
        if (!fresh && tab && tab.kind === "note") {
          if (tabNode(tab) !== i) {
            tab.history = tab.history.slice(0, tab.cursor + 1).concat(i);
            tab.cursor = tab.history.length - 1;
            renderNote(tab, anchor);
            renderTabs(group);
            renderBar(group);
          } else {
            const target = findAnchor(tab, anchor);
            if (target) target.scrollIntoView({ block: "start" });
          }
          if (group === activeGroup) afterChange(); else activate(group);
        } else if (!fresh && tab && tab.kind === "home") {
          if (tab.el) tab.el.remove();
          Object.assign(tab, { kind: "note", history: [i], cursor: 0, el: null, scroll: 0 });
          showTab(group, tab);
        } else {
          const open = fresh ? null : group.tabs.find((other) => tabNode(other) === i);
          if (open) showTab(group, open); else addTab(group, newTab("note", i));
        }
      }
      remember(i);
      if (narrow.matches && drawer) setDrawer(null);
      persist();
    }
    function openRandom() {
      const pool = v.nodes.map((_, i) => i).filter((i) => v.nodes[i].k === "doc" && degrees[i] > 0);
      if (pool.length) openNote(pool[Math.floor(Math.random() * pool.length)]);
    }
    function focusNote(i) {
      for (const group of groups) {
        const tab = group.tabs.find((other) => tabNode(other) === i);
        if (tab) { showTab(group, tab); return; }
      }
      openNote(i, { newTab: currentTab() && currentTab().kind === "note" });
    }

    /* -- the address bar -- */
    const pathHash = (path) => `#/${encodeURIComponent(path).replace(/%2F/g, "/")}`;
    function hashFor(tab) {
      if (!tab || tab.kind === "home") return "";
      return tab.kind === "note" ? pathHash(v.nodes[tabNode(tab)].f) : `#/${tab.kind}`;
    }
    function syncHash() {
      const next = hashFor(currentTab());
      if (location.hash === next) return;
      history.replaceState(history.state, "", next || location.pathname + location.search);
    }
    function openFromHash() {
      if (!location.hash.startsWith("#/")) return false;
      let path = location.hash.slice(2);
      try { path = decodeURIComponent(path); } catch (error) { return false; }
      if (path === "graph" || path === "canvas") { openView(path); return true; }
      const i = v.byPath.get(path);
      if (i === undefined) return false;
      focusNote(i);
      return true;
    }
    function copyLink() {
      const tab = currentTab();
      const link = new URL(hashFor(tab) || "#", location.href).href;
      const done = () => say("Link copied");
      const failed = () => say("Copying is blocked here; the address bar has the link");
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(link).then(done, failed);
      else failed();
    }

    /* -- right: note details -- */
    const detailsEl = el("div", { class: "brain-ws-scroll" });
    right.append(el("div", { class: "brain-ws-pane-head" }, el("h2", { text: "Note" })), detailsEl);
    function section(id, title, count, body, onOpen) {
      const open = !closedSections.has(id);
      const content = el("div", { class: "brain-ws-section-body" }, body);
      content.hidden = !open;
      const toggle = el("button", { type: "button", "aria-expanded": String(open) }, icon("chevron"), title,
        count === null ? null : el("span", { class: "brain-ws-count", text: count.toLocaleString() }));
      toggle.addEventListener("click", () => {
        const now = content.hidden;
        content.hidden = !now;
        toggle.setAttribute("aria-expanded", String(now));
        if (now) closedSections.delete(id); else closedSections.add(id);
        if (now && onOpen) onOpen();
        persist();
      });
      return el("section", { class: "brain-ws-section" }, el("h3", null, toggle), content);
    }
    function longList(indices) {
      const sorted = [...new Set(indices)].sort((a, b) => compare(titleOf(a), titleOf(b)));
      if (!sorted.length) return el("p", { class: "brain-ws-hint", text: "None." });
      const list = linkList(sorted.slice(0, LINK_LIMIT));
      list.dataset.brainPreview = "";
      if (sorted.length > LINK_LIMIT) {
        const more = el("button", { type: "button", class: "brain-ws-action", text: `Show all ${sorted.length.toLocaleString()}` });
        more.addEventListener("click", () => {
          sorted.slice(LINK_LIMIT).forEach((i) => list.append(el("li", null, noteLink(i))));
          more.remove();
        });
        return [list, more];
      }
      return list;
    }
    function stopLocalGraph() {
      localAsk += 1;
      if (localGraph) localGraph.destroy();
      localGraph = null;
    }
    function drawLocalGraph(host, i) {
      stopLocalGraph();
      host.replaceChildren();
      const ask = localAsk;
      // brain.js lays the rings out and draws them; the workspace offers a third ring and a larger cap.
      api.localGraph(host, i, layout.depth, { cap: LOCAL_GRAPH_CAP }).then((handle) => {
        const current = ask === localAsk && !destroyed;
        if (!handle) {
          if (current) host.replaceChildren(el("p", { class: "brain-ws-hint", text: "The local graph needs WebGL 2, which this browser does not offer." }));
          return;
        }
        if (current) localGraph = handle; else handle.destroy();
      }).catch((error) => console.error("brain: the local graph failed to draw", error));
    }
    const detailsShown = () => (narrow.matches ? drawer === "right" : layout.right.open);
    // What the panel shows depends on exactly this; anything else leaves it be.
    function detailsState() {
      const tab = currentTab();
      return detailsShown() ? `${tabNode(tab)}:${tab ? `${tab.id}:${tab.token}:${tab.loaded}` : ""}:${layout.depth}` : "hidden";
    }
    function renderDetails() {
      const visible = detailsShown();
      const tab = currentTab();
      const i = tabNode(tab);
      const key = detailsState();
      if (key === detailsKey) return;
      detailsKey = key;
      stopLocalGraph();
      if (!visible) { detailsEl.replaceChildren(); return; }
      if (i < 0) {
        detailsEl.replaceChildren(el("p", { class: "brain-ws-hint", text: "Open a note to see what links to it, what it links to and its outline." }));
        return;
      }
      const note = v.nodes[i];
      const graphHost = el("div", { class: "brain-ws-local" });
      const depth = el("select", { "aria-label": "Local graph depth" },
        [1, 2, 3].map((value) => el("option", { value, selected: value === layout.depth, text: `${value} ${value === 1 ? "link" : "links"} away` })));
      depth.addEventListener("change", () => {
        layout.depth = Number(depth.value);
        drawLocalGraph(graphHost, i);
        detailsKey = detailsState();
        persist();
      });
      const project = v.byPath.get(`brain/projects/${note.p}.md`);
      const properties = el("dl", { class: "brain-ws-props" },
        el("dt", { text: "Path" }), el("dd", { text: note.f }),
        el("dt", { text: "Project" }), el("dd", null, project === undefined ? (note.p || "vault") : noteLink(project, false)),
        el("dt", { text: "Kind" }), el("dd", { text: note.k }),
        el("dt", { text: "Words" }), el("dd", { text: Number(note.w || 0).toLocaleString() }),
        note.g.length ? el("dt", { text: "Tags" }) : null,
        note.g.length ? el("dd", { class: "brain-ws-chips" }, note.g.map((tag) => el("button", {
          type: "button", class: "brain-ws-chip", text: `#${tag}`, onclick: () => searchFor(`tag:"${tag}"`),
        }))) : null,
        tab.source ? el("dt", { text: "Source" }) : null,
        tab.source ? el("dd", null, el("a", { href: tab.source.href, text: tab.source.text || "upstream" })) : null);
      const outline = tab.outline.length
        ? el("ul", { class: "brain-ws-outline" }, tab.outline.map((item) => {
          const button = el("button", { type: "button", text: item.text, onclick: () => item.heading.scrollIntoView({ block: "start" }) });
          button.style.paddingLeft = `${(item.level - 1) * 12}px`;
          return el("li", null, button);
        }))
        : el("p", { class: "brain-ws-hint", text: tab.loaded ? "No headings." : "Loading…" });
      fill(detailsEl,
        v.neighbours[i].size ? section("graph", "Local graph", null, [depth, graphHost], () => drawLocalGraph(graphHost, i)) : null,
        section("backlinks", "Backlinks", new Set(incoming[i]).size, longList(incoming[i])),
        section("outgoing", "Outgoing links", new Set(outgoing[i]).size, longList(outgoing[i])),
        section("outline", "Outline", null, outline),
        section("properties", "Properties", null, properties),
      );
      if (v.neighbours[i].size && !closedSections.has("graph")) drawLocalGraph(graphHost, i);
    }

    /* -- after anything changes which note is in front -- */
    function afterChange() {
      if (destroyed) return;
      const i = activeNote();
      noteStats.textContent = i < 0 ? "" : [plural(v.nodes[i].w || 0, "word", "words"),
        plural(new Set(incoming[i]).size, "backlink", "backlinks"),
        plural(new Set(outgoing[i]).size, "link out", "links out")].join(" · ");
      treeList.refresh();
      renderDetails();
      syncHash();
    }

    /* -- links: one handler for every note link in the workspace -- */
    function onLink(event) {
      if (event.type === "auxclick" && event.button !== 1) return;
      const anchor = event.target.closest("a[href]");
      if (!anchor || anchor.hasAttribute("data-site")) return;
      const explicit = anchor.dataset.note;
      const i = explicit === undefined ? api.indexForUrl(v, anchor.href) : Number(explicit);
      // Material's instant navigation must not take a link out of the workspace.
      event.stopPropagation();
      if (i < 0) {
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        return;
      }
      event.preventDefault();
      let hash = "";
      if (explicit === undefined) {
        try { hash = decodeURIComponent(new URL(anchor.href).hash.slice(1)); } catch (error) { hash = ""; }
      }
      const fresh = event.metaKey || event.ctrlKey || event.button === 1;
      const holder = anchor.closest(".brain-ws-group");
      api.hidePreview();
      openNote(i, { newTab: fresh, split: fresh && event.altKey, anchor: hash, group: groups.find((group) => group.el === holder) });
    }
    root.addEventListener("click", onLink);
    root.addEventListener("auxclick", onLink);

    /* -- commands -- */
    function commands() {
      const tab = currentTab();
      const i = tabNode(tab);
      const noted = i >= 0;
      const jump = (title, path) => (v.byPath.has(path) ? { title, run: () => openNote(v.byPath.get(path)) } : null);
      return [
        { title: "Find a note", keys: withMod("O"), run: () => api.openSwitcher() },
        { title: "Search notes", keys: withMod("Shift+F"), run: () => searchFor(searchInput.value) },
        { title: "Open graph view", keys: withMod("G"), run: () => openView("graph") },
        { title: "Open canvas", run: () => openView("canvas") },
        { title: "New tab", keys: "Alt+T", run: () => addTab(activeGroup, newTab("home")) },
        { title: "Close tab", keys: "Alt+W", run: () => closeTab(activeGroup, tab) },
        { title: "Split right", keys: withMod("\\"), run: () => splitRight() },
        noted ? { title: "Go back", keys: "Alt+←", run: () => go(tab, -1) } : null,
        noted ? { title: "Go forward", keys: "Alt+→", run: () => go(tab, 1) } : null,
        noted ? { title: "Reveal this note in files", run: () => revealNote(i) } : null,
        noted ? { title: layout.bookmarks.includes(v.nodes[i].f) ? "Remove bookmark" : "Bookmark this note", run: () => toggleBookmark(i) } : null,
        noted ? { title: "Copy a link to this note", run: () => copyLink() } : null,
        noted ? { title: "Open this note on the site", run: () => api.open(v.nodes[i].u, true) } : null,
        { title: "Open a random note", run: () => openRandom() },
        jump("Open hot cache", "brain/hot.md"),
        jump("Open vault health", "brain/health.md"),
        jump("Open change log", "brain/log.md"),
        jump("Open the list of all pages", "brain/pages.md"),
        { title: "Show files", run: () => { ensurePane("files"); treeEl.focus(); } },
        { title: "Show tags", run: () => { ensurePane("tags"); tagInput.focus(); } },
        { title: "Show bookmarks", run: () => ensurePane("bookmarks") },
        { title: "Toggle left sidebar", run: () => toggleSide("left") },
        { title: "Toggle right sidebar", run: () => toggleSide("right") },
        { title: layout.labels === "title" ? "Show file names in files" : "Show note titles in files", run: () => toggleLabels() },
        { title: "Collapse all folders", run: () => { expanded.clear(); treeCursor = -1; refreshTree(); persist(); } },
        { title: "Leave the workspace", run: () => api.open("brain/", true) },
      ].filter(Boolean);
    }
    function openPalette() {
      const list = commands();
      api.pick({
        label: "Command palette",
        placeholder: "Run a command",
        rows: (term) => (term ? api.rank(term, list, (command) => command.title, 30) : list),
        show: (command) => [command.title, command.keys || ""],
        choose: (command) => command.run(),
      });
    }
    function onKey(event) {
      if (document.querySelector(".brain-switcher")) return;
      const mod = event.ctrlKey || event.metaKey;
      const key = event.key.toLowerCase();
      const typing = isTyping(event.target);
      const tab = currentTab();
      const run = (action) => { event.preventDefault(); action(); };
      if (mod && !event.altKey) {
        if (key === "p" && !event.shiftKey) run(() => openPalette());
        else if (key === "f" && event.shiftKey) run(() => searchFor(searchInput.value));
        else if (key === "g" && !event.shiftKey) run(() => openView("graph"));
        else if (key === "\\") run(() => splitRight());
        return;
      }
      if (event.altKey && !mod) {
        if (event.code === "KeyT") run(() => addTab(activeGroup, newTab("home")));
        else if (event.code === "KeyW") run(() => closeTab(activeGroup, tab));
        else if (event.key === "ArrowLeft" && !typing) run(() => go(tab, -1));
        else if (event.key === "ArrowRight" && !typing) run(() => go(tab, 1));
        return;
      }
      if (event.key === "Escape" && drawer) { setDrawer(null); return; }
      // Material turns a bare p, n, comma or full stop into "previous page"
      // and "next page", which would walk the reader out of the workspace.
      if (!typing && ["p", "n", ",", "."].includes(event.key)) event.stopPropagation();
    }
    document.addEventListener("keydown", onKey);
    cleanup.push(() => document.removeEventListener("keydown", onKey));

    api.opener = (url, event) => {
      const i = api.indexForUrl(v, api.siteUrl(url));
      if (i < 0) return false;
      openNote(i, { newTab: Boolean(event && (event.ctrlKey || event.metaKey)) });
      return true;
    };
    cleanup.push(() => { api.opener = null; });

    const onHash = () => { openFromHash(); };
    window.addEventListener("hashchange", onHash);
    cleanup.push(() => window.removeEventListener("hashchange", onHash));
    const onNarrow = () => { drawer = null; applySides(); renderDetails(); treeList.refresh(); };
    narrow.addEventListener("change", onNarrow);
    cleanup.push(() => narrow.removeEventListener("change", onNarrow));
    const skip = document.querySelector(".skip-link");
    const onSkip = (event) => { event.preventDefault(); if (activeGroup) activeGroup.bodyEl.focus(); };
    if (skip) {
      skip.addEventListener("click", onSkip);
      cleanup.push(() => skip.removeEventListener("click", onSkip));
    }

    /* -- first paint -- */
    layout.groups.forEach((saved) => {
      const group = createGroup();
      saved.tabs.forEach((tab) => group.tabs.push(newTab(tab.kind, tab.kind === "note" ? v.byPath.get(tab.path) : undefined)));
      group.active = saved.active;
    });
    activeGroup = groups[layout.activeGroup] || groups[0];
    groups.forEach((group) => {
      group.el.classList.toggle("is-active", group === activeGroup);
      const tab = group.tabs[group.active];
      group.active = -1;
      showTab(group, tab, true);
    });
    applySides();
    refreshTree();
    runSearch();
    filterTags();
    renderBookmarks();
    openFromHash();
    afterChange();

    return {
      destroy() {
        destroyed = true;
        clearTimeout(toastTimer);
        clearTimeout(saveTimer);
        saveStore(snapshot());
        stopLocalGraph();
        groups.forEach((group) => group.tabs.forEach(release));
        cleanup.forEach((undo) => undo());
        root.remove();
      },
    };
  }

  /* ---- mounting ----------------------------------------------------------- */
  // The workspace takes the window below the site header. The page it sits on
  // is hidden while it is up, and comes back if the vault cannot be read.
  function mountWorkspace(host) {
    const page = document.documentElement;
    const header = document.querySelector(".md-header");
    const shell = el("div", { class: "brain-ws-shell" }, el("p", { class: "brain-ws-hint", text: "Opening the vault…" }));
    let workspace = null;
    let gone = false;
    const place = () => {
      shell.style.top = `${header ? Math.max(header.getBoundingClientRect().bottom, 0) : 0}px`;
    };
    page.classList.add("brain-ws-open");
    document.body.append(shell);
    place();
    const observer = new ResizeObserver(place);
    if (header) observer.observe(header);
    window.addEventListener("resize", place);
    const close = () => {
      gone = true;
      observer.disconnect();
      window.removeEventListener("resize", place);
      if (workspace) workspace.destroy();
      shell.remove();
      page.classList.remove("brain-ws-open");
    };
    api.vault().then((v) => {
      if (gone) return;
      workspace = createWorkspace(v, shell);
    }).catch((error) => {
      console.error("brain: the workspace could not open", error);
      if (gone) return;
      close();
      host.textContent = "The workspace could not read the vault. Reload the page to try again.";
    });
    return { destroy() { if (!gone) close(); } };
  }

  api.register("workspace", mountWorkspace);
})();
