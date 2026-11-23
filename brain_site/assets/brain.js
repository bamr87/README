/* Obsidian-style views for the published vault: graph, local graph, atlas, hover
   previews, quick switcher, canvas and table. The graphs draw with sigma (WebGL),
   loaded from graph-engine.bundle.js only on a page that has one. Material's instant navigation
   swaps the page without reloading, so everything re-attaches on document$.
   window.BrainVault is what workspace.js builds on: the vault, the local graph, the
   picker and the registry of views a [data-brain-view] host can ask for. */
(function () {
  "use strict";

  const api = { opener: null, views: {} };
  // What the current page has mounted, and which page that is: a view that
  // finishes loading after the reader moved on is taken down, not kept.
  let active = [];
  let generation = 0;

  const CONCEPT = "#ffd54f";   // the canvas board's concept colour; the graphs read theirs from graph.json

  const scope = () => (typeof __md_scope !== "undefined" ? __md_scope : new URL(".", location.href));
  const siteUrl = (path) => new URL(path, scope()).href;

  let vaultPromise = null;
  function vault() {
    if (!vaultPromise) {
      vaultPromise = fetch(siteUrl("assets/brain/graph.json")).then((r) => r.json()).then((data) => {
        const projects = [...new Set(data.nodes.map((n) => n.p))].sort();
        const colours = new Map(Object.entries(data.colours || {}));
        const neighbours = data.nodes.map(() => new Set());
        data.edges.forEach(([a, b]) => { neighbours[a].add(b); neighbours[b].add(a); });
        const byUrl = new Map(data.nodes.map((n, i) => [n.u, i]));
        const byPath = new Map(data.nodes.map((n, i) => [n.f, i]));
        return { ...data, projects, colours, neighbours, byUrl, byPath };
      }).catch((error) => { vaultPromise = null; throw error; });
    }
    return vaultPromise;
  }
  const colourOf = (v, n) => n.c || (n.k === "concept" ? v.concept : v.colours.get(n.p) || v.neutral || "#b0b0b0");
  const cssVar = (name) => getComputedStyle(document.body).getPropertyValue(name).trim();

  /* ---- the graph engine: sigma on graphology, loaded only where a graph is drawn ---- */
  let enginePromise = null;
  function engine() {
    if (window.BrainGraph) return Promise.resolve(window.BrainGraph);
    if (!enginePromise) {
      enginePromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = siteUrl("assets/brain/graph-engine.bundle.js");
        script.onload = () => resolve(window.BrainGraph);
        script.onerror = () => { enginePromise = null; reject(new Error("the graph engine did not load")); };
        document.head.appendChild(script);
      });
    }
    return enginePromise;
  }
  const hasWebGL2 = () => { try { return !!document.createElement("canvas").getContext("webgl2"); } catch (e) { return false; } };

  // Material's colours can be hsla() or carry var(); a 2D context hands any CSS colour back as hex or rgba.
  const probe = document.createElement("canvas").getContext("2d");
  function plain(colour, fallback) {
    if (!colour) return fallback;
    probe.fillStyle = fallback;
    probe.fillStyle = colour;
    return probe.fillStyle;
  }
  function theme() {
    const dark = (document.body.getAttribute("data-md-color-scheme") || "").includes("slate");
    return {
      dark,
      fg: plain(cssVar("--md-default-fg-color"), dark ? "#e2e4e9" : "#1f2329"),
      bg: plain(cssVar("--md-default-bg-color"), dark ? "#1e2129" : "#ffffff"),
      accent: plain(cssVar("--md-accent-fg-color"), "#526cfe"),
      edge: dark ? "rgba(255,255,255,0.09)" : "rgba(30,35,45,0.09)",
      faded: dark ? "#353945" : "#e6e8ec",
    };
  }
  function withAlpha(colour, alpha) {
    const hex = plain(colour, "#888888");
    if (!hex.startsWith("#")) return hex;
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    return `rgba(${r},${g},${b},${alpha})`;
  }
  const sizeOf = (n) => (n.k === "project" ? 9 : n.k === "concept" ? 5 : 2) + Math.min(10, Math.sqrt(n.d || 0) * 1.15);
  const plural = (count, word) => `${count.toLocaleString()} ${word}${count === 1 ? "" : "s"}`;
  const escapeHtml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function buildGraph(B, v, indices, place, scale = 1) {
    const graph = new B.Graph({ type: "undirected" });
    indices.forEach((i) => {
      const n = v.nodes[i];
      const [x, y] = place ? place(i) : [n.x, n.y];
      graph.addNode(String(i), { x, y, size: sizeOf(n) * scale, color: colourOf(v, n), label: n.t, i });
    });
    v.edges.forEach(([a, b]) => {
      const s = String(a), t = String(b);
      if (a !== b && graph.hasNode(s) && graph.hasNode(t) && !graph.hasEdge(s, t)) graph.addEdge(s, t);
    });
    return graph;
  }

  /* One renderer for both graphs: hover lights a note's links, a selection keeps them lit,
     a path shows only its route, and a filter hides what the controls exclude. */
  function renderer(B, graph, host, options) {
    const ink = theme();
    const look = { hovered: null, selected: null, near: new Set(), path: null, route: null, show: () => true };
    const focus = () => look.hovered || look.selected;
    // A link takes its repository's colour, barely: thousands of them should read as a texture, not a mesh.
    // Links into the concept hub are fainter still, so the repositories stay legible from afar.
    const tints = new Map();
    const tint = (s, t) => {
      const a = graph.getNodeAttributes(s), b = graph.getNodeAttributes(t);
      const hub = options.hub && (options.hub(a) || options.hub(b));
      const base = options.hub && options.hub(a) ? b.color : a.color;
      const key = base + (hub ? "h" : "");
      if (!tints.has(key)) tints.set(key, withAlpha(base, hub ? (ink.dark ? 0.05 : 0.04) : (ink.dark ? 0.16 : 0.12)));
      return tints.get(key);
    };
    const sigma = new B.Sigma(graph, host, {
      settings: {
        // sigma 4 measures sizes in graph units by default; a small local graph needs pixels.
        itemSizesReference: options.screenSizes ? "screen" : "positions",
        labelDensity: options.labelDensity || 0.08,
        labelGridCellSize: 70,
        labelRenderedSizeThreshold: options.labelAt || 7,
        hideEdgesOnMove: graph.size > 4000,
        minCameraRatio: 0.03,
        maxCameraRatio: 3,
        stagePadding: 24,
        // A workspace tab that is not showing has no size yet; it draws once it has one.
        allowInvalidContainer: true,
      },
      nodeReducer(key, data, attrs) {
        if (!look.show(attrs)) return { visibility: "hidden" };
        const out = { labelColor: ink.fg, backdropColor: ink.bg, backdropShadowColor: ink.dark ? "rgba(0,0,0,.6)" : "rgba(0,0,0,.25)" };
        if (look.path) {
          if (look.path.has(key)) Object.assign(out, { labelVisibility: "visible", zIndex: 2, size: data.size * 1.3 });
          else Object.assign(out, { color: ink.faded, labelVisibility: "hidden", zIndex: 0 });
          return out;
        }
        const f = focus();
        if (f) {
          if (key === f) Object.assign(out, { labelVisibility: "visible", zIndex: 3, size: data.size * 1.4, backdropVisibility: "visible" });
          else if (look.near.has(key)) Object.assign(out, { labelVisibility: "visible", zIndex: 2 });
          else Object.assign(out, { color: ink.faded, labelVisibility: "hidden", zIndex: 0 });
        }
        if (key === look.selected || (key === options.pinned && !f)) Object.assign(out, { labelVisibility: "visible", backdropVisibility: "visible", zIndex: 3 });
        return out;
      },
      edgeReducer(key, data) {
        const [s, t] = graph.extremities(key);
        if (!look.show(graph.getNodeAttributes(s)) || !look.show(graph.getNodeAttributes(t))) return { visibility: "hidden" };
        if (look.path) return look.route.has(key) ? { color: ink.accent, size: 3, zIndex: 2 } : { visibility: "hidden" };
        const f = focus();
        if (f) return s === f || t === f ? { color: graph.getNodeAttribute(f, "color"), size: 1.5, zIndex: 1 } : { visibility: "hidden" };
        return { color: tint(s, t), size: 0.5 };
      },
    });
    const redraw = () => sigma.refresh({ skipIndexation: true });
    const setNear = () => { const f = focus(); look.near = f ? new Set(graph.neighbors(f)) : new Set(); };
    sigma.on("enterNode", ({ node }) => { look.hovered = node; setNear(); host.style.cursor = "pointer"; redraw(); });
    sigma.on("leaveNode", () => { look.hovered = null; setNear(); host.style.cursor = ""; redraw(); });
    // sigma follows the window's size; a panel or pane can change size on its own.
    const observer = new ResizeObserver(() => sigma.scheduleRefresh());
    observer.observe(host);
    return {
      sigma, graph, look, redraw,
      select(node) { look.selected = node; look.path = null; look.route = null; setNear(); redraw(); },
      showPath(nodes) {
        look.path = new Set(nodes);
        look.route = new Set(nodes.slice(1).map((n, i) => graph.edge(nodes[i], n)));
        redraw();
      },
      clear() { look.selected = null; look.path = null; look.route = null; setNear(); redraw(); },
      setFilter(fn) { look.show = fn; redraw(); },
      // Move the camera to a point, keeping it clear of whatever covers the right side (the card).
      flyTo(x, y, ratio) {
        const a = sigma.viewportToFramedGraph({ x: 0, y: 0 }), b = sigma.viewportToFramedGraph({ x: 100, y: 0 });
        const perPixel = Math.hypot(b.x - a.x, b.y - a.y) / 100 / sigma.getCamera().ratio;
        const shift = options.cover ? options.cover() / 2 : 0;
        sigma.getCamera().animate({ x: x + shift * perPixel * ratio, y, ratio }, { duration: 650 });
      },
      fly(node, ratio) {
        const d = sigma.getNodeDisplayData(node);
        if (d) this.flyTo(d.x, d.y, ratio || 0.12);
      },
      fit(keys) {
        const points = keys.map((k) => sigma.getNodeDisplayData(k)).filter(Boolean);
        if (!points.length) return;
        const xs = points.map((p) => p.x), ys = points.map((p) => p.y);
        const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
        this.flyTo((x0 + x1) / 2, (y0 + y1) / 2, Math.min(1.1, Math.max(0.08, Math.max(x1 - x0, y1 - y0) * 2.4)));
      },
      reset() { sigma.getCamera().reset({ duration: 600 }); },
      destroy() { observer.disconnect(); sigma.kill(); },
    };
  }

  function open(url, leave, event) {
    // The workspace keeps a note inside itself; `leave` asks for the site page.
    if (!leave && api.opener && api.opener(url, event)) return;
    // A real link click, so Material's instant navigation handles history.
    const link = document.createElement("a");
    link.href = siteUrl(url);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function unsupported(host, message) {
    const note = document.createElement("p");
    note.className = "brain-unsupported";
    note.innerHTML = message;
    host.appendChild(note);
  }

  /* ---- global graph: an explorer over every note ---------------------------- */
  // Every view returns a handle, so whoever mounted it can take it down again.
  // `embedded` is the workspace: it owns the address and the keyboard, and it
  // keeps a tab's host off the page while another tab is showing.
  async function mountGlobalGraph(host, options = {}) {
    const own = !options.embedded;
    if (!hasWebGL2()) {
      unsupported(host, `This view needs WebGL 2, which this browser does not offer. Browse the <a href="${siteUrl("brain/atlas/")}">Atlas</a> or <a href="${siteUrl("brain/pages/")}">All pages</a> instead.`);
      return null;
    }
    const [B, v] = await Promise.all([engine(), vault()]);
    if (own && !host.isConnected) return null;
    const stage = document.createElement("div");
    stage.className = "brain-stage";
    host.appendChild(stage);
    const graph = buildGraph(B, v, v.nodes.map((_, i) => i));
    const card = document.createElement("aside");
    const r = renderer(B, graph, stage, { labelAt: 9, labelDensity: 0.06, hub: (a) => v.nodes[a.i].p === "brain",
      cover: () => (card.hidden ? 0 : card.offsetWidth + 16) });
    const { sigma } = r;
    const home = new Map();
    graph.forEachNode((key, a) => home.set(key, [a.x, a.y]));

    // Repository halos behind the notes and their names above them, kept in step with the camera.
    const halos = sigma.createLayer("brain-halos", "div", { beforeLayer: "stage" });
    const names = sigma.createLayer("brain-names", "div", { beforeLayer: "mouse" });
    let clusters = v.clusters.filter((c) => c.n >= 3);
    const ink = theme();
    function paintClusters() {
      const ratio = sigma.getCamera().ratio;
      const fade = Math.max(0, Math.min(1, (ratio - 0.18) / 0.32));
      halos.replaceChildren(...clusters.map((c) => {
        const centre = sigma.graphToViewport({ x: c.x, y: c.y });
        const edge = sigma.graphToViewport({ x: c.x + c.r, y: c.y });
        const radius = Math.hypot(edge.x - centre.x, edge.y - centre.y);
        const halo = document.createElement("div");
        halo.className = "brain-halo";
        const colour = c.p === "brain" ? v.concept : v.colours.get(c.p) || v.neutral;
        Object.assign(halo.style, { left: `${centre.x - radius}px`, top: `${centre.y - radius}px`, width: `${radius * 2}px`, height: `${radius * 2}px`,
          background: `radial-gradient(circle, ${colour}${ink.dark ? "26" : "1f"} 0%, ${colour}0a 62%, transparent 72%)` });
        return halo;
      }));
      names.replaceChildren(...clusters.filter(() => fade > 0.02).map((c) => {
        const centre = sigma.graphToViewport({ x: c.x, y: c.y });
        const edge = sigma.graphToViewport({ x: c.x, y: c.y + c.r });
        const label = document.createElement("div");
        label.className = "brain-name";
        label.textContent = c.p === "brain" ? "Concepts" : c.t;
        label.style.left = `${centre.x}px`;
        label.style.top = `${Math.min(centre.y, edge.y) - 4}px`;
        label.style.opacity = String(fade);
        label.style.fontSize = `${Math.max(0.6, Math.min(1.1, 0.45 + Math.sqrt(c.n) / 40))}rem`;
        return label;
      }));
    }
    sigma.on("afterRender", paintClusters);

    // Controls: find, layout, filters, repositories, path.
    const panel = document.createElement("div");
    panel.className = "brain-controls";
    panel.innerHTML = `<div class="brain-find"><input type="search" placeholder="Find a note  ( / )" aria-label="Find a note" autocomplete="off"><ul class="brain-suggest" role="listbox"></ul></div>
      <div class="brain-toggle" role="group" aria-label="Layout">
        <button type="button" data-layout="home" aria-pressed="true" title="Each repository in its own circle, folders inside it">By repository</button>
        <button type="button" data-layout="relax" aria-pressed="false" title="Let the links pull related notes together">By connection</button>
      </div>
      <label><input type="checkbox" data-opt="concepts" checked> Concepts</label>
      <label><input type="checkbox" data-opt="orphans"> Notes with no links</label>
      <details><summary>Repositories</summary><div class="brain-groups"></div></details>
      <div class="brain-stats"></div>`;
    host.appendChild(panel);
    const wide = document.createElement("button");
    wide.type = "button";
    wide.className = "brain-wide";
    wide.title = "Full screen";
    wide.setAttribute("aria-label", "Full screen");
    wide.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 5h5v2H7v3H5V5zm9 0h5v5h-2V7h-3V5zM5 14h2v3h3v2H5v-5zm12 3v-3h2v5h-5v-2h3z"/></svg>';
    wide.addEventListener("click", () => (document.fullscreenElement ? document.exitFullscreen() : host.requestFullscreen && host.requestFullscreen()));
    host.appendChild(wide);
    card.className = "brain-card";
    card.hidden = true;
    host.appendChild(card);

    const hidden = new Set();
    const boxes = new Map();
    const groups = panel.querySelector(".brain-groups");
    const counts = new Map(v.clusters.map((c) => [c.p, c.n]));
    [...counts.keys()].filter((p) => p !== "").sort((a, b) => counts.get(b) - counts.get(a)).forEach((p) => {
      const row = document.createElement("label");
      const colour = p === "brain" ? v.concept : v.colours.get(p) || v.neutral;
      row.innerHTML = `<input type="checkbox" checked><span class="brain-swatch" style="background:${colour}"></span><span class="brain-group-name"></span><span class="brain-count">${counts.get(p)}</span>`;
      row.querySelector(".brain-group-name").textContent = p === "brain" ? "Concepts and maps" : p;
      boxes.set(p, row.querySelector("input"));
      row.querySelector("input").addEventListener("change", (e) => {
        if (e.target.checked) hidden.delete(p); else hidden.add(p);
        apply();
      });
      row.title = "Alt-click to show only this repository";
      row.addEventListener("click", (e) => {
        if (!e.altKey) return;
        e.preventDefault();
        hidden.clear();
        boxes.forEach((box, q) => { box.checked = q === p; if (q !== p) hidden.add(q); });
        apply();
      });
      groups.appendChild(row);
    });
    const concepts = panel.querySelector('[data-opt="concepts"]');
    const orphans = panel.querySelector('[data-opt="orphans"]');
    const stats = panel.querySelector(".brain-stats");
    function apply() {
      const test = (a) => {
        const n = v.nodes[a.i];
        return !hidden.has(n.p) && (orphans.checked || (n.d || 0) > 0) && (concepts.checked || n.k !== "concept");
      };
      r.setFilter(test);
      let shown = 0;
      graph.forEachNode((_, a) => { if (test(a)) shown += 1; });
      stats.textContent = `${plural(shown, "note")} of ${graph.order.toLocaleString()} · ${plural(graph.size, "link")} · ${plural(counts.size, "group")}`;
    }
    [concepts, orphans].forEach((el) => el.addEventListener("change", apply));

    // Layout: the constellation the site computed, or ForceAtlas2 relaxing it in a worker.
    let worker = null, settle = 0;
    function glide(targets) {
      const start = new Map();
      graph.forEachNode((key, a) => start.set(key, [a.x, a.y]));
      const began = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - began) / 700), e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
        graph.updateEachNodeAttributes((key, a) => {
          const [x0, y0] = start.get(key), [x1, y1] = targets.get(key);
          return { ...a, x: x0 + (x1 - x0) * e, y: y0 + (y1 - y0) * e };
        }, { attributes: ["x", "y"] });
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
    function recentre() {
      // After a relaxation the circles no longer hold: put each repository's name on its notes' centre.
      const sums = new Map();
      graph.forEachNode((_, a) => {
        const p = v.nodes[a.i].p, s = sums.get(p) || { x: 0, y: 0, n: 0, pts: [] };
        s.x += a.x; s.y += a.y; s.n += 1; s.pts.push([a.x, a.y]); sums.set(p, s);
      });
      clusters = [...sums].filter(([, s]) => s.n >= 3).map(([p, s]) => {
        const x = s.x / s.n, y = s.y / s.n;
        const reach = s.pts.map(([px, py]) => Math.hypot(px - x, py - y)).sort((a, b) => a - b);
        const c = v.clusters.find((k) => k.p === p) || { t: p };
        return { p, t: c.t, n: s.n, x, y, r: reach[Math.floor(reach.length * 0.8)] || 10 };
      });
    }
    function layout(mode) {
      panel.querySelectorAll("[data-layout]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.layout === mode)));
      clearTimeout(settle);
      if (worker) { worker.kill(); worker = null; }
      r.reset();
      if (mode === "home") {
        clusters = v.clusters.filter((c) => c.n >= 3);
        glide(home);
        return;
      }
      const settings = { ...B.forceAtlas2.inferSettings(graph), barnesHutOptimize: true, gravity: 0.4, scalingRatio: 6, slowDown: 6 };
      worker = new B.FA2Layout(graph, { settings });
      worker.start();
      settle = setTimeout(() => { if (worker) { worker.stop(); recentre(); sigma.refresh(); } }, 2600);
    }
    panel.querySelectorAll("[data-layout]").forEach((b) => b.addEventListener("click", () => layout(b.dataset.layout)));

    // Selection: a card with the note's summary, its neighbours and a path finder.
    let pathFrom = null;
    function select(key, fly) {
      if (key === null) {
        r.clear(); card.hidden = true; pathFrom = null;
        if (own) history.replaceState(null, "", location.pathname + location.search);
        return;
      }
      const n = v.nodes[graph.getNodeAttribute(key, "i")];
      if (pathFrom && pathFrom !== key) {
        const route = B.bidirectional(graph, pathFrom, key);
        if (route) {
          r.showPath(route);
          card.hidden = false;
          card.innerHTML = `<button type="button" class="brain-card-close" aria-label="Close">×</button><h3>Path: ${plural(route.length - 1, "step")}</h3><ol class="brain-route"></ol>`;
          const list = card.querySelector(".brain-route");
          route.forEach((step) => {
            const m = v.nodes[graph.getNodeAttribute(step, "i")];
            const li = document.createElement("li");
            li.innerHTML = `<span class="brain-swatch" style="background:${graph.getNodeAttribute(step, "color")}"></span><a href="${escapeHtml(siteUrl(m.u))}"></a><span class="brain-origin"></span>`;
            li.querySelector("a").textContent = m.t;
            li.querySelector(".brain-origin").textContent = m.p;
            list.appendChild(li);
          });
          card.querySelector(".brain-card-close").addEventListener("click", () => select(null));
          r.fit(route);
        } else {
          card.querySelector(".brain-card-hint").textContent = `No path links ${v.nodes[graph.getNodeAttribute(pathFrom, "i")].t} to ${n.t}.`;
        }
        pathFrom = null;
        return;
      }
      r.select(key);
      if (own) history.replaceState(null, "", `#${encodeURIComponent(n.f)}`);
      const near = graph.neighbors(key).map((k) => v.nodes[graph.getNodeAttribute(k, "i")]).sort((a, b) => (b.d || 0) - (a.d || 0));
      card.hidden = false;
      card.innerHTML = `<button type="button" class="brain-card-close" aria-label="Close">×</button>
        <div class="brain-card-where"><span class="brain-swatch" style="background:${graph.getNodeAttribute(key, "color")}"></span><span></span></div>
        <h3></h3><p class="brain-card-summary"></p>
        <p class="brain-card-meta">${plural(n.w || 0, "word")} · ${plural(n.d || 0, "link")}</p>
        <div class="brain-card-actions"><a class="md-button md-button--primary" href="${escapeHtml(siteUrl(n.u))}">Open note</a><button type="button" class="md-button" data-path>Path to…</button></div>
        <p class="brain-card-hint"></p>
        ${near.length ? `<details open><summary>Linked notes (${near.length})</summary><ul class="brain-near"></ul></details>` : ""}`;
      card.querySelector(".brain-card-where span:last-child").textContent = `${n.p || "vault"} · ${n.k}`;
      card.querySelector("h3").textContent = n.t;
      card.querySelector(".brain-card-summary").textContent = n.s || "";
      const list = card.querySelector(".brain-near");
      near.slice(0, 14).forEach((m) => {
        const li = document.createElement("li");
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = m.t;
        b.addEventListener("click", () => select(String(v.byPath.get(m.f)), true));
        li.appendChild(b);
        list.appendChild(li);
      });
      if (near.length > 14) list.insertAdjacentHTML("beforeend", `<li class="brain-more">and ${near.length - 14} more</li>`);
      card.querySelector(".brain-card-close").addEventListener("click", () => select(null));
      card.querySelector("[data-path]").addEventListener("click", () => {
        pathFrom = key;
        card.querySelector(".brain-card-hint").textContent = "Now select or find the note to reach.";
        find.focus();
      });
      if (fly) r.fly(key);
    }
    sigma.on("clickNode", ({ node }) => (node === r.look.selected && !pathFrom ? open(v.nodes[graph.getNodeAttribute(node, "i")].u) : select(node)));
    sigma.on("doubleClickNode", (e) => { e.event.preventSigmaDefault(); open(v.nodes[graph.getNodeAttribute(e.node, "i")].u); });
    sigma.on("clickStage", () => { if (!pathFrom) select(null); });

    // Find: suggestions as you type; choosing one flies to it.
    const find = panel.querySelector(".brain-find input");
    const suggest = panel.querySelector(".brain-suggest");
    let rows = [], cursor = 0;
    function paintSuggest() {
      suggest.replaceChildren(...rows.map((i, k) => {
        const li = document.createElement("li");
        li.setAttribute("role", "option");
        li.innerHTML = `<span class="brain-swatch" style="background:${colourOf(v, v.nodes[i])}"></span><span></span><small></small>`;
        li.children[1].textContent = v.nodes[i].t;
        li.children[2].textContent = v.nodes[i].p;
        if (k === cursor) li.className = "is-active";
        li.addEventListener("mousedown", (e) => { e.preventDefault(); choose(i); });
        return li;
      }));
    }
    function choose(i) {
      rows = []; paintSuggest(); find.value = ""; find.blur();
      const key = String(i);
      const n = v.nodes[i];
      // A note the filters hide is shown before flying to it.
      if (hidden.has(n.p) || (!orphans.checked && !(n.d > 0)) || (!concepts.checked && n.k === "concept")) {
        hidden.delete(n.p);
        if (boxes.has(n.p)) boxes.get(n.p).checked = true;
        if (!(n.d > 0)) orphans.checked = true;
        if (n.k === "concept") concepts.checked = true;
        apply();
      }
      select(key, true);
    }
    find.addEventListener("input", () => {
      const term = find.value.trim().toLowerCase();
      rows = !term ? [] : v.nodes.map((n, i) => [score(term, n.t), i]).filter((x) => x[0] >= 0)
        .sort((a, b) => b[0] - a[0]).slice(0, 8).map((x) => x[1]);
      cursor = 0;
      paintSuggest();
    });
    find.addEventListener("keydown", (e) => {
      e.stopPropagation();
      if (e.key === "ArrowDown") { e.preventDefault(); cursor = Math.min(cursor + 1, rows.length - 1); paintSuggest(); }
      if (e.key === "ArrowUp") { e.preventDefault(); cursor = Math.max(cursor - 1, 0); paintSuggest(); }
      if (e.key === "Enter" && rows[cursor] !== undefined) { e.preventDefault(); choose(rows[cursor]); }
      if (e.key === "Escape") { rows = []; paintSuggest(); find.blur(); }
    });
    find.addEventListener("blur", () => setTimeout(() => { rows = []; paintSuggest(); }, 150));
    const keys = (e) => {
      if (e.key === "/" && document.activeElement !== find && !e.target.closest("input, textarea")) { e.preventDefault(); find.focus(); }
      if (e.key === "Escape" && document.activeElement !== find) select(null);
    };
    // On its own page the graph answers anywhere; in a workspace pane, only while it has the focus.
    const listener = own ? document : host;
    listener.addEventListener("keydown", keys);

    apply();
    let deepTimer = 0;
    if (own) {
      const deep = decodeURIComponent(location.hash.slice(1));
      if (deep && v.byPath.has(deep)) deepTimer = setTimeout(() => choose(v.byPath.get(deep)), 300);
    }
    return {
      destroy() {
        clearTimeout(settle); clearTimeout(deepTimer);
        if (worker) worker.kill();
        listener.removeEventListener("keydown", keys);
        r.destroy();
      },
    };
  }

  /* ---- local graph: a note at the centre, its links in rings ----------------- */
  // Rings: the note, then its links, then theirs, each ring sorted by repository so colours band together.
  function ringLayout(v, centre, depth, cap) {
    const rings = [[centre]];
    const seen = new Set([centre]);
    for (let d = 1; d <= depth; d += 1) {
      const next = [];
      rings[d - 1].forEach((i) => v.neighbours[i].forEach((j) => { if (!seen.has(j) && seen.size < cap) { seen.add(j); next.push(j); } }));
      if (!next.length) break;
      next.sort((a, b) => (v.nodes[a].p + v.nodes[a].t).localeCompare(v.nodes[b].p + v.nodes[b].t));
      rings.push(next);
    }
    const where = new Map([[centre, [0, 0]]]);
    rings.slice(1).forEach((ring, d) => ring.forEach((i, k) => {
      const angle = (2 * Math.PI * k) / ring.length + d * 0.35;
      where.set(i, [Math.cos(angle) * (d + 1) * 10, Math.sin(angle) * (d + 1) * 10]);
    }));
    return where;
  }
  // Draws note `centre`'s rings into `host` and resolves to a handle, or to null
  // where WebGL 2 is missing. The page's side panel and the workspace both use it.
  async function localGraph(host, centre, depth = 1, options = {}) {
    if (!hasWebGL2()) return null;
    const [B, v] = await Promise.all([engine(), vault()]);
    const where = ringLayout(v, centre, depth, options.cap || 90);
    // Small dots in a small panel: the more rings, the smaller.
    const scale = depth > 1 ? 0.35 : 0.55;
    const graph = buildGraph(B, v, [...where.keys()], (i) => where.get(i), scale);
    graph.setNodeAttribute(String(centre), "size", Math.max(7, sizeOf(v.nodes[centre]) * scale + 3));
    const r = renderer(B, graph, host, { labelAt: 6, labelDensity: 0.5, pinned: String(centre), screenSizes: true });
    r.sigma.on("clickNode", ({ node, event }) => { if (+node !== centre) open(v.nodes[+node].u, false, event && event.original); });
    r.redraw();
    return { destroy() { r.destroy(); } };
  }
  async function mountLocalGraph() {
    const panel = document.querySelector(".brain-panel[data-brain-path]");
    const sidebar = document.querySelector(".md-sidebar--secondary .md-sidebar__inner");
    if (!panel || !hasWebGL2()) return;
    const page = generation;
    const [v] = await Promise.all([vault(), engine()]);
    // The reader may have moved on while the vault was loading.
    if (page !== generation || !panel.isConnected) return;
    const centre = v.byPath.get(panel.dataset.brainPath);
    if (centre === undefined || !v.neighbours[centre].size) return;
    const title = document.createElement("div");
    title.className = "brain-local-title";
    title.innerHTML = 'Local graph <span class="brain-depth" role="group" aria-label="Depth"><button type="button" aria-pressed="true" data-depth="1">1</button><button type="button" aria-pressed="false" data-depth="2">2</button></span>';
    const host = document.createElement("div");
    host.className = "brain-local";
    const visible = sidebar && sidebar.offsetParent !== null;
    if (visible) { sidebar.append(title, host); } else { panel.prepend(title, host); }
    let drawn = null, asked = 0;
    function draw(depth) {
      asked += 1;
      const mine = asked;
      if (drawn) { drawn.destroy(); drawn = null; }
      title.querySelectorAll("[data-depth]").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.depth === depth)));
      localGraph(host, centre, depth).then((handle) => {
        if (!handle) return;
        if (mine === asked) { drawn = handle; } else { handle.destroy(); }
      }).catch((error) => console.error("brain: the local graph failed to draw", error));
    }
    title.querySelectorAll("[data-depth]").forEach((b) => b.addEventListener("click", () => draw(+b.dataset.depth)));
    active.push({ destroy() { asked += 1; if (drawn) drawn.destroy(); title.remove(); host.remove(); } });
    draw(1);
  }

  /* ---- atlas: the server drew it; hovering a wedge names it in the middle ---- */
  function mountAtlas(host) {
    const svg = host.querySelector("svg.atlas");
    if (!svg) return;
    const main = svg.querySelector(".atlas-centre"), sub = svg.querySelector(".atlas-sub");
    const rest = [main.textContent, sub.textContent];
    const show = (arc) => {
      const [path, pages] = arc.dataset.label.split(" · ");
      const parts = path.split(" › ");
      main.textContent = parts[parts.length - 1].slice(0, 26);
      sub.textContent = `${parts.length > 1 ? parts[0] + " · " : ""}${pages}`;
      svg.classList.add("is-focused");
      arc.classList.add("is-active");
    };
    const reset = (arc) => { [main.textContent, sub.textContent] = rest; svg.classList.remove("is-focused"); arc.classList.remove("is-active"); };
    svg.querySelectorAll(".atlas-arc").forEach((arc) => {
      const target = arc.closest("a") || arc;
      target.addEventListener("mouseenter", () => show(arc));
      target.addEventListener("mouseleave", () => reset(arc));
      target.addEventListener("focus", () => show(arc));
      target.addEventListener("blur", () => reset(arc));
    });
  }

  /* ---- hover preview ------------------------------------------------------ */
  let preview = null, previewTimer = 0;
  function hidePreview() { clearTimeout(previewTimer); if (preview) { preview.remove(); preview = null; } }
  // The index of the note a site URL points at, or -1. The graph keeps the
  // URLs MkDocs wrote, which are percent-encoded and call the home page "./".
  function indexForUrl(v, href) {
    let url;
    try { url = new URL(href, location.href); } catch (error) { return -1; }
    const base = new URL(scope()).pathname;
    if (url.origin !== location.origin || !url.pathname.startsWith(base)) return -1;
    const path = url.pathname.slice(base.length);
    let decoded = path;
    try { decoded = decodeURI(path); } catch (error) { decoded = path; }
    for (const key of [path, decoded, encodeURI(decoded), path || "./"]) {
      const i = v.byUrl.get(key);
      if (i !== undefined) return i;
    }
    return -1;
  }
  function nodeForLink(v, anchor) {
    const i = indexForUrl(v, anchor.href);
    return i < 0 ? null : v.nodes[i];
  }
  const PREVIEWED = ".md-content a[href], .brain-ws [data-brain-preview] a[href]";
  function bindPreviews() {
    document.addEventListener("mouseover", (event) => {
      const anchor = event.target.closest && event.target.closest(PREVIEWED);
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
      if (event.target.closest && event.target.closest(PREVIEWED)) hidePreview();
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
  // One modal list for the quick switcher and the workspace's command palette.
  // `rows(term)` returns the items to show; `show(item)` its [text, hint].
  function pick(options) {
    if (document.querySelector(".brain-switcher")) return;
    const before = document.activeElement;
    const shell = document.createElement("div");
    shell.className = "brain-switcher";
    const box = document.createElement("div");
    box.className = "brain-switcher-box";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", options.label);
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = options.placeholder;
    input.setAttribute("aria-label", options.placeholder);
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-expanded", "true");
    input.setAttribute("aria-controls", "brain-switcher-list");
    input.setAttribute("autocomplete", "off");
    const list = document.createElement("ul");
    list.id = "brain-switcher-list";
    list.setAttribute("role", "listbox");
    box.append(input, list);
    shell.appendChild(box);
    document.body.appendChild(shell);
    let rows = [], cursor = 0;
    const close = () => {
      shell.remove();
      if (before && before.isConnected && before.focus) before.focus();
    };
    const choose = (item, event) => { close(); options.choose(item, event); };
    function paint() {
      list.replaceChildren(...rows.map((item, i) => {
        const [text, hint] = options.show(item);
        const li = document.createElement("li");
        li.id = `brain-switcher-row-${i}`;
        li.setAttribute("role", "option");
        li.setAttribute("aria-selected", String(i === cursor));
        li.textContent = text;
        if (hint) {
          const where = document.createElement("span");
          where.textContent = hint;
          li.append(where);
        }
        if (i === cursor) li.className = "is-active";
        li.addEventListener("click", (event) => choose(item, event));
        return li;
      }));
      const current = list.children[cursor];
      if (current) {
        current.scrollIntoView({ block: "nearest" });
        input.setAttribute("aria-activedescendant", current.id);
      } else { input.removeAttribute("aria-activedescendant"); }
    }
    function update() {
      rows = options.rows(input.value.trim().toLowerCase());
      cursor = 0;
      paint();
    }
    input.addEventListener("input", update);
    input.addEventListener("keydown", (e) => {
      e.stopPropagation();
      if (e.key === "Escape") close();
      if (e.key === "ArrowDown") { e.preventDefault(); cursor = Math.min(cursor + 1, rows.length - 1); paint(); }
      if (e.key === "ArrowUp") { e.preventDefault(); cursor = Math.max(cursor - 1, 0); paint(); }
      if (e.key === "Enter" && rows[cursor]) choose(rows[cursor], e);
    });
    shell.addEventListener("click", (e) => { if (e.target === shell) close(); });
    update();
    input.focus();
  }
  // Best matches of `term` among `items`, by the text `read` gives each.
  function rank(term, items, read, limit) {
    return items.map((item) => [score(term, read(item)), item]).filter((r) => r[0] >= 0)
      .sort((a, b) => b[0] - a[0]).slice(0, limit).map((r) => r[1]);
  }
  async function openSwitcher() {
    const v = await vault();
    pick({
      label: "Quick switcher",
      placeholder: "Find a note",
      rows: (term) => (!term ? v.nodes.filter((n) => n.k === "project" || n.k === "map").slice(0, 20)
        : rank(term, v.nodes, (n) => n.t, 20)),
      show: (n) => [n.t, n.p],
      choose: (n, event) => open(n.u, false, event),
    });
  }

  function addHeaderButtons() {
    const search = document.querySelector(".md-header__inner .md-search");
    if (!search || document.querySelector(".brain-button")) return;
    const icons = {
      graph: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17 3a3 3 0 0 0-2.8 4l-3.6 3.2a3 3 0 0 0-3.9.6L5 9.9A3 3 0 1 0 4 12l2.4 1a3 3 0 0 0 .7 2.4l-1.8 2.8a3 3 0 1 0 1.7 1l1.8-2.8a3 3 0 0 0 3.5-1.6l3.8.9A3 3 0 1 0 16.4 14l-3.8-.9a3 3 0 0 0-.7-1.5l3.6-3.2A3 3 0 1 0 17 3z"/></svg>',
      find: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 5h16v2H4V5zm0 6h10v2H4v-2zm0 6h16v2H4v-2zm14-7 3 2-3 2v-4z"/></svg>',
      workspace: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 4h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm1 2v12h4V6H4zm6 0v12h6V6h-6zm8 0v12h2V6h-2z"/></svg>',
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
    search.before(make("Workspace", icons.workspace, () => open("brain/workspace/")),
      make("Quick switcher (Ctrl+O)", icons.find, openSwitcher),
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
    return { destroy() { observer.disconnect(); canvas.remove(); } };
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
    return { destroy() { host.replaceChildren(); } };
  }

  /* ---- mounting ----------------------------------------------------------- */
  api.views.graph = mountGlobalGraph;
  api.views.atlas = mountAtlas;
  api.views.canvas = mountCanvas;
  api.views.table = mountTable;
  // The site draws these at build time: their host keeps what it holds.
  const DRAWN = new Set(["atlas"]);

  function mountHost(host) {
    const mount = api.views[host.dataset.brainView];
    if (!mount || host.dataset.brainMounted) return;
    host.dataset.brainMounted = "1";
    if (!DRAWN.has(host.dataset.brainView)) host.replaceChildren();
    const page = generation;
    Promise.resolve().then(() => mount(host)).then((handle) => {
      if (!handle) return;
      if (page === generation) { active.push(handle); } else { handle.destroy(); }
    }).catch((error) => {
      console.error(`brain: the ${host.dataset.brainView} view failed to load`, error);
      host.textContent = "This view could not be loaded. Reload the page to try again.";
    });
  }
  // A script loaded after this one (workspace.js) adds its view here; a host
  // already on the page is mounted straight away.
  api.register = function (name, mount) {
    api.views[name] = mount;
    document.querySelectorAll("[data-brain-view]").forEach((host) => {
      if (host.dataset.brainView === name) mountHost(host);
    });
  };

  function mountPage() {
    generation += 1;
    active.forEach((item) => item.destroy());
    active = [];
    hidePreview();
    addHeaderButtons();
    document.querySelectorAll("[data-brain-view]").forEach((host) => {
      delete host.dataset.brainMounted;
      mountHost(host);
    });
    mountLocalGraph();
  }

  Object.assign(api, {
    vault, siteUrl, cssVar, colourOf, score, rank, pick, open, openSwitcher,
    localGraph, indexForUrl, hidePreview,
  });
  window.BrainVault = api;

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "o") { e.preventDefault(); openSwitcher(); }
  });
  bindPreviews();
  if (typeof document$ !== "undefined") { document$.subscribe(mountPage); } else { document.addEventListener("DOMContentLoaded", mountPage); }
})();
