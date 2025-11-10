---
category: misc
last_updated: null
source_file: optional-computed-load-static.expect.md
summary: "```javascript\nfunction Component(props) {\n  let x = a?.b.c[0];\n  return\
  \ x;\n}"
tags:
- javascript
title: Optional Computed Load Static.Expect
---

## Input

```javascript
function Component(props) {
  let x = a?.b.c[0];
  return x;
}

```

## Code

```javascript
function Component(props) {
  const x = a?.b.c[0];
  return x;
}

```
      