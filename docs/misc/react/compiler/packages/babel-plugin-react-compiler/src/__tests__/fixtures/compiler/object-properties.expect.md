---
category: misc
last_updated: null
source_file: object-properties.expect.md
summary: "```javascript\nfunction foo(a, b, c) {\n  const x = a.x;\n  const y = {...b.c.d};\n\
  \  y.z = c.d.e;\n  foo(a.b.c);\n  [a.b.c];\n}"
tags:
- javascript
title: Object Properties.Expect
---

## Input

```javascript
function foo(a, b, c) {
  const x = a.x;
  const y = {...b.c.d};
  y.z = c.d.e;
  foo(a.b.c);
  [a.b.c];
}

```

## Code

```javascript
function foo(a, b, c) {
  const y = { ...b.c.d };
  y.z = c.d.e;
  foo(a.b.c);
}

```
      