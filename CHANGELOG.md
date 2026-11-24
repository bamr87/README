# Changelog

## [0.6.0](https://github.com/bamr87/README/compare/v0.5.0...v0.6.0) (2026-11-23)


### Added

* **assist:** adopt the fleet page bridge (kit v0.1.1) ([abd5959](https://github.com/bamr87/README/commit/abd59591ac87f722b4a3b219891bf3780d4bd671))
* **assist:** let an assistant session see and use this repo's pages ([479a807](https://github.com/bamr87/README/commit/479a807b4d6b2cba55cb50132193ab3990986128))
* **assist:** mount the page bridge behind FLEET_ASSIST=1 ([9c8feb2](https://github.com/bamr87/README/commit/9c8feb2116c571934556cae57e8fc10c11a1a2f8))
* **site:** vault workspace at /brain/workspace/ (README-019) ([0c21df8](https://github.com/bamr87/README/commit/0c21df8026612f2794a0c20c65912a75ff3911cc))
* **site:** vault workspace at /brain/workspace/ (README-019) ([41ffe7d](https://github.com/bamr87/README/commit/41ffe7dc5ca377a667ddbeb86008a69d352b854a))
* **site:** WebGL graph explorer and Atlas; propose README as the fleet's knowledge plane ([1c7f65e](https://github.com/bamr87/README/commit/1c7f65e6abb1c32d4afa44f82f0efbc92423e764))
* **site:** WebGL graph explorer, build-time constellation layout and the Atlas ([fbda271](https://github.com/bamr87/README/commit/fbda271546dc00645e16307c9c4598fd913161de))


### Fixed

* **site:** graph theme, Atlas clicks and contrast, paths and teardown ([d274ced](https://github.com/bamr87/README/commit/d274ceda2686c771406cfee6db25460fc389714a))
* **site:** graph theme, Atlas clicks and contrast, paths and teardown ([7166ee9](https://github.com/bamr87/README/commit/7166ee935ab34edad91dcb244305abd5bcd931b3))


### Documentation

* **adr:** ADR 0004 names the Atlas as README-020 ([427ca96](https://github.com/bamr87/README/commit/427ca96f9646074654158c5304c8aa0346e4a43b))

## [0.5.0](https://github.com/bamr87/README/compare/v0.4.0...v0.5.0) (2026-11-21)


### Added

* **mcp:** provenance and trust markers on every MCP answer (README-011) ([5086224](https://github.com/bamr87/README/commit/5086224e1483b86fe75600e905ebd9947d1cbd52)), closes [#60](https://github.com/bamr87/README/issues/60)

## [0.4.0](https://github.com/bamr87/README/compare/v0.3.0...v0.4.0) (2026-11-18)


### Added

* **site:** add MkDocs theme overrides for skip link, SEO meta, 404 and tokens ([0cdc074](https://github.com/bamr87/README/commit/0cdc074a214b9800bc64d7d57fb96689e191e3e6))
* **site:** add MkDocs theme overrides for skip link, SEO meta, 404 and tokens ([5eda3ff](https://github.com/bamr87/README/commit/5eda3ffadb2f1519ff5aa2d7efce6cfa924a0572))

## [0.3.0](https://github.com/bamr87/README/compare/v0.2.2...v0.3.0) (2026-11-18)


### Added

* **engine:** collect the fleet into an Obsidian vault with a generated second brain ([e9b547e](https://github.com/bamr87/README/commit/e9b547e971c02f55d6f3174394238953e799e3b7))
* **engine:** Obsidian vault and second brain for the fleet's docs ([be7a412](https://github.com/bamr87/README/commit/be7a412b912dae23a08f3d53d548402d418177e2))
* **mcp:** add --version and --healthcheck flags to the stdio server ([771f7bb](https://github.com/bamr87/README/commit/771f7bba6f8e9856e4929ea561f0f92fcbab46ce))
* **mcp:** add --version and --healthcheck flags to the stdio server ([82969d5](https://github.com/bamr87/README/commit/82969d5fbac7ea5814c9e9cfd40a3d45a5428f46)), closes [#67](https://github.com/bamr87/README/issues/67)
* **mcp:** add get_doc to read one indexed corpus page ([c0f368c](https://github.com/bamr87/README/commit/c0f368ca5ff2642b104031eabb9dca38afecd053))
* **mcp:** add get_doc to read one indexed corpus page ([507baf1](https://github.com/bamr87/README/commit/507baf17fba31d598aa61611bd500dcb0728a5ca)), closes [#59](https://github.com/bamr87/README/issues/59)


### Fixed

* **brain:** give generated and hand-written notes a category ([b877ac2](https://github.com/bamr87/README/commit/b877ac27f856dcb87f3b49ea7d4316d1e1a04af7))
* **context-engine:** bound AI retries and add a per-build AI budget ([86205f9](https://github.com/bamr87/README/commit/86205f9f0db12fb0e1f4c2a824132ba2ba503727))
* **context-engine:** bound AI retries and add a per-build AI budget ([fe5870c](https://github.com/bamr87/README/commit/fe5870cdb2bc45d26188c79a9371fde0ef8061fd)), closes [#54](https://github.com/bamr87/README/issues/54)
* **context-engine:** screen untrusted facts and AI output at build ([8c22b8b](https://github.com/bamr87/README/commit/8c22b8b15fba8f0669fe2987cd5a892d77bc7580)), closes [#52](https://github.com/bamr87/README/issues/52)
* **context-engine:** screen untrusted upstream docs at ingest and build ([6ecfc1c](https://github.com/bamr87/README/commit/6ecfc1cf629e442d44e28c573aaa57983d94af1c))
* **crawl:** fail on unfetchable repos, validate clone targets, drop aggregate.py ([6dfcf70](https://github.com/bamr87/README/commit/6dfcf70ee2367a8a6fe1114ddf0d3e25be52ed57))
* **crawl:** fail on unfetchable repos, validate clone targets, drop aggregate.py ([c31972f](https://github.com/bamr87/README/commit/c31972f06d36d3b05fcb769329961931d689c1f8)), closes [#55](https://github.com/bamr87/README/issues/55)
* **ingest:** drop hidden carriers from the corpus at ingest ([18c4a98](https://github.com/bamr87/README/commit/18c4a982b77e3ca79c88f2b62ffe1aa5392fdb34)), closes [#52](https://github.com/bamr87/README/issues/52)
* **ingest:** leave no bare block marker where a comment stood ([0c51623](https://github.com/bamr87/README/commit/0c51623c1c0b3acea32f0fd72625ffc02191a7ec))
* **mcp:** confine tool arguments to the context tree ([4de80dd](https://github.com/bamr87/README/commit/4de80dd3b05a6069977f41b651280fbac69d9fdb))
* **mcp:** confine tool arguments to the context tree ([82233f6](https://github.com/bamr87/README/commit/82233f60e09e70d25895487908d305a70aab3231)), closes [#51](https://github.com/bamr87/README/issues/51)
* **mcp:** tell clients that results quote untrusted upstream docs ([b8e8b49](https://github.com/bamr87/README/commit/b8e8b498ccb6e2e3cc5c1738cd400e23a9342a59)), closes [#52](https://github.com/bamr87/README/issues/52)
* **security:** screen the crawled corpus for secrets, keep provider keys out of hooks ([614378a](https://github.com/bamr87/README/commit/614378a5a8e8879fe1313e346395f1f851485a96))
* **security:** screen the crawled corpus for secrets, keep provider keys out of hooks ([17d9c45](https://github.com/bamr87/README/commit/17d9c45f54ce7a7c753eaaf6243b789df362dc4c))
* **survey:** match a --local checkout to its fleet entry by origin remote ([83df39d](https://github.com/bamr87/README/commit/83df39da6b14f6b102c8ab31e167b285f01f44d1))
* **survey:** match a --local checkout to its fleet entry by origin remote ([d2cb720](https://github.com/bamr87/README/commit/d2cb720fbc6811ca5cacc93d0ac88617a7f01b62)), closes [#72](https://github.com/bamr87/README/issues/72)
* **survey:** match a monorepo package by its directory name under --local ([baa7a78](https://github.com/bamr87/README/commit/baa7a78e12b5cfc1e16aa15a2a1c71dd81bb6c8f))
* **tests:** run the docs fixers in the test's own directory ([9fd8356](https://github.com/bamr87/README/commit/9fd83562fc9f07751d4120d32dbc7aaec02eb23f))


### Documentation

* **community:** seed SECURITY, CONTRIBUTING and the PR template from the community kit ([fec2d5d](https://github.com/bamr87/README/commit/fec2d5d32e4ff904d6156409417da8602b5e494f)), closes [#56](https://github.com/bamr87/README/issues/56)
* **constitution:** state the missions in §1 (amendment 0002) ([f9e1e5d](https://github.com/bamr87/README/commit/f9e1e5dd5bec3663ceaf981dbf6303f846f22635))
* **constitution:** state the missions in §1 (amendment 0002) ([1ef3076](https://github.com/bamr87/README/commit/1ef3076b21344924a973af78b9c88a3fb9acf0b8))
* **prd:** give requirements stable FR/NFR ids, record the survey, list the gates ([5fd62ee](https://github.com/bamr87/README/commit/5fd62eee7dafe2e08054972e55ef3cf837088963)), closes [#56](https://github.com/bamr87/README/issues/56)
* regenerate navigation after the missions amendment ([2055bec](https://github.com/bamr87/README/commit/2055becbef384257bda124e79e3f66b144f0d0a8))
* seed the community kit files and give the PRD stable requirement ids ([4924dec](https://github.com/bamr87/README/commit/4924decee253c7aadc71d94b97cb16a984faef7a))
* **tests:** leave the survey coverage line to [#74](https://github.com/bamr87/README/issues/74) ([eceecd3](https://github.com/bamr87/README/commit/eceecd33b44a4e99176f93d6e2f44e3f2b30b4ee)), closes [#72](https://github.com/bamr87/README/issues/72)

## [0.2.2](https://github.com/bamr87/README/compare/v0.2.1...v0.2.2) (2026-11-13)


### Fixed

* **registry:** remove stale vendored skills corpus (dead upstream source) ([5ef5cf5](https://github.com/bamr87/README/commit/5ef5cf51a3375e3d50668eef3811e90c5fb2dcbf))
* **registry:** remove stale vendored skills corpus (dead upstream source) ([de09726](https://github.com/bamr87/README/commit/de0972633a7fb830c4d5694df80a6f145517abb2))

## [0.2.1](https://github.com/bamr87/README/compare/v0.2.0...v0.2.1) (2026-11-12)


### Documentation

* **prd:** plan README-010 (get_doc) and README-011 (MCP provenance) ([1e9f6c7](https://github.com/bamr87/README/commit/1e9f6c74384503286f46d5c767e3dbcb17947ba1))
* **prd:** plan README-010 get_doc and README-011 MCP provenance ([8fdb882](https://github.com/bamr87/README/commit/8fdb882a446c15a3aaf16a2215731a68f7b27bac))

## [0.2.0](https://github.com/bamr87/README/compare/v0.1.0...v0.2.0) (2026-10-30)


### Added

* Add documentation cleanup and harmonization tools ([ab2093e](https://github.com/bamr87/README/commit/ab2093e0462749c84f13bf33028cd71f1ba45646))
* Add MkDocs documentation setup and index page ([0493482](https://github.com/bamr87/README/commit/04934824bd0efa470775849db31ca9592619be9f))
* **docs:** Add comprehensive setup and testing guides for Docker-first development in barodybroject ([47d34dd](https://github.com/bamr87/README/commit/47d34dd84cb374f087050c218bf222e5b8fbba38))
* **docs:** publish standalone GitHub Pages site via mkdocs ([ccb0f08](https://github.com/bamr87/README/commit/ccb0f08e44f28962165a2a0bb8e0f728152cd454))
* repurpose repo as the monorepo's consolidated README context engine ([#8](https://github.com/bamr87/README/issues/8)) ([c454d2d](https://github.com/bamr87/README/commit/c454d2d9ce9cf5a898276b239c110762b7df39a2))
* **survey:** fleet documentation survey, plus the autonomous-merge design ([#25](https://github.com/bamr87/README/issues/25)) ([b27534a](https://github.com/bamr87/README/commit/b27534a01e92d6754b70d4a439d02b220495b5c8))
* **survey:** review the fleet's documentation against the docs framework ([#43](https://github.com/bamr87/README/issues/43)) ([56f0648](https://github.com/bamr87/README/commit/56f06485955ab72982c8a5ebc71912235db7e642))
* **wikijs:** Add Wiki.js integration for documentation management ([8f7a96c](https://github.com/bamr87/README/commit/8f7a96ca53971a3f8f7aedb4abd75c96fb1973e0))
* **wikijs:** restore Wiki.js integration files ([9425fba](https://github.com/bamr87/README/commit/9425fba1e3343bca214ef2a9c0646b6d39ae3e67))
* **wikijs:** restore Wiki.js integration files ([c3731e4](https://github.com/bamr87/README/commit/c3731e47c6d23eb3fe35458f3413b2689b7c7c62))


### Fixed

* **ci:** stage aggregated corpus before the tracked-surfaces gate ([#32](https://github.com/bamr87/README/issues/32)) ([6ecb40a](https://github.com/bamr87/README/commit/6ecb40a4ab90cc8358cfefffb7afbb5da1d2ba1d))
* **ci:** stop the oneline gate policing the generated docs/ corpus ([#26](https://github.com/bamr87/README/issues/26)) ([5962cee](https://github.com/bamr87/README/commit/5962ceeae2c475018705d58303edd8d7c7928729))
* **context:** rebuild the context pyramid so fact counts match the tracked corpus ([#33](https://github.com/bamr87/README/issues/33)) ([428d0e0](https://github.com/bamr87/README/commit/428d0e0071481fd7b1464be89f80e5062b395438))
* **release:** skip release-please when it has no credential to open the PR ([c9801dd](https://github.com/bamr87/README/commit/c9801dd1447eaf47d490bbd8eb03eed59387d68f))
* **release:** skip release-please when it has no credential to open the PR ([c2a0e73](https://github.com/bamr87/README/commit/c2a0e73cc846b15464a9fbb807cef0cd48adfef6))
* remove stale case-duplicate index entry for start.md ([c5c2ae7](https://github.com/bamr87/README/commit/c5c2ae76784d7fdf7c5b678b53ca0fb53fe2d67f))
* remove trailing whitespace in the title of the PiDentity document ([4d015a9](https://github.com/bamr87/README/commit/4d015a96a89dce6f93c762206f97caacaea18654))
* stop .gitignore swallowing corpus files; green main's gates ([#28](https://github.com/bamr87/README/issues/28)) ([36b378e](https://github.com/bamr87/README/commit/36b378e2f4dbdb4f07bc3ea08954421826ec81d5))


### Changed

* **pipeline:** simplify docs output to flat repo-based structure ([43b997e](https://github.com/bamr87/README/commit/43b997e5fa87a7d91e4da8e17662a55759aa8591))
* **pipeline:** simplify docs output to flat repo-based structure ([7619334](https://github.com/bamr87/README/commit/7619334984d204c8abe9b2f226438f2b5daaf16e))


### Documentation

* add CHANGELOG.md ([#37](https://github.com/bamr87/README/issues/37)) ([3ab2d89](https://github.com/bamr87/README/commit/3ab2d8914599dfa875b86fc74e26fb168b95747b))
* add feature catalog, constitution and amendments; link PRD ([#42](https://github.com/bamr87/README/issues/42)) ([b19b736](https://github.com/bamr87/README/commit/b19b736d8e3be669e9681a946d2048de4af896ab))
* add report top-issues, unit tests, auto-merge option and PR top-issue comments ([dbc1334](https://github.com/bamr87/README/commit/dbc1334fa27a4195581db6835601957b3136beaf))
* add tag normalization, h1 fixer, whitespace fixer, report comments to workflows ([40b0976](https://github.com/bamr87/README/commit/40b097654847ed70adb8708fca91cbc04365da2c))
* **index:** simplify docs output and add wargames page ([b873695](https://github.com/bamr87/README/commit/b8736958d5455e39d788a233ff9cf994c8c50219))
* PLAN.md — v3 platform redesign plan (audit, check catalogue, roadmap) ([#24](https://github.com/bamr87/README/issues/24)) ([2ae1e2b](https://github.com/bamr87/README/commit/2ae1e2b8597e1482f091a4c6cd989bc7f55253ae))
* **readme:** align README with the portfolio standard ([#36](https://github.com/bamr87/README/issues/36)) ([c86e587](https://github.com/bamr87/README/commit/c86e587ff114a8ba144179de1b49ffa18e961c1a))
* remove outdated repository URLs from the list ([e281975](https://github.com/bamr87/README/commit/e28197548edb3d05c70c85d1ec92b056ea12d1ec))

## Changelog

All notable changes to this project are documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## Unreleased

### Added

- `CHANGELOG.md`, in Keep a Changelog format.

## History

No versions have been tagged yet. The project started on 2025-11-10 and has 71 commits on `main`. The most recent changes:

- 2026-10-17: docs(readme): align README with the portfolio standard ([#36](https://github.com/bamr87/README/pull/36))
- 2026-10-14: ci: pin standard-ci to @v2 (needs the v2 tag) ([#35](https://github.com/bamr87/README/pull/35))
- 2026-10-12: chore(evolve): weekly AI improvement pass ([#34](https://github.com/bamr87/README/pull/34)) (×3)
- 2026-10-12: Automated docs aggregation + context refresh (×10)
- 2026-10-07: fix(ci): stage aggregated corpus before the tracked-surfaces gate ([#32](https://github.com/bamr87/README/pull/32))
- 2026-10-04: fix(context): rebuild the context pyramid so fact counts match the tracked corpus ([#33](https://github.com/bamr87/README/pull/33))
- 2026-09-28: build(docker): harmonize Docker configuration to the fleet standard ([#30](https://github.com/bamr87/README/pull/30))
- 2026-09-28: test(ci): gate tracked-surface integrity on PRs, and cover the gate ([#29](https://github.com/bamr87/README/pull/29))
- 2026-09-19: feat(docs): Add comprehensive setup and testing guides for Docker-first development in barodybroject
- 2026-09-14: fix: stop .gitignore swallowing corpus files; green main's gates ([#28](https://github.com/bamr87/README/pull/28))
- 2026-09-14: fix(ci): stop the oneline gate policing the generated docs/ corpus ([#26](https://github.com/bamr87/README/pull/26))
- 2026-09-14: feat(survey): fleet documentation survey, plus the autonomous-merge design ([#25](https://github.com/bamr87/README/pull/25))
- …and 27 earlier changes.

The full record is in the [commit history](https://github.com/bamr87/README/commits/main) and the [merged pull requests](https://github.com/bamr87/README/pulls?q=is%3Apr+is%3Amerged).
