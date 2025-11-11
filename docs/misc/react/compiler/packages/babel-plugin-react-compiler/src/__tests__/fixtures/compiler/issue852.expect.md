---
title: Issue852.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: issue852.expect.md
---
# Issue852.Expect

## Input

```javascript
function Component(c) {
  let x = {c};
  mutate(x);
  let a = x;
  let b = a;
}

```

## Code

```javascript
function Component(c) {
  const x = { c };
  mutate(x);
}

```
