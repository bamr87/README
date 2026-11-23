# Vendored graph engine

> How `assets/graph-engine.bundle.js` is built, what is in it, and how to update it: the WebGL renderer behind the site's graph views.

The site's graph views draw with [sigma.js](https://github.com/jacomyal/sigma.js) on [graphology](https://github.com/graphology/graphology), bundled into one script that sets a single global, `BrainGraph`. `brain.js` loads it only when a page mounts a graph, so pages without one never download it. Everything in it is MIT; the licence texts are in `assets/graph-engine.LICENSES.txt`, published next to the bundle.

| Package | Version | Used for |
| --- | --- | --- |
| `sigma` | 4.0.6 | WebGL rendering, camera, hover and click events |
| `graphology` | 0.26.0 | The graph model |
| `graphology-layout-forceatlas2` | 0.10.1 | The "By connection" layout, run in a web worker |
| `graphology-shortest-path` | 2.1.0 | The path finder |

Their own dependencies (`graphology-utils`, `events`, `mnemonist`, `obliterator`, `@yomguithereal/helpers`) come along, also MIT.

## Rebuild

In an empty directory outside the repository:

```bash
npm init -y
npm install sigma graphology graphology-layout-forceatlas2 graphology-shortest-path esbuild
cat > entry.js <<'EOF'
import Graph from "graphology";
import Sigma from "sigma";
import forceAtlas2 from "graphology-layout-forceatlas2";
import FA2Layout from "graphology-layout-forceatlas2/worker";
import { bidirectional } from "graphology-shortest-path/unweighted";
export { Graph, Sigma, forceAtlas2, FA2Layout, bidirectional };
EOF
npx esbuild entry.js --bundle --minify --format=iife --global-name=BrainGraph \
  --target=es2019 --legal-comments=none --outfile=graph-engine.bundle.js
```

Then copy the output over `assets/graph-engine.bundle.js`, keep the one-line header comment naming the versions, regenerate `assets/graph-engine.LICENSES.txt` from each package's licence file, update the table above, and check the graph pages in a browser (`verify/scenarios/second-brain.yml`). A major version of sigma changes its API: read its declarations before bumping.

Never edit the bundle by hand.
