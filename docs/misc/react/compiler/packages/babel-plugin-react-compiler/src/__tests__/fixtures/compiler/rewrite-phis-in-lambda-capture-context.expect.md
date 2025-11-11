---
title: Rewrite Phis In Lambda Capture Context.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: rewrite-phis-in-lambda-capture-context.expect.md
---
# Rewrite Phis In Lambda Capture Context.Expect

## Input

```javascript
function Component() {
  const x = 4;

  const get4 = () => {
    while (bar()) {
      if (baz) {
        bar();
      }
    }
    return () => x;
  };

  return get4;
}

```

## Code

```javascript
function Component() {
  const get4 = _temp2;
  return get4;
}
function _temp2() {
  while (bar()) {
    if (baz) {
      bar();
    }
  }
  return _temp;
}
function _temp() {
  return 4;
}

```
