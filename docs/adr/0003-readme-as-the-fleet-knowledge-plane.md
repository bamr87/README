# ADR 0003 — README is the fleet's knowledge plane, and the hub console reads it

- **Status**: proposed
- **Date**: 2026-11-21
- **Deciders**: the maintainer, by merging; proposed by a Claude Code research session
- **Related**: [#47](https://github.com/bamr87/README/issues/47) (hybrid retrieval, wider coverage, a retrieval eval), [#46](https://github.com/bamr87/README/issues/46) (the FTS5 store; its read side), [PLAN.md](../../PLAN.md) § 5 and Phase 4.1 (MCP v2, `llms.txt`, context packs), [ADR 0002](0002-docs-as-an-obsidian-vault.md), and in the hub: `docs/DOCS-SYSTEM.md` (an index, not copies), `docs/MCP-SERVERS.md`, `tools/console/mcp_layer/`

## Context

The hub's Harness Console (its pages, its `fleet` MCP server, the Assist agent behind its dock, and remote agents on its tunnel) needs quick, complete, organized and accurate answers about every repository in the fleet. README already builds most of what that takes: a registry-driven crawl, a facts → cards → apex pyramid, navigation trees, a vault graph, secret and injection screens, provenance and untrusted-data fences on every MCP answer, and one read path (`scripts/context_engine/query.py`). This review measured where it falls short of being the console's source of content (README `5086224e`, hub `b243568`, 2026-11-21).

**1. The console does not read README.** It has four knowledge paths, and none goes through README:

| Console path | What it reads | Limit |
| --- | --- | --- |
| `project_readme` (`/api/project/<name>/readme`) | The raw `README.md` of a local submodule checkout | Local only: the public site says "the public page carries no README" |
| `code_search`, `index_coverage` | Kilo's code index in Qdrant, embedded by Ollama on the Mac | Code, not docs; needs the Mac's services |
| `/api/content` (the content atlas) | The declared sites, from the data lake | Sites only |
| `lake_recall` | Past Claude Code sessions | Episodes, not documentation |

The Assist agent runs with `--strict-mcp-config` and exactly one server, `fleet`, so README's MCP server is out of its reach; for "how does this repo work" it greps the hub checkout, where most submodules are not checked out. README's server is not a row in the hub's `_data/mcp_servers.yml` either.

**2. Three project lists that disagree.**

| List | Projects | Used for |
| --- | --- | --- |
| Hub `_data/projects.yml` | 45 | Everything in the hub, the console included |
| README `_data/projects.yml` | 24 (with the hub and one external corpus) | Collect, cards, MCP |
| README `_data/fleet.yml` | 38 | The survey |

24 hub entries have no card, among them README itself, `ragio-ai`, `kvlite`, `bash-365.com` and `archify`. README still carries `barodybroject`, which zer0-CMS absorbed. 7 of the 21 shared descriptions differ, and some are stale: zer0-CMS is still "a fork of Front Matter CMS … a governed VS Code + Rails CMS", though zer0-CMS retired its Rails CMS (its ADR 0008). README names the corpus `zer0-CMS` where the hub's path is `projects/zer0-cms`, so a join on the name fails.

**3. Search reaches the summaries, not the documents.** `context/index/context_index.json` indexes 47 documents (the apex, 22 cards and 24 navigation trees; 1,455 terms). The 4,390 pages of the corpus can be read by exact path (`get_doc`) but not searched. Ranking is summed term frequency with prefix expansion: no inverse document frequency, no length normalization. "release-please" (in 132 corpus pages) and "kill switch" (159 pages) return "no matches in the context layer"; "token rotation oauth" ranks bashos and githubai first and never reaches the hub's `docs/TOKEN-ROTATION.md`. Speed is not the problem (under 1 ms a query); reach is.

**4. Facts describe documents, not projects.** Facts carry counts, signals and the navigation tree. They do not carry what an operator or agent asks first: what the repository is for, how to install, test and lint it, when a change is done, its hard rules and its deviations. Every fleet repository keeps exactly those in the standard sections of its `AGENTS.md` (the agent-context kit's What this repo is, Stack & commands, Layout, Conventions, Fleet context, Standard deviations).

**5. Answers do not say which commit they describe relative to the hub.** For 19 of the 20 projects both sides name, the commit README crawled (`context/vault/collect.json`) differs from the one the hub's submodule pointer pins. The two checked were one to two days apart (it-journey: `683ac77` of 11-18 against `142f8b8` of 11-20), but the crawl is weekly (`aggregate-docs.yaml`, Mondays 03:23) while the hub's `update-submodules.yml` moves pointers daily, and nothing in an answer or in `context_status` says how far behind it is.

**6. The corpus is a second copy of everyone's documentation.** `docs/` holds 58 MB of copied pages, with `docs/docs_index.json` (13.8 MB) and `context/vault/graph.json` (2.3 MB), all committed and published. The hub's DOCS-SYSTEM plan wants README to stop republishing pages without a canonical link and become "an index, not copies", while this request makes README the main source of content. Both hold if the corpus is a retrieval store and the published site is an index.

**What a fix looks like, measured.** A prototype indexed the existing corpus by section (split at H1–H3, at most 2,400 characters a chunk) in SQLite FTS5, with BM25, heavier weights on titles and headings, and a document-type prior (agent instructions, READMEs and `docs/` up; changelogs, quests and posts down):

| | Today (`search_context`) | Prototype |
| --- | --- | --- |
| Unit searched | 47 summaries | 41,870 sections of 4,177 pages |
| Build | Part of `build` | 1.9 s; a 61 MB SQLite file with the text stored |
| Query time | Under 1 ms | 1–25 ms |
| Right project first, 25 questions | 16 | 23 |
| Right project in the top 5 | 20 | 23 |
| Returns the section that answers, with a snippet | No | Yes |

The 25 questions were written for this review, one or more per repository, so the set favours distinctive vocabulary and is small: a smoke test, not a benchmark. Both misses on both sides are `ragio-ai` and `kvlite`, which README's registry does not include, so they are coverage, not ranking. Lexical search still has a ceiling: "how do I add a new project to the fleet" lands near `docs/SUBMODULES.md`, not on it, which is the case the optional vector leg below exists for.

Also noted: `docs/docs_index.json` publishes the build machine's absolute path (`docs_root: /Users/…/.claude/worktrees/…/docs`), and the hub's pointer to README is one commit behind README's `main`.

## Decision

README becomes the fleet's **knowledge plane**: the one place the hub, its console and every agent go to learn what a repository is, how it works and where a fact lives. Six changes, each a pull request in the repository that owns it.

### 1. One roster, owned by the hub

The hub's `_data/projects.yml` is the roster, and README stops keeping its own list of what exists. README's `_data/projects.yml` keeps only what is README's to decide, as an overlay keyed by the hub's `name`: the `collect:`, `navigation:` and `brain:` rules, per-project `collect` and `nav` overrides, `kind` and `topics` overrides, and external corpora such as OverTheWire. `engine sync` reads the roster (the parent checkout's file inside the monorepo, otherwise the hub's `main` over HTTPS) and writes the effective registry to `context/registry.json` (generated and committed, so an offline build still works). The survey's `_data/fleet.yml` becomes the same projection. A corpus directory takes the hub's `slug` (`zer0-cms`), so a join on the name always works. A repository the crawl cannot read anonymously gets a metadata-only card from the roster (description, status, stack, live URL) and no corpus, so nothing private enters a published index.

### 2. Pin the crawl to the hub

`collect` reads each project at the commit the hub's submodule pointer records (`git ls-tree` inside the monorepo, the contents API elsewhere), not at the branch head, and re-collects only the projects whose pin moved. The refresh runs after `update-submodules.yml` instead of weekly. Each answer's provenance gains `hub_pin` and `behind` (false when the crawled commit equals the pin), and `context_status` reports each project's lag, so the console can say "README describes `ca47145`; the hub pins `f65211e`" instead of serving older text silently. The freshness target is one day behind the pin at most.

### 3. Search the documents, not only the summaries

`query.py` gains a section-level index: each corpus page split at H1–H3 into chunks of about 600 tokens at most, each with its breadcrumb (project › path › heading), its `doc_type` and its source commit, in SQLite FTS5 with BM25, column weights and a document-type prior. It is a build artifact (`.cache/knowledge.db`, gitignored, rebuilt in about two seconds when the corpus fingerprint changes), never committed. `search` takes `scope` (`cards`, `corpus` or `all`), `project`, `doc_type` and `limit`, and returns snippets with the existing provenance and fences.

An optional vector leg embeds the same chunks with the local model the hub already runs for its code index (Ollama `nomic-embed-text`), stores the vectors beside them, re-embeds only chunks whose hash changed, and merges the two rankings by reciprocal rank fusion. Lexical stays the default, the CI path and the fallback. `tests/evals/retrieval.jsonl` (a question, the expected project and the expected page) with a hit@1 and hit@5 report gates every ranking change, which closes #47. The same store is the read side #46 asks for; its write side (`remember`) is out of scope here.

### 4. Profiles: the facts people ask for, read from canonical files

Facts gain a `profile` built deterministically from files each repository already keeps current: the standard `AGENTS.md` sections (purpose, done-when, commands, layout, conventions, hard rules, deviations), `.github/sdlc.yml`, `features/features.yml`, and the roster's status, stack and URLs. Each field cites its path and commit. Cards render it as Start here, Run it and Rules. A missing section becomes a survey finding, not a gap filled with generated prose. AI enrichment stays optional, and, as PLAN § 2.4 principle 4 already requires, prose whose claims the facts do not support is replaced by the heuristic text.

### 5. One contract, two deliveries

What the console reads is a versioned contract, `readme-knowledge/v1`: an additive change is free and a rename bumps the marker, the rule the hub already applies to `harness_registry`. One reader serves it two ways.

- **Inside the monorepo**, the console imports `query.py` from `projects/README`, so the submodule pointer pins the version. `tools/console/app.py` adds `/api/knowledge/{status,search,project/<name>,doc,pack}`, which degrade to `present: false` when the submodule is not checked out, as the code index does. The `fleet` MCP layer wraps them in four read tools: `knowledge_search(q, project?, scope?, limit?)`, `knowledge_project(name, part?)` (profile, card or navigation), `knowledge_read(path, section?, max_chars?)` and `knowledge_pack(target, budget_tokens?)`, a deterministic, token-budgeted bundle for the fleet or one project (PLAN § 5's context packs). Placing them in `fleet` is what lets the Assist agent (one server, strict configuration) and remote agents (the bearer-authenticated HTTP endpoint and its tunnel) use them. The Assist prompt names them first for questions about what a repository is and how it works, and the project page gains a knowledge panel: profile, freshness and top sections.
- **Published**, for the read-only public console and any client without a checkout: `knowledge/v1/` on README's Pages site, with `manifest.json`, `projects.json` (profiles and cards), `llms.txt`, `llms-full.txt`, `packs/<name>.md` and the lexical index. The hub's `build-dash.yml` fetches it at build time, so the public repository page shows the profile and the README. Everything in it is already public.

README's own MCP server keeps its tools and gains the same four, calling the same `query.py`, for clients outside the hub. The hub registers it in `_data/mcp_servers.yml` as a `spoke`.

### 6. An index, not a mirror

The corpus is the retrieval store, and the published site becomes the index the hub's DOCS-SYSTEM plan asks for. Mirrored pages get `rel=canonical` to their home (the repository file at the pinned commit, or the project's own documentation site) and `noindex` now, and the site's navigation leads with cards, profiles and maps. Whether the raw corpus stays committed or becomes a cache rebuilt from the pins is the first question below; nothing in changes 1–5 depends on the answer.

### Rollout

| Phase | Repository | Change | Exit criterion |
| --- | --- | --- | --- |
| K1 | README | The retrieval eval set, the section index in `query.py`, `scope` on `search_context` | hit@1 and hit@5 reported; "release-please" and "kill switch" return sections |
| K2 | README | Roster from the hub, the overlay, slug names, metadata-only cards | Every active hub project has a card; "ragio" finds `ragio-ai` |
| K3 | README | Profiles from `AGENTS.md`, `sdlc.yml` and `features.yml` | "How do I test djangoerp?" is answered from `profile.commands` with path and commit |
| K4 | hub | `/api/knowledge/*`, the four `knowledge_*` tools, the Assist prompt, the `mcp_servers.yml` row | Assist answers a repository question citing a `knowledge_*` tool, not Grep |
| K5 | README, hub | Pinned and incremental collect, lag in provenance, refresh after `update-submodules.yml` | `context_status` shows every project within a day of its pin |
| K6 | README, hub | The `knowledge/v1/` bundle; the public console reads it; canonical and `noindex` on mirrored pages | The public repository page shows the profile |
| K7 | README | The optional vector leg, measured on the same eval | Hybrid beats lexical on hit@5, or stays off |

K1 to K3 need nothing from the hub and are worth having on their own. K4 is the first change a console user sees.

### Questions for the owner

1. **Commit the raw corpus, or rebuild it from the pins?** Committed, Obsidian opens `docs/` straight from a clone (ADR 0002); rebuilt, about 58 MB of copies and the 13.8 MB page index leave the history going forward. Recommendation: keep it committed until K6 ships, then decide on what the committed copy was actually used for.
2. **Where does visibility live?** The hub's roster has no visibility field. Add one to the hub's `_data/projects.yml` (its registry reconciliation already reads GitHub's metadata), or let README record it at gather time. Recommendation: the hub, which owns the roster.
3. **May the local console index private checkouts** into its machine-local cache, never published, as `project_readme` reads them today? Recommendation: not in v1; the guardrail quoted in #46 and #47 keeps private data out of every index until that is decided on its own.

## Consequences

**Positive**

- One read path serves the console's pages, its `fleet` MCP layer, the Assist agent, remote agents, README's own MCP server and the CLI, so none of them can disagree.
- Every active project is covered, and every answer names the commit it describes and whether the hub has moved past it.
- A question lands on the section that answers it, with a snippet, offline and without a model call.
- The most-asked facts (purpose, commands, done-when, rules) come from each repository's own canonical file, cited, never generated.
- The published site stops competing with the original pages as a citation target.

**Negative**

- The console imports code from a submodule: a change that breaks `query.py` breaks the knowledge panel until the pointer moves back. Contract tests on both sides and the `present: false` degradation contain it.
- README depends on the hub's roster being reachable; a standalone clone needs the network for `sync`, and builds offline from the committed `context/registry.json` otherwise.
- The `fleet` server already lists 68 tools; this adds four composite tools rather than README's twelve one-purpose ones.
- `AGENTS.md` headings become an interface: renaming a standard section in the agent-context kit needs the profile extractor updated in the same change.
- A SQLite index sits beside the JSON term index until the JSON index is retired.

## Alternatives considered

- **Register README's MCP server next to `fleet`** — no code, but the Assist agent is pinned to one server, remote agents reach only the console's HTTP endpoint, and the console's pages would still have no knowledge API.
- **Index the documentation in the hub's Qdrant code index** — Kilo already writes the worktree there, but it needs the Mac's Qdrant and Ollama, mixes code with documentation, skips dot-directories, and is out of reach of CI and the public site. It stays the code index; the vector leg reuses its embedder, not its store.
- **A hosted vector database or search service** — new infrastructure, cost and a credential, for a corpus a 61 MB SQLite file serves in milliseconds.
- **Keep the JSON term index and add pages and IDF to it** — the file would grow toward the size of `docs_index.json` and still lack phrase queries, snippets and column weights, which FTS5 brings with Python's standard library.
- **Let the hub crawl the submodules itself** — a second collect, a second set of screens and a second provenance model, so two answers to every question.
- **Retire README in favour of DOCS-SYSTEM's federated search** — loses the pyramid, the profiles and the survey, and federated search over a dozen sites is still a later phase of that plan.

## Supersedes / Superseded by

- Supersedes: none; extends PLAN § 5 and ADR 0002
- Superseded by: none
