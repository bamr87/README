---
title: Nested Scopes Hook Call.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: nested-scopes-hook-call.expect.md
---
# Nested Scopes Hook Call.Expect

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
