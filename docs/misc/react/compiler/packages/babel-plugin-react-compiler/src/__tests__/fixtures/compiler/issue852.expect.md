---
category: misc
last_updated: null
source_file: issue852.expect.md
summary: "```javascript\nfunction Component(c) {\n  let x = {c};\n  mutate(x);\n \
  \ let a = x;\n  let b = a;\n}"
tags:
- javascript
title: Issue852.Expect
---

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
      