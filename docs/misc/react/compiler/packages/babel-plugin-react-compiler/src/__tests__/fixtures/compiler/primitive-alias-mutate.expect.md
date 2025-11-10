---
category: misc
last_updated: null
source_file: primitive-alias-mutate.expect.md
summary: "```javascript\nfunction component(a) {\n  let x = 'foo';\n  if (a) {\n \
  \   x = 'bar';\n  } else {\n    x = 'baz';\n  }\n  let y = x;\n  mutate(y);\n  return\
  \ y;\n}"
tags:
- javascript
title: Primitive Alias Mutate.Expect
---

## Input

```javascript
function component(a) {
  let x = 'foo';
  if (a) {
    x = 'bar';
  } else {
    x = 'baz';
  }
  let y = x;
  mutate(y);
  return y;
}

```

## Code

```javascript
function component(a) {
  let x;
  if (a) {
    x = "bar";
  } else {
    x = "baz";
  }

  const y = x;
  mutate(y);
  return y;
}

```
      