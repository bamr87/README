---
source_file: _design-system/components/feedback/Callout.prompt.md
source_repo: bamr87/zer0-mistakes
source_url: https://github.com/bamr87/zer0-mistakes/blob/main/_design-system/components/feedback/Callout.prompt.md
title: Callout.Prompt
---
Inline notice for docs and posts — the rendered form of Obsidian `> [!note]` callouts.

```jsx
<Callout tone="tip" title="Who this is for">
  Anyone using an AI coding assistant. Skip it if you don't.
</Callout>
<Callout tone="warning">Admin pages require theme version ≥ 0.22.10.</Callout>
```

Tones: `note` (primary), `tip` (success), `warning`, `danger`. Each ships a default icon and label; override with `title` and `icon` (Bootstrap Icon name, no `bi-` prefix).
