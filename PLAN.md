---
title: "PLAN — README platform v3"
description: Redesign plan turning the README context engine into a documentation intelligence platform with drift checks, gap detection, and a continuous alignment loop
status: proposal
date: 2026-09-14
supersedes: none (PRD.md v2 stays the spec for the pyramid layers it describes)
---

# PLAN — README platform v3

> A plan to rebuild `bamr87/README` into a platform that **gathers, organizes, analyzes, summarizes, and distributes** the fleet's documentation for humans and AI models, and keeps that documentation aligned through **automated drift checks, gap detection, and a continuous-improvement loop**. It is grounded in an audit of the repo as of `main@8673087` (2026-09-14); every number below was measured, and the commands are in Appendix A.

## 0. Summary

The v2 context engine already does the hard part: a registry-driven crawl of seven corpora (3,196 documents, 3.26M words) distilled into a facts → cards → apex pyramid, a derived navigation tree, a query index, and a read-only MCP server, all offline-first and deterministic, with 80 passing unit tests and two drift gates (SCHEMA lint, nav check). That core is worth keeping. This plan is an **evolution, not a rewrite**.

What is missing is everything around the core that turns "a generated README" into "a platform that keeps documentation honest":

- **Provenance.** No document knows which upstream commit it came from, so nothing can say "this is 40 days stale" or link a claim back to its source.
- **Analysis.** The only drift the platform detects is drift of its *own* generated surfaces. It does not detect stale corpora, dead links, missing governance files, undocumented directories, stub pages, or fleet-wide inconsistencies.
- **Gates that the automation itself obeys.** The weekly cron commits straight to `main`, bypassing the very gates it enforces on humans. `main` is drifted today because of it (Section 1.2).
- **Distribution beyond one README.** No `llms.txt`, no token-budgeted context packs, no reports, no change digest, no way for a fleet repo to display its own documentation health.
- **A loop.** Findings are printed to CI logs and forgotten. Nothing turns them into tracked issues, proposals, or trends.

The redesign organizes the platform around five verbs, each a pipeline stage with one command, plus a cross-cutting **Govern** layer that runs the same checks on pull requests and on the scheduled refresh:

| Verb | Stage command | Produces |
|---|---|---|
| Gather | `engine gather` | Source manifests with commit provenance; ephemeral raw tree |
| Organize | `engine organize` | Provenance-stamped corpus, doc types, sharded corpus index |
| Analyze | `engine analyze` | Drift, gap, link, freshness, and health reports; a fleet graph |
| Summarize | `engine summarize` | Facts v2, cards v2, apex, topic syntheses, digest (AI-cached) |
| Distribute | `engine distribute` | MCP v2, `llms.txt`, context packs, badges, feed, findings sync |
| Govern | `engine check --gate` | One exit code for CI; findings as data |

`engine` is shorthand for `python3 -m scripts.context_engine`. The entry point does not change.

The roadmap has six phases (Section 7). Phase 0 is small and urgent: it fixes the live defect on `main` and makes the cron go through the gates. Phases 1–5 add the stages in the order that unlocks the most: provenance first, because every check and every summary downstream depends on it.

## 1. Audit: where the repo stands

### 1.1 What works and stays

| Component | State | Keep? |
|---|---|---|
| Registry (`_data/projects.yml`) as the single source of truth, `repos.txt` generated from it | Solid; validated on load; navigation contract lives there too | Yes, extend it (governance profiles, sync sets, topics) |
| Pyramid: `docs/` (L3) → `context/facts` (L2) → `context/cards` (L1) → `context/README.md` (L0) | Solid; diff-stable via corpus fingerprints; heuristic build needs no key | Yes, facts v2 and cards v2 are additive |
| Navigator (`navigator.py`, 927 lines) rendering `context/nav`, `nav.yml`, `docs/browse` from the folder hierarchy | Best-tested module (22 tests); `navcheck` is a real drift gate | Yes |
| Query layer + MCP server (`query.py`, `mcp/server.py`) — one read path, stdlib-only, read-only | Solid; 7 tools, 7 resource families | Yes, extend to MCP v2 |
| SCHEMA protocol + `schema_lint.py` | Solid; 6 nodes, 0 errors | Yes; it is the model for every other check |
| Hooks (`hooks.d/<stage>/`) | Works; two shipped hooks | Yes |
| AI layer (`ai.py`): Anthropic, xAI, mock behind one interface | Works; no cache, no grounding, no eval | Yes, add cache + verifier + evals |
| Tests: custom harness over unittest, 80 unit tests | Pass in 0.3s; engine well covered | Yes, add pytest config and fixtures for the new stages |
| CI: quality gate on PRs, weekly aggregation, Pages deploy, `@claude` handler, prose unwrapper | Works; see 1.2 for the structural flaw | Yes, restructure (Section 6) |

### 1.2 The live defect: `main` is drifted, and every PR inherits it

`python3 -m scripts.context_engine navcheck` fails on a clean checkout of `main`: `nav.yml`, four `context/nav/*.json` files and two `docs/browse/*.md` files are stale. The owner's open PR [#23](https://github.com/bamr87/README/pull/23) improves the *diagnostics* of that failure and attributes the red check on PR #22 to "an automated evolution PR touched `docs/**` without rebuilding". The root cause is different and lives on `main` itself:

1. **`.gitignore` swallows corpus content.** Fifteen un-anchored Python-venv patterns (`lib/`, `lib64/`, `build/`, `dist/`, `downloads/`, `eggs/`, `parts/`, `sdist/`, `var/`, `wheels/`, `env/`, `venv/`, `develop-eggs/`, `.vscode/`, `.idea/`) match at any depth, so `docs/zer0-mistakes/scripts/lib/**`, `docs/it-journey/.vscode/**` and `docs/barodybroject/.vscode/**` are never committed by the auto-commit action.
2. **The cron builds against the working tree, not the commit.** In CI, `aggregate.sh` writes those files to disk, the navigator indexes them, `nav.yml` and the facts count them, and then the commit step silently drops them. The committed navigation therefore references pages that do not exist in the repository, and the committed fact sheets over-count: `barodybroject` claims 305 documents (299 tracked), `zer0-mistakes` 723 (720), `it-journey` 1,148 (1,147). Three sidebar entries on the published site are dead links (`zer0-mistakes/scripts/lib/**`).
3. **The cron bypasses the gates.** `aggregate-docs.yaml` runs `schema_lint` but not `navcheck`, and commits directly to `main`. The PR gate then fails on every branch cut from `main`, whatever the branch changed: the five surfaces PR #22's failing log lists (`nav.yml` and four `context/nav/*.json` files) are exactly the ones stale on `main`. PR #22 has been red since 2026-09-07 for this reason; PR #23 makes the failure legible but leaves `main` red.

Two adjacent defects surfaced in the same audit:

4. **Upstream deletions never propagate.** `process.py` only writes and `aggregate.sh` only copies; across the entire history, the automated commits have deleted **zero** corpus files. Renames and removals upstream leave ghosts. `barodybroject` already carries a 73-document ghost tree under `docs/barodybroject/README/**`, 56 of them byte-identical to siblings elsewhere in its corpus; fleet-wide, 152 documents sit in 73 identical-content groups.
5. **The quality report measures the wrong things.** `lint_docs.py` flags 30,761 "line too long" issues, which is exactly what the house rule *one paragraph per line* (`markdown-oneline.yml`) mandates. `check_frontmatter.py` demands `tags` and `category` on every aggregated page, which upstream content cannot satisfy. The PR comment therefore reports issues by the tens of thousands (40,370 on today's corpus; the committed `docs/results/docs_quality_report.json` still says 8,564 from an older 2,749-file corpus) that nobody can or should act on, which trains readers to ignore it.

### 1.3 Other findings

| # | Finding | Evidence | Severity |
|---|---|---|---|
| F1 | Search covers cards, facts, apex and section titles only; corpus body text is not searchable via CLI or MCP, and results carry no snippets or filters | `indexer.py`, `query.search` | High |
| F2 | No provenance: no commit SHA, commit date, or upstream URL on any document or fact | `process.py` frontmatter = `title` + `source_file` | High |
| F3 | Three unregistered corpora (`docs/setup`, `docs/wargames`, `docs/results`) are v1 leftovers that still surface in the sidebar under "Reference" | `docs/browse/index.md` | Medium |
| F4 | `docs/docs_index.json` (13.1 MB) is committed and published to Pages on every deploy; it is a build intermediate, not a product | `du`, `deploy-pages.yaml` | Medium |
| F5 | Governance signals are six boolean file checks; no LICENSE, CODEOWNERS, workflow, MCP or AGENTS-section awareness; `rollups.top_tags` is empty for most projects | `extractor.py`, `context/facts/*.json` | Medium |
| F6 | AI enrichment is uncached: every keyed build re-spends tokens on unchanged corpora; outputs are not verified against the facts they were given | `synthesizer._ai_essence`, `assembler._fleet_overview` | Medium |
| F7 | Hook documentation lists six stages; the engine has seven (`post_navigate` is undocumented) | `hooks.d/SCHEMA.md` vs `config.HOOK_STAGES` | Low |
| F8 | About 5,400 lines of scripts sit outside the pipeline: `harmonize/` (Grok-only, predates `ai.py`), `aggregate_mkdocs.py`, `analyze_doc_structure.py`, `cleanup_docs.py`, `mkdocs_quality_report.py`, `fix_mkdocs_links.py` | `scripts/SCHEMA.md` rows without a stage | Low |
| F9 | Wiki.js stack (compose file, two root reports, `docs/setup/wikijs-setup.md`, `wiki-manage.sh`) is an orphaned distribution channel | root listing | Low |
| F10 | Integration tests clone `facebook/react` and `microsoft/vscode`; nothing tests `aggregate.sh` → `process.py` end to end on a small fixture | `tests/config.py` | Low |
| F11 | Hundreds of "expected" broken links in the site build are indistinguishable from real ones because the platform does not know which targets exist upstream as non-doc files | `MKDOCS.md` | Medium |
| F12 | The fleet registry lags the fleet: it-journey's own docs reference `bamr87/wargames`, `bamr87/lifehacker.dev` and `bamr87/bashconsultants`, none of which are registered | `docs/it-journey/CLAUDE.md` | Medium |

## 2. Product definition

### 2.1 Vision

A documentation platform that is **built, not written**, and **checked, not trusted**. It continuously gathers every README and doc from the fleet, organizes them with provenance, analyzes them for drift and gaps, summarizes them into layers sized for humans and models, distributes them through the site, the CLI, MCP and machine-readable feeds, and feeds what it finds back to the repos it describes.

### 2.2 Audiences and jobs

| Audience | Job to be done | Surface |
|---|---|---|
| Human skimming the fleet | "What is each project, where do I start, how healthy are its docs?" | Apex README, cards, site home, badges |
| Human researching a topic | "Everything the fleet says about Jekyll / security / agents" | Topic syntheses, corpus search with snippets, content maps |
| AI agent bootstrapping in a fleet repo | "Give me current, sized context about the neighbours without cloning them" | MCP tools, context packs, `llms.txt` |
| CI gate | "Did this change break the platform's own invariants?" | `engine check --gate` |
| Fleet maintainer | "What documentation is missing, stale, or inconsistent across my repos, and what should I fix first?" | Reports, rolling issues, proposals, trends |

### 2.3 Non-goals

- Not a CMS or an authoring surface: content is fixed upstream, never here (the existing "no hand edits to generated surfaces" rule stays).
- Not a general web crawler: sources are git repositories named in the registry.
- Not an autonomous editor of fleet repos: the platform *proposes* changes as patches and issues; applying them is a human or an upstream agent's decision.

### 2.4 Principles

1. **Registry first.** `_data/projects.yml` remains the only hand-edited definition of what exists; every new input (governance profiles, sync sets, topics, thresholds) lives there.
2. **Generated surfaces are never hand-edited** and are always reproducible from the registry plus the corpus.
3. **Offline-first and deterministic.** Every stage runs with no network and no key except `gather`; outputs carry fingerprints and upstream commit dates, never wall-clock timestamps (the manifest keeps the one `generated_at`).
4. **Every claim is traceable.** Facts cite corpus paths; corpus pages cite upstream commits; AI prose is verified against the facts it was given or replaced by the heuristic text.
5. **Findings are data.** Every check emits findings with a stable key, so they can be deduplicated, trended, gated, and synced to issues.
6. **Gates before automation.** The scheduled refresh passes the same gates as a human pull request. `main` is never red by construction.
7. **One read path.** CLI, MCP, site and packs read through `query.py`; there is no second implementation of search or navigation.
8. **AI amplifies, never gates.** Enrichment is cached, budgeted, evaluated with a mock, and optional.

## 3. Target architecture

### 3.1 Stages

| Stage | Input | Output | Code |
|---|---|---|---|
| 1. Gather | registry | `context/sources/<project>.json` (source manifest); ephemeral `raw/` | `context_engine/gather/` (adapters: `git`, `local`, optional `github`) |
| 2. Organize | manifest + raw | `docs/<project>/**` with provenance frontmatter; `context/corpus/<project>.json` (sharded index); pruned ghosts | `context_engine/organize/` (today's `process.py`, `fix_frontmatter_icons.py`, `generate_docs_index.py`) |
| 3. Analyze | corpus + manifests + registry + previous reports | `context/reports/{drift,gaps,links,freshness,health,changes}.json` + rendered `docs/reports/*.md`; `context/graph/fleet.json`; `context/reports/findings.json` | `context_engine/analyze/` with a `checks/` plugin registry |
| 4. Summarize | facts + nav + reports | `context/facts` (v2), `context/cards` (v2), `context/README.md`, `context/topics/*.md`, `context/digest/latest.md`; `context/ai/` cache | the existing flat modules (`extractor`, `navigator`, `synthesizer`, `assembler`, `indexer`) plus `digest.py`, `topics.py`, `ai_cache.py` |
| 5. Distribute | `context/` | `docs/llms.txt`, `docs/llms-full.txt`, `context/packs/*.md`, `docs/badges/*.json`, `docs/feed.xml`, MCP v2, rolling issues, proposals | `context_engine/distribute/`, `mcp/server.py` |
| Govern | everything | exit code + step summary; `findings.json` | `engine check [--gate]` (wraps the `analyze` checks in read-only mode plus `schema_lint` and `navcheck`) |

Existing flat modules stay where they are (they *are* the Summarize stage); only the new stages get subpackages. Moving `navigator.py` into `summarize/` would churn imports and tests for no behavioural gain.

### 3.2 Commands

```bash
engine gather   [--project NAME] [--adapter git|local] [--offline]   # stage 1
engine organize [--prune]                                            # stage 2
engine analyze  [--check ID] [--project NAME]                        # stage 3, writes reports
engine summarize [--ai auto|off|anthropic|xai|mock]                  # stage 4 (today's `build` minus nav/index side effects)
engine distribute                                                    # stage 5 (site files, packs, badges, feed)
engine build    [--from gather|organize|...]                         # all stages in order; `build` alone keeps today's meaning
engine check    [--gate] [--check ID] [--json]                       # Govern: read-only, exit 1 on errors; `navcheck` becomes `check surfaces`
engine report   {drift|gaps|links|freshness|health|changes} [NAME]   # print a report
engine findings [--severity error|warn|info] [--project NAME] [--class drift|gap|quality|alignment]
engine changes  [--since FINGERPRINT]                                # what changed in the corpus since a build
engine pack     {fleet|NAME} [--budget TOKENS]                       # token-budgeted context pack
engine doctor                                                        # status + check in one screen, for humans
```

Existing commands (`sync`, `query`, `card`, `facts`, `nav`, `apex`, `status`, `projects`) keep their names and output.

### 3.3 Data contracts

**Provenance frontmatter** (added by Organize to every corpus page; keys match the `source_repo`/`source_url` vocabulary it-journey already uses to mark vendored content as read-only):

```yaml
source_repo: bamr87/zer0-mistakes
source_path: scripts/README.md
source_ref: main
source_sha: 3f2c1a9e            # upstream head the corpus was taken from
source_date: 2026-09-05T10:22:41Z   # last upstream commit touching this file
source_url: https://github.com/bamr87/zer0-mistakes/blob/3f2c1a9e/scripts/README.md
doc_type: readme                # readme | guide | reference | changelog | agent-instructions | adr | index | post | other
```

**Source manifest** (`context/sources/<project>.json`): head SHA and date, default branch, license (SPDX guess), detected manifests (`package.json`, `pyproject.toml`, `Gemfile`, `mkdocs.yml`, `_config.yml`, `.mcp.json`, `CODEOWNERS`, workflow names), the **full file tree** (paths only; needed to tell "link points at code" from "link points at nothing"), and per-doc `{path, blob, last_commit, last_date}`.

**Facts v2** (additive to v1): `provenance` (head SHA/date, days behind at build), `doc_types` histogram, `governance` (extended signals), `manifests` (stack, CI workflow count, MCP presence), `links` (internal/broken/cross-project/external counts), `changes` (added/removed/modified since the previous build, from the previous manifest), `health` (score + components), `relations` (fleet projects this one links to or shares topics with), `topics` (mined terms).

**Finding** (`context/reports/findings.json`, one array):

```json
{"key": "G1:barodybroject:SECURITY.md", "check": "G1", "class": "gap", "severity": "warn",
 "project": "barodybroject", "path": null, "message": "No SECURITY.md (required for kind: app)",
 "evidence": {"profile": "app", "searched": ["SECURITY.md", ".github/SECURITY.md"]},
 "remedy": "Add SECURITY.md; a skeleton is in context/proposals/barodybroject/G1-SECURITY.md.patch",
 "first_seen": "6509281ac0bcba0c", "gate": false}
```

`key` is `check:project:subject` and never contains volatile text, so the same finding has the same key across builds. `gate: true` findings fail `engine check --gate`; the default gate set is the platform's own invariants (Section 4, class *drift* rows marked gate), never a fleet repo's documentation quality.

**Report** files are `{fingerprint, generated_by, summary, findings[]}` in JSON with a rendered Markdown twin under `docs/reports/`.

### 3.4 The check framework

A check is a small class: `id`, `title`, `cls` (`drift | gap | quality | alignment`), default `severity`, `gate`, `scope` (`repo | project | doc`), and `run(ctx) -> list[Finding]`. Checks register by import in `analyze/checks/__init__.py`, get a unit test with a fixture corpus each, and are configured from a new `governance:` block in the registry:

```yaml
governance:
  profiles:                      # expected governance files by project kind
    default: [README.md, LICENSE]
    app:     [README.md, LICENSE, CONTRIBUTING.md, CHANGELOG.md, SECURITY.md]
    theme:   [README.md, LICENSE, CHANGELOG.md]
  readme_sections: [overview, install, usage, configuration, testing, contributing, license]
  sync_sets:                     # files that must be identical across the named projects
    - name: frontmatter-schema
      path: .github/FRONTMATTER.md
      source_of_truth: zer0-mistakes
      members: [it-journey, zer0-mistakes]
  freshness_days: 7
  health:
    minimum: 70
    weights: {governance: 20, readme: 20, coverage: 15, links: 15, freshness: 15, metadata: 10, stubs: 5}
  checks:
    G2: {severity: info}         # per-check overrides
  external_projects: info        # never more than info for corpora the fleet does not own
```

### 3.5 Health score

Per project: `100 − Σ(weight × penalty)` where each component penalty is 0–1 (e.g. governance = missing profile files / expected; links = broken internal / total internal; freshness = min(1, days behind / 30)). Published as a number, a component breakdown, a badge, and a trend. External corpora are scored but never weighted into fleet totals.

## 4. Check catalogue

Class *drift* = generated or synced surfaces disagree with their source. Class *gap* = something expected is absent. Class *quality* = a page has a defect. Class *alignment* = the fleet disagrees with itself or with the hub. "Gate" means it fails `engine check --gate` on this repo's pull requests.

| ID | Check | Class | Gate | Phase | Notes |
|---|---|---|---|---|---|
| D1 | Surface drift: nav, browse, cards, facts, apex, README span, site index, `repos.txt`, `context/SCHEMA.md` differ from a fresh render | drift | yes | 0 | Generalizes today's `navcheck` |
| D2 | Structure drift: SCHEMA.md pyramid | drift | yes | exists | `schema_lint.py` |
| D3 | Registry ↔ corpus: corpus dir without registry entry, entry without corpus, archived or `aggregate: false` corpus still present | drift | yes | 0 | Catches `setup/`, `wargames/`, `results/` today |
| D4 | Upstream freshness: corpus head vs upstream head, in commits and days | drift | no | 1 | Needs network in `gather`; the gate reads the recorded age |
| D5 | Tracked integrity: every path a generated surface references is a git-tracked file; no corpus file is gitignored | drift | yes | 0 | The live defect |
| D6 | Self-consistency: numbers in the apex, cards and README table equal the facts; registry projects equal the hub's `.gitmodules` submodule list | drift / alignment | yes (numbers) | 2 | Hub list needs the `bamr87/bamr87` source manifest |
| D7 | Ghosts: corpus files whose upstream path no longer exists; identical-content duplicates within a project | drift | no | 1 | 152 documents today |
| D8 | Link health: internal broken (target absent upstream), internal-to-code (target exists upstream but is not a doc), cross-project, external (optional HEAD probe, cached, weekly) | drift | no | 2 | Separates the "expected" MkDocs warnings from real 404s |
| D9 | Metadata drift: `lastmod` older than the file's last commit; `version:` in README disagrees with the CHANGELOG head | drift | no | 2 | |
| G1 | Governance files per profile (README, LICENSE, CONTRIBUTING, CHANGELOG, SECURITY, CODE_OF_CONDUCT, CLAUDE.md or AGENTS.md, SCHEMA.md) | gap | no | 2 | Profiles by `kind` in the registry |
| G2 | README section coverage against `readme_sections` (heading matcher with synonyms) | gap | no | 2 | Root README and every directory README |
| G3 | Undocumented directories: upstream top-level (and second-level) directories with no README or index | gap | no | 2 | Uses the full file tree from the source manifest |
| G4 | Orphan pages: no inbound link and not reachable from navigation | gap | no | 2 | Link graph |
| G5 | Stubs: under 60 words, `TODO`/`TBD`/`coming soon` markers, headings with empty bodies | gap | no | 2 | |
| G6 | Frontmatter completeness against the corpus profile (title, description; per-collection extras when upstream declares them) | gap | no | 2 | Replaces today's blanket `tags`/`category` rule |
| G7 | Stale pages: doc last commit older than N days while sibling code changed | gap | no | 3 | Needs per-file dates from `gather` |
| G8 | Agent-readiness: CLAUDE.md sections (commands, architecture, conventions), AGENTS.md, `.mcp.json`, skills directory | gap | no | 2 | Fleet-wide "AI-readiness" score |
| G9 | Unanswerable queries: MCP/CLI searches with zero hits (opt-in local log) aggregated into gaps | gap | no | 5 | Feedback loop |
| Q1 | Markdown defects: unbalanced fences, missing H1, trailing whitespace, heading level skips, duplicate titles in one section, invalid YAML frontmatter | quality | yes (fences, YAML) | 0 | Replaces `lint_docs.py`; **no** long-line rule |
| Q2 | Navigation safety: unresolvable `icon:` values | quality | yes | exists | `fix_frontmatter_icons.py` |
| Q3 | Determinism: building twice over an unchanged corpus yields an empty diff | quality | yes | 1 | CI-only check |
| A1 | Sync sets: files declared identical across projects differ from their source of truth | alignment | no | 2 | it-journey's `FRONTMATTER.md` rule, encoded |
| A2 | Convention alignment: vendored tools (`tools/unwrap-prose.py`), shared workflow kits, `.editorconfig` baseline present and current | alignment | no | 3 | The hub's fan-out kits, verified from the consumer side |
| A3 | Cross-reference alignment: links between fleet projects point at pages that exist at the target's current head | alignment | no | 3 | |

## 5. Distribution surfaces

| Surface | What | Consumer |
|---|---|---|
| MCP v2 (`mcp/server.py`) | Existing 7 tools plus `get_document(project, path, section?)` with provenance; `search_context` v2 with `scope` (`cards | corpus | reports`), `project`, `doc_type`, snippets and highlights; `get_report(kind, project?)`; `list_findings(...)`; `get_changes(since?)`; `get_related(project | path)`; `get_pack(name, budget?)`. Resources `context://reports/*`, `context://packs/*`, `context://sources/*`. MCP prompts `bootstrap-fleet-context` and `review-readme`. Still read-only. | Claude Code and other MCP clients |
| `docs/llms.txt` + `docs/llms-full.txt` | Fleet map for model consumption (apex summary, per-project card links, reports), and the concatenated apex + cards | Any LLM tool that honours `llms.txt` |
| Context packs (`context/packs/`) | `fleet-bootstrap.md` (≤ 2k tokens) and `<project>.md` (≤ 8k tokens): card + provenance + excerpts of the most-linked documents, assembled deterministically within a budget | Agents that need one file, not a protocol |
| Reports (`docs/reports/`) | Rendered drift, gaps, links, freshness, health, changes; a fleet health table; per-project pages | Humans on the site; replaces `docs/results/` |
| Badges (`docs/badges/<project>-health.json`) | shields.io endpoint JSON so a fleet repo can embed its documentation-health badge | Fleet READMEs |
| Digest + feed (`context/digest/latest.md`, `docs/feed.xml`) | "What changed in the fleet's documentation since the last build": documents added, removed, modified; findings opened and resolved; optional AI summary from the cache | Humans, RSS readers, the hub dashboard |
| Topic syntheses (`context/topics/*.md`) | For registry-declared topics: which projects cover it, the key documents, shared vocabulary | Researchers, agents |
| Rolling issues | One issue per project in this repo, "Documentation health: <project>", updated in place from `findings.json` with a hidden key marker (the hub's `<!-- fleet-doctor key=... -->` convention), closed when clean | Fleet maintainer |
| Proposals (`context/proposals/<project>/<key>.patch` + `.md`) | Mechanical remedies ready to apply upstream: README section skeletons, missing governance files, sync-set copies from the source of truth, frontmatter fixes | The hub's `@claude` workflow, `engine propose --apply` inside the monorepo checkout, or a human |
| Site | Unchanged MkDocs Material build plus the reports section and the home page's health table | Humans |

The Wiki.js stack is retired from the default path (Decision 3): GitHub Pages plus MCP cover human and machine distribution, and the compose stack has no consumer in the pipeline.

## 6. The loop: continuous improvement and alignment

### 6.1 Workflows

| Workflow | Trigger | Does | Replaces |
|---|---|---|---|
| `quality-gate.yaml` | PRs, pushes to `main` | `engine check --gate` + unit tests + `schema_lint`; remedies mirrored into the step summary (fold PR #23 in) | `docs-quality-check.yaml` |
| `refresh.yaml` | daily schedule + manual | gather → organize → analyze → summarize → distribute → `engine check --gate`; opens or updates one rolling PR `automated/context-refresh` labelled `auto-merge` | `aggregate-docs.yaml` |
| `auto-merge.yaml` | check suites on the rolling PR | Merges when every check is green **and** the diff touches only generated paths (allowlist: `docs/**`, `context/**`, `nav.yml`, `repos.txt`, the README AUTO span) | new |
| `findings-sync.yaml` | push to `main` touching `context/reports/findings.json` | Creates, updates, closes the rolling issues | new |
| `deploy-pages.yaml`, `ci.yml`, `claude.yml`, `markdown-oneline.yml` | unchanged | | |

Why a rolling PR instead of a direct commit: branch protection then enforces the gates on the automation exactly as on humans, the refresh has an audit trail, and `main` cannot go red the way it did on 2026-09-07. If the owner prefers direct commits (Decision 1), the minimum is to run `engine check --gate` *after* `git add -A` and before the commit.

### 6.2 Cadence and SLOs

| SLO | Target | Measured by |
|---|---|---|
| Freshness | every active corpus ≤ 7 days behind its upstream head | D4, `freshness.json` |
| Integrity | 0 dead navigation targets, 0 untracked referenced files, 0 surface drift on `main` | D1, D5 |
| Coverage | every registered project has facts, card, nav, report; every corpus directory is registered | D3 |
| Health | score ≥ 70 for every active non-external project, or an open rolling issue tracks it | `health.json` |
| Determinism | rebuild over an unchanged corpus is an empty diff | Q3 |
| Gate latency | `quality-gate` finishes in under 2 minutes | Actions timing |
| Loop closure | a drift finding fixed upstream disappears from the report within one refresh | `changes.json` |

### 6.3 Trend and feedback

- `context/history/metrics.jsonl` appends one line per build: corpus fingerprint, upstream head dates, counts, per-project health and finding totals. No wall-clock field, so it stays deterministic. A trend page under `docs/reports/` renders it.
- `engine feedback` (Phase 5) aggregates opt-in local MCP/CLI query logs into G9 findings, so the platform learns which questions it cannot answer.
- Proposals close the loop outward: findings with a mechanical remedy ship with a patch, and the hub's existing `@claude` handler or fan-out kits apply them upstream. This repo never edits a fleet repo directly.

## 7. Roadmap

Effort is in pull requests, each independently mergeable and gated. Dates assume one contributor with AI assistance; phases can overlap after Phase 1.

### Phase 0 — Stabilize (this week)

| PR | Change | Exit criterion |
|---|---|---|
| 0.1 | Anchor the venv patterns in `.gitignore` to the repo root (`/lib/`, `/build/`, …) or narrow them to `.venv/`; add the D5 tracked-integrity check; rebuild; commit the swallowed corpus files | `engine check --gate` passes on `main`; `navcheck` clean; fact counts equal tracked counts |
| 0.2 | Run the gates inside the cron before committing; switch to the rolling PR (Decision 1) | The next scheduled refresh cannot leave `main` red |
| 0.3 | Prune ghosts: `organize --prune` removes corpus files absent from the gather manifest; delete `docs/setup`, `docs/wargames`; move `docs/results` to generated `docs/reports`; add D3 | 0 unregistered corpora; the `barodybroject/README/**` duplicate tree is gone |
| 0.4 | Replace `lint_docs.py` rules with Q1 (no long-line rule) and the blanket frontmatter rule with G6; make the PR comment report only actionable findings | The quality report on a clean PR shows 0 issues |
| 0.5 | Document the seventh hook stage; fold PR #23's step-summary diagnostics into the gate | `hooks.d/SCHEMA.md` matches `HOOK_STAGES` |

### Phase 1 — Gather and Organize v2 (weeks 1–3)

| PR | Change | Exit criterion |
|---|---|---|
| 1.1 | `gather/` package: `git` adapter with `--filter=blob:none` partial clones, per-file last-commit dates, full file tree, license and manifest detection; `local` adapter for the monorepo checkout and tests; `aggregate.sh` becomes a thin wrapper | `context/sources/<project>.json` for every project; fixture repo test (`git init` in a temp dir) |
| 1.2 | Organize v2: provenance frontmatter, `doc_type` classifier, prune, sharded corpus index at `context/corpus/`; `docs/docs_index.json` kept for one release as a compatibility build | Every corpus page has `source_sha`, `source_date`, `source_url`; index out of `docs/` |
| 1.3 | D4 freshness and D7 ghost checks; Q3 determinism check in CI | `freshness.json` published |
| 1.4 | Non-markdown inputs for facts only (`.rst`, `.adoc`, `.txt` counted; manifests parsed) | `facts.manifests` populated |

### Phase 2 — Analyze (weeks 3–6)

| PR | Change | Exit criterion |
|---|---|---|
| 2.1 | Check framework, finding schema, `engine check`/`analyze`/`findings`/`report`; migrate D1–D3, D5, Q1, Q2 onto it | `navcheck` is an alias; old scripts removed from the gate |
| 2.2 | Link graph and D8, G4; `context/graph/fleet.json` | Broken-link report distinguishes code targets from missing targets |
| 2.3 | Governance profiles in the registry; G1, G2, G3, G5, G6, G8, D9, A1 | Reports for every project; health score and `health.json` |
| 2.4 | D6 self-consistency and hub alignment (register `bamr87/bamr87` as a `hub` source) | Registry vs `.gitmodules` diff is a finding |

### Phase 3 — Summarize v2 (weeks 6–8)

| PR | Change | Exit criterion |
|---|---|---|
| 3.1 | Facts v2 fields; cards v2 sections (Start here, Runs on, Health, Recent changes); apex health table; `changes.json` from the previous manifest | Rebuild over an unchanged corpus is still an empty diff |
| 3.2 | AI cache (`context/ai/<project>.<prompt-version>.<fingerprint>.json`), claim verifier (every path or number in AI prose must exist in the facts, else heuristic fallback), per-build budget `CONTEXT_AI_MAX_CALLS`, `tests/evals/` with golden facts and the mock provider | Second keyed build over an unchanged corpus makes 0 API calls |
| 3.3 | Topic syntheses and the digest; G7 stale pages | `context/topics/*.md`, `context/digest/latest.md` |
| 3.4 | Archive `harmonize/` and the other out-of-pipeline scripts (Decision 6); update `scripts/SCHEMA.md` and `scripts/README.md` | Every row in `scripts/SCHEMA.md` maps to a stage |

### Phase 4 — Distribute v2 (weeks 8–10)

| PR | Change | Exit criterion |
|---|---|---|
| 4.1 | MCP v2 tools, resources and prompts; corpus search with snippets through `query.py` | MCP test suite covers every tool |
| 4.2 | `llms.txt`, `llms-full.txt`, context packs, badges, feed; site reports section and home-page health table | Files served from Pages; a fleet README can embed a badge |
| 4.3 | Retire the Wiki.js stack (Decision 3) | Root listing shrinks by five entries |

### Phase 5 — The loop (weeks 10–12)

| PR | Change | Exit criterion |
|---|---|---|
| 5.1 | `refresh.yaml` rolling PR + `auto-merge.yaml` with the generated-paths allowlist | First automated refresh merges without a human |
| 5.2 | `findings-sync.yaml` rolling issues with key markers | One issue per project, updated in place, closed when clean |
| 5.3 | Proposals with patches; `engine propose --apply` for the monorepo checkout | A missing SECURITY.md finding ships with an applicable patch |
| 5.4 | Metrics history, trend page, SLO table in `engine doctor` and `context_status` | Health trend visible for every project |
| 5.5 | Optional: `github` adapter for repo metadata; G9 feedback; upstream issue creation if a token is provided (Decision 4) | |

### Ongoing

- Register the fleet repos the corpus already talks about (Decision 5).
- Keep `PRD.md` as the layer spec and this file as the roadmap; retire sections here as they ship and move the check catalogue into `scripts/context_engine/analyze/README.md` when the framework lands.

## 8. Target repository layout

```
_data/projects.yml           registry (+ governance:, topics:, sync_sets:)
scripts/context_engine/
  gather/                    adapters + manifests           (Phase 1)
  organize/                  process, classify, index       (Phase 1)
  analyze/checks/            D*, G*, Q*, A* checks          (Phase 2)
  analyze/{links,graph,health,reports}.py
  distribute/                llms, packs, badges, feed, findings sync   (Phase 4–5)
  extractor.py navigator.py synthesizer.py assembler.py indexer.py   (unchanged homes)
  digest.py topics.py ai_cache.py                             (Phase 3)
context/
  sources/  corpus/  reports/  graph/  topics/  digest/  packs/  ai/  history/  proposals/
  facts/  cards/  nav/  index/  README.md  SCHEMA.md         (existing)
docs/
  <project>/**  browse/  reports/  badges/  llms.txt  llms-full.txt  feed.xml  index.md
mcp/server.py                MCP v2
tests/unit/test_cases/       one module per stage; tests/evals/ for AI outputs
```

SCHEMA deltas: `context/SCHEMA.md` (generated) gains the new directories; `scripts/SCHEMA.md` rows for the new subpackages and the retired scripts; root `SCHEMA.md` loses the Wiki.js entries in Phase 4; `_data/SCHEMA.md` documents the new registry blocks. Every one of these ships in the same PR as the structural change, per the SCHEMA protocol.

## 9. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Repository growth (docs 50 MB, `.git` 23 MB, one 13 MB JSON published per deploy) | Shard the index out of `docs/`; prune ghosts; partial clones; consider excluding upstream `node_modules`-style trees at gather time via registry globs |
| AI cost and non-determinism | Cache keyed by fingerprint + prompt version; per-build call budget; claim verifier; heuristic fallback; the mock provider in tests |
| False-positive gaps eroding trust | Profiles by kind; `external` corpora capped at `info`; per-check overrides; findings never gate fleet quality, only platform invariants |
| Issue and PR noise | One rolling PR; one rolling issue per project; auto-merge only for generated-path diffs |
| Network flakiness in `gather` | Retries; on failure keep the previous corpus and manifest and emit a D4 finding instead of a half-empty corpus |
| Link probing rate limits | External probes weekly, cached, allowlisted, off by default |
| Scope creep into a CMS | Non-goals in Section 2.3; the read-only MCP rule stays |

## 10. KPIs

- Freshness lag per corpus (days behind upstream head), target ≤ 7.
- Dead navigation targets and untracked references on `main`: 0.
- Findings opened and resolved per week; median time from finding to resolution.
- Health score per project, trended; number of projects below the minimum.
- Gate first-pass rate on pull requests.
- AI cache hit rate and tokens per build.
- MCP zero-hit query rate (once G9 exists).
- Time from an upstream doc change to its appearance in the card and the digest (≤ 1 day with a daily refresh).

## 11. Decisions for the owner

| # | Decision | Recommendation |
|---|---|---|
| 1 | Refresh commits directly to `main` after gates, or opens a rolling auto-merged PR | Rolling PR: branch protection enforces the gates, and `main` cannot go red |
| 2 | `.vscode/`, `.idea/` and similar upstream directories in the corpus | Include (they hold READMEs upstream and are already `not_in_nav`); exclusions belong in the registry, never in `.gitignore` |
| 3 | Wiki.js stack | Retire in Phase 4; Pages and MCP cover distribution; keep the files in git history |
| 4 | Creating issues on fleet repos from here | Start with rolling issues in this repo plus `findings.json` for the hub's fleet-doctor; upstream issues only when the owner supplies a fine-grained token with `issues: write` |
| 5 | Register `bamr87/wargames`, `bamr87/lifehacker.dev`, `bamr87/bashconsultants`, and the hub `bamr87/bamr87` | Yes; the hub as `kind: hub` unlocks the D6 submodule alignment check |
| 6 | `harmonize/` (Grok-only, 2,900 lines) | Archive in Phase 3; its document-type vocabulary moves into the `doc_type` classifier |
| 7 | Refresh cadence | Daily once partial clones land (Phase 1); weekly until then |

## Appendix A — Audit evidence

All commands were run on a clean checkout of `main@8673087` on 2026-09-14.

```bash
python tests/test_runner.py --type quick            # 80/80 passed
python3 scripts/schema_lint.py check .              # 6 nodes, 0 errors, 0 warnings
python3 -m scripts.context_engine navcheck          # drift: nav.yml, 4x context/nav, 2x docs/browse
git check-ignore -v docs/zer0-mistakes/scripts/lib/README.md   # .gitignore:27:lib/
git check-ignore -v docs/it-journey/.vscode/README.md          # .gitignore:44:.vscode/
git log --format=%H --grep="Automated docs aggregation" | \
  xargs -I{} git show --diff-filter=D --name-only --format= {} -- docs | wc -l   # 0
python3 scripts/lint_docs.py | grep -c "Line too long"          # 30761 (of 40,370 issues)
```

| Measure | Value |
|---|---|
| Registered corpora / unregistered corpus dirs | 7 / 3 (`results`, `setup`, `wargames`) |
| Documents in the corpus index / words | 3,196 / 3,255,018 |
| Tracked corpus markdown files | 3,185 |
| Fact-sheet counts vs tracked files | barodybroject 305 vs 299; zer0-mistakes 723 vs 720; it-journey 1,148 vs 1,147 |
| Navigation targets / dead on disk | 2,124 / 3 |
| Identical-content duplicate groups (within one project) | 73 groups, 152 documents (barodybroject 56 groups / 112 documents, skills 17 groups / 40 documents) |
| `.gitignore` patterns that also match `docs/<repo>/<pattern>/` | 15 |
| `lint_docs.py` issues on today's corpus | 40,370 across 3,185 files (30,761 long lines, 8,627 trailing whitespace, 964 missing H1, 18 fence problems); the committed report says 8,564 from a 2,749-file corpus |
| Documents without `description` / without `tags` | 1,713 / 2,230 |
| Size: `docs/` / `.git` / `docs_index.json` / `nav.yml` | 50 MB / 23 MB / 13.1 MB / 240 KB |
| Engine hook stages: code / documented | 7 / 6 |
| Unit tests / integration fixtures | 80 passing / clones of `facebook/react` and `microsoft/vscode` |

## Appendix B — Glossary

- **Corpus**: the aggregated markdown under `docs/<project>/`, the L3 base of the pyramid.
- **Surface**: any generated file (nav, cards, facts, apex, README span, site index, packs, reports).
- **Drift**: a surface or a synced file that no longer matches what it was generated or copied from.
- **Gap**: an expected document, section, or metadata field that is absent.
- **Finding**: one machine-readable result of a check, with a stable key.
- **Gate**: the subset of checks whose errors fail a pull request to this repository.
- **Ghost**: a corpus file whose upstream original was deleted or moved.
- **Pack**: a token-budgeted, single-file bundle of context for an agent.
