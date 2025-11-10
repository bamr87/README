---
category: misc
last_updated: null
source_file: nested-scopes-hook-call.expect.md
summary: "```javascript\nfunction component(props) {\n  let x = [];\n  let y = [];\n\
  \  y.push(useHook(props.foo));\n  x.push(y);\n  return x;\n}"
tags:
- javascript
title: Nested Scopes Hook Call.Expect
---

## Input

```javascript
function component(props) {
  let x = [];
  let y = [];
  y.push(useHook(props.foo));
  x.push(y);
  return x;
}

```

## Code

```javascript
function component(props) {
  const x = [];
  const y = [];
  y.push(useHook(props.foo));
  x.push(y);
  return x;
}

```
      