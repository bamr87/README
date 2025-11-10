---
category: misc
last_updated: null
source_file: transitive-alias-fields.expect.md
summary: "```javascript\nfunction component() {\n  let x = {};\n  let p = {};\n  let\
  \ q = {};\n  let y = {};"
tags:
- javascript
title: Transitive Alias Fields.Expect
---

## Input

```javascript
function component() {
  let x = {};
  let p = {};
  let q = {};
  let y = {};

  x.y = y;
  p.y = x.y;
  q.y = p.y;

  mutate(q);
}

```

## Code

```javascript
function component() {
  const x = {};
  const p = {};
  const q = {};
  const y = {};

  x.y = y;
  p.y = x.y;
  q.y = p.y;

  mutate(q);
}

```
      