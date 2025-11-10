---
title: Optional Computed Load Static.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: optional-computed-load-static.expect.md
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
      