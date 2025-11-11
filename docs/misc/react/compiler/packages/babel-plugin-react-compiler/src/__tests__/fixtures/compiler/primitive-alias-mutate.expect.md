---
title: Primitive Alias Mutate.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: primitive-alias-mutate.expect.md
---
# Primitive Alias Mutate.Expect

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
