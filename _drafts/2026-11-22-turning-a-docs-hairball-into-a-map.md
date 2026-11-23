---
title: "Turning a Docs Hairball Into a Map You Can Navigate"
description: "Rebuilding a 4,400-note knowledge graph: a GitHub survey, a build-time layout, a WebGL explorer, a clickable SVG atlas, and the bugs only screenshots caught."
date: 2026-11-22T17:00:00.000Z
lastmod: 2026-11-22T17:00:00.000Z
author: bamr87
categories:
  - Posts
  - Web Development
  - Tools & Environment
tags:
  - data-visualization
  - webgl
  - javascript
  - python
  - mkdocs
  - ai-agents
  - documentation
excerpt: "The graph view technically worked: four thousand dots and eleven thousand lines, settling into a different hairball on every visit. Making it useful took a layout, not a faster renderer."
keywords:
  - knowledge graph visualization
  - sigma.js
  - graphology
  - force directed layout
  - sunburst chart
  - mkdocs material
  - claude code
draft: true
---

## The request

The documentation site for my fleet of repositories already had a graph view: every note as a dot, every link as a line, in the style of Obsidian. It technically worked. In practice it was 4,360 dots and 11,527 lines settling into a slightly different hairball on every visit, with a text filter and some force sliders. You could admire it, but you couldn't use it to get anywhere.

The request was to revamp it with more advanced visuals, illustrations, and better navigation of the graph, and to search GitHub for examples worth borrowing from.

## Step 1: survey before you choose

Claude Code used the GitHub search API to pull stars, licences and last-push dates for graph renderers and for tools that picture documentation or repositories. A few results changed the plan:

- **sigma.js** (MIT, about 12k stars) draws graphs of thousands of nodes with WebGL, on top of **graphology**, which brings ForceAtlas2 in a web worker and shortest paths.
- **Quartz** (MIT, about 13.6k stars), the reference Obsidian-style site, has a local graph with a depth setting and a radial mode. Those ideas were worth taking.
- **cosmos** lays out hundreds of thousands of nodes on the GPU, but its own README documents device limits. That's overkill for four thousand nodes.
- **Gephi Lite** and **Juggl** have good ideas (layout switching, styled local graphs), but they're GPL. In an MIT repository, they're inspiration, not code.
- **repo-visualizer**, GitHub's experiment that drew a repository as SVG in CI, was archived in August. Its core idea, a picture computed at build time as plain SVG, turned out to be the best thing on the list.

A survey with licences in one table settles arguments before they start. It also tells you which projects are alive.

## Step 2: the problem was layout, not rendering

Swapping the renderer alone would have produced a faster hairball. The real problem was that the graph had no organization: the force simulation started from random positions in the browser, on every visit.

So the layout moved to build time, in about forty lines of Python:

- Each repository becomes a circle, packed around the generated concept notes that bridge repositories.
- Each folder of a repository becomes a smaller circle inside it.
- Each folder's notes sit on a sunflower spiral, with the most-linked notes at the centre.

```python
GOLDEN_ANGLE = math.pi * (3 - math.sqrt(5))

def spiral(count, gap=10.0):
    """A sunflower (Vogel) spiral: even spacing, the first points at the centre."""
    return [(gap * math.sqrt(i + 0.5) * math.cos(i * GOLDEN_ANGLE),
             gap * math.sqrt(i + 0.5) * math.sin(i * GOLDEN_ANGLE)) for i in range(count)]
```

Circle packing is a greedy loop: place the biggest circle at the origin, then put each next one at the free spot nearest the origin. The whole layout takes 0.08 seconds, gives the same picture every time, and puts each repository's name above its own circle. The link-driven version still exists, as a "By connection" button that runs ForceAtlas2 in a worker, starting from that organized layout.

Because the layout is a pure function, it's easy to test: circles never overlap, notes stay inside their repository, two runs give identical output.

## Step 3: read the types of a major version you don't know

npm said sigma's current version is 4.0.6. The version I knew best was 3. Rather than writing from memory, Claude Code read the package's TypeScript declarations before writing a line. That paid off three times:

- Reducers (`nodeReducer`, `edgeReducer`) still exist, next to a new styles-and-states system.
- `preventSigmaDefault()` moved onto `payload.event`.
- The default `itemSizesReference` is now `"positions"`, so node sizes are measured in graph units, not pixels.

The last one didn't show up in the main graph, which spans about 3,000 units. It showed up in the sidebar's local graph, whose rings span 20 units, as one gigantic node covering the whole panel. One setting fixed it, but only a screenshot revealed it.

## Step 4: lines as texture, not mesh

Eleven thousand lines in one neutral colour read as a black knot around the concept hub. Two small changes made the picture legible:

- Each link takes its repository's colour at about 12% opacity.
- Links into the concept hub drop to about 4% opacity.

From afar, the repositories now read as coloured constellations. Hovering a note brings its links back at full strength and dims everything else.

The explorer around that picture is ordinary interaction design:

- Find-and-fly search, opened with the `/` key.
- A card with the selected note's summary and its linked notes.
- Double-click to open the note.
- Filters for concepts, orphan notes and whole repositories.
- A shortest-path finder between two notes.
- A deep link to the selected note.

A small detail mattered: the camera flies a selected note to the left of centre, so the card doesn't cover its label.

## Step 5: an illustration that is also navigation

The "illustration" became an Atlas: a sunburst of every repository's documentation, drawn as SVG by the site build. Repositories sit in the inner ring and their sections around them, each wedge sized by page count and linked to its section. Each project note gets a smaller emblem of its own sections. It needs no JavaScript at all; a few lines of script only name the hovered wedge in the middle.

It also surfaced a bug in someone else's code. MkDocs Material's instant navigation rewrites every element matching `[href]` by assigning `el.href = el.href`. On an SVG link, `href` is a read-only object, so the assignment throws. Writing the links as `xlink:href` keeps them out of that selector. Material's click handler has the same blind spot: it builds a URL from `link.href`, which on an SVG link is an object, so a click threw and the browser reloaded the whole page. A few lines of script now follow those clicks before Material sees them.

## Step 6: don't ship weight to pages that don't need it

The WebGL engine is 464 KB minified (121 KB gzipped), against 17 KB for the d3-force bundle it replaced. So the engine loads on demand, only when a page mounts a graph. That is more pages than I first assumed: every note with a link shows its local graph, which is about six pages in ten. A reader fetches the engine once and the browser caches it, and a small vendor note records exactly how to rebuild the bundle and where its licences live.

## Working with AI: tips from this session

- **Ask for the survey with licences and dates.** "Popular" isn't a selection criterion; "MIT, active, and built for this size" is.
- **Make the agent look at its own work.** Headless Chromium with SwiftShader runs WebGL, so Claude Code took screenshots after every change and read them. The oversized local graph, the hidden label under the card and the crashing SVG links were all visible only that way.
- **Have it read the types, not its memory.** A major version bump changes defaults quietly. Declarations are the fastest source of truth.
- **Push work to build time.** A layout or an illustration computed once, deterministically, is cheaper, testable, and identical for every visitor.
- **Keep the decision reviewable.** The change shipped with a proposed decision record that lists what was borrowed, what was rejected and why, and what it costs. A human still decides whether it merges.
