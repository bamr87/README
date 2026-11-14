---
source_file: emulate/packages/example-pack/README.md
source_repo: bamr87/rewind-arcade
source_url: https://github.com/bamr87/rewind-arcade/blob/main/emulate/packages/example-pack/README.md
title: example-pack
---
# example-pack

> A worked example of a retro-pi extension pack: a reusable bundle of system manifests you can share or keep in a separate repo.

## Layout

- `pack.yaml` — pack metadata, including what it `provides`
- `systems/` — manifests using exactly the same schema as `config/systems/`

## Install

```sh
cp packages/example-pack/systems/*.yaml config/systems/
./bin/retropi systems enable wonderswan
./bin/retropi cores install --system wonderswan
./bin/retropi build
```

## Make your own

```sh
./bin/retropi extend pack my-pack
./bin/retropi extend list
```
