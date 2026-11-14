/* Obsidian-style views for the published vault: graph, local graph, hover
   previews, quick switcher, canvas and table. Material's instant navigation
   swaps the page without reloading, so everything re-attaches on document$. */
(function () {
  "use strict";

  const PALETTE = ["#5c6bc0", "#26a69a", "#ef6c00", "#ab47bc", "#42a5f5", "#9ccc65", "#ec407a", "#ffca28",
    "#8d6e63", "#26c6da", "#d4e157", "#ff7043", "#7e57c2", "#66bb6a", "#29b6f6", "#ffa726",
    "#78909c", "#ba68c8", "#4db6ac", "#f06292", "#aed581", "#90a4ae", "#ffd54f", "#4fc3f7"];
  const CONCEPT = "#ffd54f";
  const scope = () => (typeof __md_scope !== "undefined" ? __md_scope : new URL(".", location.href));
  const siteUrl = (path) => new URL(path, scope()).href;

  let vaultPromise = null;
  function vault() {
    if (!vaultPromise) {
      vaultPromise = fetch(siteUrl("assets/brain/graph.json")).then((r) => r.json()).then((data) => {
        const projects = [...new Set(data.nodes.map((n) => n.p))].sort();
        const colours = new Map(projects.map((p, i) => [p, PALETTE[i % PALETTE.length]]));
        const neighbours = data.nodes.map(() => new Set());
        data.edges.forEach(([a, b]) => { neighbours[a].add(b); neighbours[b].add(a); });
        const byUrl = new Map(data.nodes.map((n, i) => [n.u, i]));
        const byPath = new Map(data.nodes.map((n, i) => [n.f, i]));
        return { ...data, projects, colours, neighbours, byUrl, byPath };
      }).catch((error) => { vaultPromise = null; throw error; });
    }
    return vaultPromise;
  }
  const colourOf = (v, n) => (n.k === "concept" ? CONCEPT : v.colours.get(n.p) || "#90a4ae");
  const cssVar = (name) => getComputedStyle(document.body).getPropertyValue(name).trim();

  /* ---- force-directed graph on a canvas ---------------------------------- */
  function createGraph(host, v, nodes, links, options) {
    const canvas = document.createElement("canvas");
    canvas.className = "brain-canvas";
    host.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const view = { x: 0, y: 0, k: options.scale || 1 };
    let width = 0, height = 0, hover = null, dragged = null, panning = null, moved = false;
    const state = { filter: () => true, focus: options.focus };

    const degree = new Map(nodes.map((n) => [n, 0]));
    links.forEach((l) => { degree.set(l.source, degree.get(l.source) + 1); degree.set(l.target, degree.get(l.target) + 1); });
    const radius = (n) => Math.min(14, 2.5 + Math.sqrt(degree.get(n) || 0) * 1.1);

    const simulation = d3.forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(options.repel || -60).theta(1.1).distanceMax(600))
      .force("link", d3.forceLink(links).distance(options.distance || 45).strength(0.25))
      .force("x", d3.forceX().strength(0.05))
      .force("y", d3.forceY().strength(0.05))
      .alphaDecay(0.03)
      .on("tick", draw);

    function resize() {
      const box = host.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      width = box.width; height = box.height;
      canvas.width = width * ratio; canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    }
    const toWorld = (x, y) => [(x - width / 2 - view.x) / view.k, (y - height / 2 - view.y) / view.k];

    function draw() {
      if (!width) return;
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2 + view.x, height / 2 + view.y);
      ctx.scale(view.k, view.k);
      const lit = hover ? new Set([hover, ...hover.near]) : null;
      ctx.lineWidth = 0.6 / view.k;
      ctx.strokeStyle = cssVar("--md-default-fg-color--lighter") || "#999";
      // Thousands of full-strength edges would bury the nodes.
      ctx.globalAlpha = lit ? 1 : Math.min(1, 40 / Math.sqrt(links.length + 1) / 4);
      ctx.beginPath();
      links.forEach((l) => {
        if (!state.filter(l.source) || !state.filter(l.target)) return;
        if (lit && !(l.source === hover || l.target === hover)) return;
        ctx.moveTo(l.source.x, l.source.y); ctx.lineTo(l.target.x, l.target.y);
      });
      ctx.stroke();
      ctx.globalAlpha = 1;
      const label = cssVar("--md-default-fg-color") || "#333";
      nodes.forEach((n) => {
        if (!state.filter(n)) return;
        ctx.globalAlpha = lit && !lit.has(n) ? 0.15 : 1;
        ctx.fillStyle = n === state.focus ? cssVar("--md-accent-fg-color") : colourOf(v, n.data);
        ctx.beginPath(); ctx.arc(n.x, n.y, radius(n), 0, 6.283); ctx.fill();
      });
      ctx.globalAlpha = 1;
      ctx.fillStyle = label;
      ctx.font = `${11 / view.k}px sans-serif`;
      ctx.textAlign = "center";
      nodes.forEach((n) => {
        if (!state.filter(n)) return;
        const big = radius(n) * view.k > (options.labelAt || 7);
        if (big || n === hover || n === state.focus || (lit && lit.has(n))) {
          ctx.fillText(n.data.t.slice(0, 40), n.x, n.y + radius(n) + 12 / view.k);
        }
      });
      ctx.restore();
    }

    function pick(event) {
      const box = canvas.getBoundingClientRect();
      const [x, y] = toWorld(event.clientX - box.left, event.clientY - box.top);
      let best = null, bestD = Infinity;
      nodes.forEach((n) => {
        if (!state.filter(n)) return;
        const d = Math.hypot(n.x - x, n.y - y);
        if (d < Math.max(radius(n), 6 / view.k) && d < bestD) { best = n; bestD = d; }
      });
      return best;
    }

    canvas.addEventListener("pointerdown", (e) => {
      canvas.setPointerCapture(e.pointerId);
      moved = false;
      dragged = pick(e);
      if (dragged) { simulation.alphaTarget(0.2).restart(); } else { panning = [e.clientX - view.x, e.clientY - view.y]; }
      canvas.classList.add("is-dragging");
    });
    canvas.addEventListener("pointermove", (e) => {
      if (dragged) {
        const box = canvas.getBoundingClientRect();
        [dragged.fx, dragged.fy] = toWorld(e.clientX - box.left, e.clientY - box.top);
        moved = true;
      } else if (panning) {
        view.x = e.clientX - panning[0]; view.y = e.clientY - panning[1]; moved = true; draw();
      } else {
        const next = pick(e);
        if (next !== hover) { hover = next; canvas.style.cursor = next ? "pointer" : ""; draw(); }
      }
    });
    canvas.addEventListener("pointerup", () => {
      if (dragged) {
        simulation.alphaTarget(0);
        const clicked = !moved && dragged;
        dragged.fx = dragged.fy = null;
        dragged = null;
        if (clicked) open(clicked.data.u);
      }
      panning = null;
      canvas.classList.remove("is-dragging");
    });
    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const box = canvas.getBoundingClientRect();
      const [x, y] = toWorld(e.clientX - box.left, e.clientY - box.top);
      view.k = Math.min(8, Math.max(0.05, view.k * Math.exp(-e.deltaY * 0.0015)));
      view.x = e.clientX - box.left - width / 2 - x * view.k;
      view.y = e.clientY - box.top - height / 2 - y * view.k;
      draw();
    }, { passive: false });

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    return {
      simulation, draw,
      setFilter(fn) { state.filter = fn; draw(); },
      setForce(name, value) {
        if (name === "repel") simulation.force("charge").strength(-value);
        if (name === "distance") simulation.force("link").distance(value);
        simulation.alpha(0.4).restart();
      },
      destroy() { simulation.stop(); observer.disconnect(); canvas.remove(); },
    };
  }

  function open(url) {
    // A real link click, so Material's instant navigation handles history.
    const link = document.createElement("a");
    link.href = siteUrl(url);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function buildSubgraph(v, indices) {
    const nodes = indices.map((i) => ({ data: v.nodes[i], index0: i }));
    const lookup = new Map(nodes.map((n) => [n.index0, n]));
    nodes.forEach((n) => { n.near = [...v.neighbours[n.index0]].map((i) => lookup.get(i)).filter(Boolean); });
    const links = v.edges.filter(([a, b]) => lookup.has(a) && lookup.has(b))
      .map(([a, b]) => ({ source: lookup.get(a), target: lookup.get(b) }));
    return { nodes, links, lookup };
  }

  /* ---- global graph ------------------------------------------------------- */
  let active = [];
  async function mountGlobalGraph(host) {
    const v = await vault();
    const { nodes, links } = buildSubgraph(v, v.nodes.map((_, i) => i));
    const graph = createGraph(host, v, nodes, links, { scale: 0.22, repel: -70, distance: 40, labelAt: 9 });
    active.push(graph);

    const hidden = new Set();
    const panel = document.createElement("div");
    panel.className = "brain-controls";
    panel.innerHTML = `<input type="search" placeholder="Filter notes" aria-label="Filter notes">
      <label><input type="checkbox" data-opt="orphans"> Show orphans</label>
      <label><input type="checkbox" data-opt="concepts" checked> Show concepts</label>
      <details><summary>Forces</summary>
        <label>Repel <input type="range" min="10" max="200" value="70" data-force="repel"></label>
        <label>Distance <input type="range" min="10" max="150" value="40" data-force="distance"></label>
      </details>
      <details><summary>Groups</summary><div class="brain-groups"></div></details>
      <div class="brain-stats"></div>`;
    host.appendChild(panel);
    const groups = panel.querySelector(".brain-groups");
    v.projects.forEach((p) => {
      const row = document.createElement("label");
      row.innerHTML = `<input type="checkbox" checked><span class="brain-swatch" style="background:${v.colours.get(p)}"></span>`;
      row.append(p || "(root)");
      row.querySelector("input").addEventListener("change", (e) => {
        if (e.target.checked) { hidden.delete(p); } else { hidden.add(p); }
        apply();
      });
      groups.appendChild(row);
    });
    const search = panel.querySelector("input[type=search]");
    const orphans = panel.querySelector('[data-opt="orphans"]');
    const concepts = panel.querySelector('[data-opt="concepts"]');
    const stats = panel.querySelector(".brain-stats");
    function apply() {
      const term = search.value.trim().toLowerCase();
      const test = (n) => !hidden.has(n.data.p)
        && (orphans.checked || n.near.length > 0)
        && (concepts.checked || n.data.k !== "concept")
        && (!term || n.data.t.toLowerCase().includes(term) || n.data.g.some((t) => t.toLowerCase().includes(term)));
      graph.setFilter(test);
      stats.textContent = `${nodes.filter(test).length} of ${nodes.length} notes, ${links.length} links`;
    }
    [search, orphans, concepts].forEach((el) => el.addEventListener("input", apply));
    panel.querySelectorAll("[data-force]").forEach((el) => el.addEventListener("input", () => graph.setForce(el.dataset.force, +el.value)));
    apply();
  }

  /* ---- local graph -------------------------------------------------------- */
  async function mountLocalGraph() {
    const panel = document.querySelector(".brain-panel[data-brain-path]");
    const sidebar = document.querySelector(".md-sidebar--secondary .md-sidebar__inner");
    if (!panel) return;
    const v = await vault();
    const centre = v.byPath.get(panel.dataset.brainPath);
    if (centre === undefined || !v.neighbours[centre].size) return;
    const near = new Set([centre, ...v.neighbours[centre]]);
    if (near.size < 40) [...near].forEach((i) => v.neighbours[i].forEach((j) => { if (near.size < 60) near.add(j); }));
    const { nodes, links, lookup } = buildSubgraph(v, [...near]);
    const title = document.createElement("div");
    title.className = "brain-local-title";
    title.textContent = "Local graph";
    const host = document.createElement("div");
    host.className = "brain-local";
    const visible = sidebar && sidebar.offsetParent !== null;
    if (visible) { sidebar.append(title, host); } else { panel.prepend(title, host); }
    const graph = createGraph(host, v, nodes, links, { focus: lookup.get(centre), scale: 0.8, repel: -90, distance: 40, labelAt: 8 });
    active.push({ destroy() { graph.destroy(); title.remove(); host.remove(); } });
  }

  /* ---- hover preview ------------------------------------------------------ */
  let preview = null, previewTimer = 0;
  function hidePreview() { clearTimeout(previewTimer); if (preview) { preview.remove(); preview = null; } }
  function nodeForLink(v, anchor) {
    const url = new URL(anchor.href, location.href);
    const base = new URL(scope()).pathname;
    if (url.origin !== location.origin || !url.pathname.startsWith(base)) return null;
    const i = v.byUrl.get(decodeURI(url.pathname.slice(base.length)));
    return i === undefined ? null : v.nodes[i];
  }
  function bindPreviews() {
    document.addEventListener("mouseover", (event) => {
      const anchor = event.target.closest && event.target.closest(".md-content a[href]");
      if (!anchor) return;
      clearTimeout(previewTimer);
      previewTimer = setTimeout(async () => {
        const v = await vault();
        const node = nodeForLink(v, anchor);
        if (!node || !anchor.isConnected) return;
        hidePreview();
        preview = document.createElement("div");
        preview.className = "brain-preview";
        const title = document.createElement("strong");
        title.textContent = node.t;
        const where = document.createElement("small");
        where.textContent = `${node.p} · ${node.w} words`;
        preview.append(title, node.s || "", where);
        document.body.appendChild(preview);
        const box = anchor.getBoundingClientRect();
        const room = window.innerHeight - box.bottom;
        preview.style.left = `${Math.max(8, Math.min(box.left, window.innerWidth - preview.offsetWidth - 8))}px`;
        preview.style.top = `${room > preview.offsetHeight + 12 ? box.bottom + 6 : box.top - preview.offsetHeight - 6}px`;
      }, 300);
    });
    document.addEventListener("mouseout", (event) => {
      if (event.target.closest && event.target.closest(".md-content a[href]")) hidePreview();
    });
  }

  /* ---- quick switcher ----------------------------------------------------- */
  function score(term, title) {
    const text = title.toLowerCase();
    const at = text.indexOf(term);
    if (at === 0) return 3000 - text.length;
    if (at > 0) return 2000 - at - text.length / 10;
    let i = 0;
    for (const char of text) { if (char === term[i]) i += 1; if (i === term.length) return 1000 - text.length; }
    return -1;
  }
  async function openSwitcher() {
    if (document.querySelector(".brain-switcher")) return;
    const v = await vault();
    const shell = document.createElement("div");
    shell.className = "brain-switcher";
    shell.innerHTML = '<div class="brain-switcher-box" role="dialog" aria-label="Quick switcher"><input type="text" placeholder="Find a note" aria-label="Find a note"><ul></ul></div>';
    document.body.appendChild(shell);
    const input = shell.querySelector("input");
    const list = shell.querySelector("ul");
    let rows = [], cursor = 0;
    const close = () => shell.remove();
    function paint() {
      list.replaceChildren(...rows.map((n, i) => {
        const li = document.createElement("li");
        li.textContent = n.t;
        const where = document.createElement("span");
        where.textContent = n.p;
        li.append(where);
        if (i === cursor) li.className = "is-active";
        li.addEventListener("click", () => { close(); open(n.u); });
        return li;
      }));
      const current = list.children[cursor];
      if (current) current.scrollIntoView({ block: "nearest" });
    }
    function update() {
      const term = input.value.trim().toLowerCase();
      rows = !term ? v.nodes.filter((n) => n.k === "project" || n.k === "map").slice(0, 20)
        : v.nodes.map((n) => [score(term, n.t), n]).filter((r) => r[0] >= 0)
          .sort((a, b) => b[0] - a[0]).slice(0, 20).map((r) => r[1]);
      cursor = 0;
      paint();
    }
    input.addEventListener("input", update);
    input.addEventListener("keydown", (e) => {
      e.stopPropagation();
      if (e.key === "Escape") close();
      if (e.key === "ArrowDown") { e.preventDefault(); cursor = Math.min(cursor + 1, rows.length - 1); paint(); }
      if (e.key === "ArrowUp") { e.preventDefault(); cursor = Math.max(cursor - 1, 0); paint(); }
      if (e.key === "Enter" && rows[cursor]) { close(); open(rows[cursor].u); }
    });
    shell.addEventListener("click", (e) => { if (e.target === shell) close(); });
    update();
    input.focus();
  }

  function addHeaderButtons() {
    const search = document.querySelector(".md-header__inner .md-search");
    if (!search || document.querySelector(".brain-button")) return;
    const icons = {
      graph: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17 3a3 3 0 0 0-2.8 4l-3.6 3.2a3 3 0 0 0-3.9.6L5 9.9A3 3 0 1 0 4 12l2.4 1a3 3 0 0 0 .7 2.4l-1.8 2.8a3 3 0 1 0 1.7 1l1.8-2.8a3 3 0 0 0 3.5-1.6l3.8.9A3 3 0 1 0 16.4 14l-3.8-.9a3 3 0 0 0-.7-1.5l3.6-3.2A3 3 0 1 0 17 3z"/></svg>',
      find: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 5h16v2H4V5zm0 6h10v2H4v-2zm0 6h16v2H4v-2zm14-7 3 2-3 2v-4z"/></svg>',
    };
    const make = (label, icon, action) => {
      const button = document.createElement("button");
      button.className = "md-header__button md-icon brain-button";
      button.type = "button";
      button.title = label;
      button.setAttribute("aria-label", label);
      button.innerHTML = icon;
      button.addEventListener("click", action);
      return button;
    };
    search.before(make("Quick switcher (Ctrl+O)", icons.find, openSwitcher),
      make("Graph view", icons.graph, () => open("brain/graph/")));
  }

  /* ---- canvas ------------------------------------------------------------- */
  async function mountCanvas(host) {
    const [v, board] = await Promise.all([vault(), fetch(siteUrl("brain/fleet.canvas")).then((r) => r.json())]);
    const canvas = document.createElement("canvas");
    canvas.className = "brain-canvas";
    host.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const items = new Map(board.nodes.map((n) => [n.id, { ...n, note: v.nodes[v.byPath.get(n.file)] }]));
    const xs = board.nodes.flatMap((n) => [n.x, n.x + n.width]);
    const ys = board.nodes.flatMap((n) => [n.y, n.y + n.height]);
    const bounds = { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
    const view = { x: 0, y: 0, k: 1 };
    let width = 0, height = 0, pan = null, moved = false, hover = null;
    function fit() {
      const box = host.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      width = box.width; height = box.height;
      canvas.width = width * ratio; canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      view.k = Math.min(width / (bounds.w + 120), height / (bounds.h + 120));
      view.x = (width - bounds.w * view.k) / 2 - bounds.x * view.k;
      view.y = (height - bounds.h * view.k) / 2 - bounds.y * view.k;
      draw();
    }
    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(view.x, view.y);
      ctx.scale(view.k, view.k);
      ctx.lineWidth = 1 / view.k;
      board.edges.forEach((e) => {
        const a = items.get(e.fromNode), b = items.get(e.toNode);
        if (!a || !b) return;
        const lit = hover && (a === hover || b === hover);
        ctx.strokeStyle = cssVar("--md-default-fg-color--lighter");
        ctx.globalAlpha = hover && !lit ? 0.12 : 1;
        ctx.lineWidth = (lit ? 2 : 1) / view.k;
        ctx.beginPath();
        ctx.moveTo(a.x + a.width / 2, a.y + a.height / 2);
        ctx.lineTo(b.x + b.width / 2, b.y + b.height / 2);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      const fg = cssVar("--md-default-fg-color"), bg = cssVar("--md-default-bg-color");
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "22px sans-serif";
      items.forEach((n) => {
        ctx.fillStyle = bg;
        ctx.strokeStyle = n === hover ? cssVar("--md-accent-fg-color") : n.id[0] === "c" ? CONCEPT : "#5c6bc0";
        ctx.lineWidth = 3 / view.k;
        ctx.beginPath();
        ctx.roundRect(n.x, n.y, n.width, n.height, 10);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = fg;
        ctx.fillText((n.note ? n.note.t : n.file).slice(0, 22), n.x + n.width / 2, n.y + n.height / 2);
      });
      ctx.restore();
    }
    const pick = (e) => {
      const box = canvas.getBoundingClientRect();
      const x = (e.clientX - box.left - view.x) / view.k, y = (e.clientY - box.top - view.y) / view.k;
      return [...items.values()].find((n) => x >= n.x && x <= n.x + n.width && y >= n.y && y <= n.y + n.height) || null;
    };
    canvas.addEventListener("pointerdown", (e) => { canvas.setPointerCapture(e.pointerId); pan = [e.clientX - view.x, e.clientY - view.y]; moved = false; });
    canvas.addEventListener("pointermove", (e) => {
      if (pan) { view.x = e.clientX - pan[0]; view.y = e.clientY - pan[1]; moved = true; draw(); return; }
      const next = pick(e);
      if (next !== hover) { hover = next; canvas.style.cursor = next ? "pointer" : ""; draw(); }
    });
    canvas.addEventListener("pointerup", (e) => {
      pan = null;
      const node = !moved && pick(e);
      if (node && node.note) open(node.note.u);
    });
    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const box = canvas.getBoundingClientRect();
      const px = e.clientX - box.left, py = e.clientY - box.top;
      const k = Math.min(4, Math.max(0.05, view.k * Math.exp(-e.deltaY * 0.0015)));
      view.x = px - (px - view.x) * (k / view.k);
      view.y = py - (py - view.y) * (k / view.k);
      view.k = k;
      draw();
    }, { passive: false });
    const observer = new ResizeObserver(fit);
    observer.observe(host);
    active.push({ destroy() { observer.disconnect(); canvas.remove(); } });
  }

  /* ---- table -------------------------------------------------------------- */
  async function mountTable(host) {
    const v = await vault();
    const columns = [["Title", (n) => n.t], ["Project", (n) => n.p], ["Kind", (n) => n.k],
      ["Links", (n, i) => v.neighbours[i].size], ["Words", (n) => n.w]];
    host.innerHTML = `<div class="brain-table-tools"><input type="search" placeholder="Filter" aria-label="Filter pages">
      <select aria-label="Project"><option value="">All projects</option></select><span class="brain-count"></span></div>
      <div class="brain-table-scroll"><table class="brain-table"><thead><tr></tr></thead><tbody></tbody></table></div>`;
    const select = host.querySelector("select");
    v.projects.forEach((p) => select.add(new Option(p || "(root)", p)));
    const head = host.querySelector("thead tr");
    const body = host.querySelector("tbody");
    const input = host.querySelector("input");
    const count = host.querySelector(".brain-count");
    let sort = 3, direction = -1;
    columns.forEach(([name], c) => {
      const th = document.createElement("th");
      th.textContent = name;
      th.addEventListener("click", () => { direction = sort === c ? -direction : (c === 0 ? 1 : -1); sort = c; paint(); });
      head.appendChild(th);
    });
    function paint() {
      const term = input.value.trim().toLowerCase();
      const rows = v.nodes.map((n, i) => [n, i])
        .filter(([n]) => (!select.value || n.p === select.value) && (!term || n.t.toLowerCase().includes(term)));
      const value = columns[sort][1];
      rows.sort((a, b) => {
        const x = value(a[0], a[1]), y = value(b[0], b[1]);
        return direction * (typeof x === "number" ? x - y : String(x).localeCompare(String(y)));
      });
      count.textContent = `${rows.length} notes`;
      body.replaceChildren(...rows.slice(0, 300).map(([n, i]) => {
        const tr = document.createElement("tr");
        columns.forEach(([, read], c) => {
          const td = document.createElement("td");
          if (c === 0) {
            const a = document.createElement("a");
            a.href = siteUrl(n.u);
            a.textContent = n.t;
            td.appendChild(a);
          } else { td.textContent = read(n, i); }
          tr.appendChild(td);
        });
        return tr;
      }));
    }
    input.addEventListener("input", paint);
    select.addEventListener("change", paint);
    paint();
  }

  function mountPage() {
    active.forEach((item) => item.destroy());
    active = [];
    hidePreview();
    addHeaderButtons();
    document.querySelectorAll("[data-brain-view]").forEach((host) => {
      host.replaceChildren();
      const mount = { graph: mountGlobalGraph, canvas: mountCanvas, table: mountTable }[host.dataset.brainView];
      if (mount) mount(host);
    });
    mountLocalGraph();
  }

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "o") { e.preventDefault(); openSwitcher(); }
  });
  bindPreviews();
  if (typeof document$ !== "undefined") { document$.subscribe(mountPage); } else { document.addEventListener("DOMContentLoaded", mountPage); }
})();
