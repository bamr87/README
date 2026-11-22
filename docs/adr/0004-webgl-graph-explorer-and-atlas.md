# ADR 0004 — The site's graph is a WebGL explorer, and the Atlas draws the navigation

- **Status**: proposed
- **Date**: 2026-11-22
- **Deciders**: the maintainer, by merging; proposed by a Claude Code session
- **Related**: [ADR 0002](0002-docs-as-an-obsidian-vault.md) (the vault and its views), [ADR 0003](0003-readme-as-the-fleet-knowledge-plane.md) (README as the hub's source of content), feature README-017 and README-019, `brain_site/`

## Context

ADR 0002 put Obsidian's views on the published site. The graph drew with d3-force on a 2D canvas and simulated all 4,360 notes and 11,527 links in the browser on every visit, so it settled differently each time, read as one hairball around the concept notes, and offered a text filter, group toggles and force sliders but no way to find a note and go to it, to see what a note links to without leaving the page, or to see how two notes connect. Repositories were coloured by their alphabetical order on the site and by registry order in Obsidian, so a repository could wear two colours. Nothing showed the shape of the documentation: which repositories are large, and how each one is organized.

Before choosing, this session surveyed GitHub (2026-11-22; stars and licence from the GitHub API, last push in parentheses) for renderers and for sites and tools that visualize documentation or repositories:

| Project | Stars | Licence | What it offered here |
| --- | --- | --- | --- |
| [jacomyal/sigma.js](https://github.com/jacomyal/sigma.js) (2026-11-10) | 12,246 | MIT | WebGL renderer for graphs of thousands of nodes, on graphology; reducers for hover and selection, camera animation, label density. **Chosen**, version 4.0.6. |
| [graphology/graphology](https://github.com/graphology/graphology) (2026-11-10) | 1,774 | MIT | The graph model sigma reads, ForceAtlas2 in a web worker, shortest paths. **Chosen.** |
| [jackyzha0/quartz](https://github.com/jackyzha0/quartz) (2026-11-22) | 13,618 | MIT | The reference Obsidian-style site. Its graph (now the `@quartz-community/graph` plugin) has a local graph with a depth, focus on hover and a radial mode. **Borrowed**: the depth control and the radial local graph. |
| [cosmosgl/graph](https://github.com/cosmosgl/graph) (2026-11-21) | 1,309 | MIT | GPU force layout for hundreds of thousands of points. Rejected: this graph has thousands, and cosmos needs WebGL 2 float-texture extensions it documents as missing on some iOS and Android devices. |
| [vasturiano/force-graph](https://github.com/vasturiano/force-graph), [3d-force-graph](https://github.com/vasturiano/3d-force-graph) | 2,173, 6,589 | MIT | Canvas and Three.js force graphs. Rejected: the canvas one is what the site had; 3D is striking but harder to read and navigate. |
| [cytoscape/cytoscape.js](https://github.com/cytoscape/cytoscape.js), [antvis/G6](https://github.com/antvis/G6) | 11,300, 12,399 | MIT | Full graph-analysis frameworks. Rejected: much larger than the views need. |
| [reaviz/reagraph](https://github.com/reaviz/reagraph) | 1,100 | Apache-2.0 | WebGL graphs for React. Rejected here (the site is not React); worth a look for the hub console's knowledge panel. |
| [gephi/gephi-lite](https://github.com/gephi/gephi-lite), [HEmile/juggl](https://github.com/HEmile/juggl) | 360, 826 | GPL-3.0 | Layout switching, filters, a styled local graph. **Borrowed as ideas only**; GPL code is not copied into an MIT repository. |
| [githubocto/repo-visualizer](https://github.com/githubocto/repo-visualizer) | 1,314 | MIT | An SVG picture of a repository's files, drawn in CI. Archived on 2026-08-06. **Borrowed**: a picture computed at build time, as plain SVG; the Atlas draws the navigation instead of the file tree. |
| [markmap/markmap](https://github.com/markmap/markmap) | 13,283 | MIT | Mind maps from Markdown. Rejected for the Atlas: one more library, and a sunburst also shows size. |
| [ahmedkhaleel2004/gitdiagram](https://github.com/ahmedkhaleel2004/gitdiagram), [AsyncFuncAI/deepwiki-open](https://github.com/AsyncFuncAI/deepwiki-open) | 19,075, 18,472 | MIT | AI-generated architecture diagrams (Mermaid, components linked to files) and AI-written repository wikis. Not adopted: their pictures are model output, not deterministic. Kept as the model for a later, reviewed architecture diagram per repository, possibly with archify, which gitorio already vendors. |

## Decision

The site's graph views draw with sigma 4 on graphology, bundled into one script (`brain_site/assets/graph-engine.bundle.js`, built as `brain_site/VENDOR.md` describes) that `brain.js` loads only on a page that draws a graph.

- **The graph opens on a layout computed at build time** (`brain_site/views.py`, `constellation`): each repository is a circle, packed around the generated concept notes; each folder of a repository is a circle inside it; each folder's notes sit on a sunflower spiral, the most linked at the centre. It is deterministic, takes under a tenth of a second, and puts every repository's name on its circle. "By connection" relaxes it with ForceAtlas2 in a web worker, and "By repository" glides back.
- **The global graph is an explorer**: hover lights a note's links and dims the rest; a click opens a card with the note's summary and its linked notes, and a double-click opens the note; find-and-fly (`/`) searches every title; filters hide concepts, notes with no links, or repositories (Alt-click shows one); a path finder shows the shortest chain of links between two notes; the selected note is a `#path` deep link; links take their repository's colour at low opacity, links to the concept hub fainter still.
- **The local graph** puts the current note at the centre and its links in a ring, with a second ring on demand.
- **The Atlas** (`/brain/atlas/`) draws every corpus's navigation as a sunburst at build time: repositories inside, their sections and sub-sections outside, each wedge sized by pages and linked to its section. Each project note carries a smaller emblem of its own sections. It is plain SVG, so it works without JavaScript; `brain.js` only names the hovered wedge in the middle.
- **One palette**: repository colours come from the engine's palette in registry order, the order Obsidian's colour groups already use, and travel to the browser in `graph.json`.

The d3-force bundle is removed.

## Consequences

**Positive**

- The graph opens in the same arrangement every time, readable from afar, and every interaction stays on the page.
- A reader can go from a question to a note (find), from a note to its neighbourhood (hover, card, local graph), and from one note to another (path).
- The Atlas and the emblems show the size and the organization of the documentation at a glance, and every wedge is a link into it.
- Pages without a graph download nothing new.

**Negative**

- The graph needs WebGL 2. A browser without it gets a note linking to the Atlas and the table instead of a graph.
- The engine is about 464 KB minified (121 KB gzipped) against 17 KB for d3-force, loaded on graph pages only, and a vendored bundle is ours to rebuild when sigma moves. sigma 4 also changed defaults from 3 (sizes are measured in graph units unless a view says otherwise), so a major bump means reading its declarations first.
- The graph payload grows by each note's position and link count (about 1.7 MB uncompressed for 4,360 notes).
- Material's instant navigation rewrites every `[href]` by assigning `el.href`, which throws on an SVG link, so the Atlas links with `xlink:href`; a future theme change could need the same care.

## Alternatives considered

- **Keep d3-force and add the interactions** — the layout would still settle differently on each visit and the canvas would still redraw every link on every frame.
- **cosmos (GPU layout)** — built for far larger graphs, with device limits documented by its authors.
- **A 3D graph** — more spectacular, worse for finding and reading.
- **A JavaScript-drawn Atlas (d3-hierarchy or markmap)** — one more library and no picture without JavaScript; the server already knows the whole tree.
- **AI-generated architecture diagrams per repository** — useful, but they would be the first unverified prose in the site's pictures; left for a later decision with a review step.

## Supersedes / Superseded by

- Supersedes: none; replaces ADR 0002's d3-force renderer, which ADR 0002 listed as a negative consequence
- Superseded by: none
