---
title: Loop Unused Let.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: loop-unused-let.expect.md
---
# Loop Unused Let.Expect

## Input

```javascript
function useFoo() {
  while (1) {
    let foo;
  }
}

```

## Code

```javascript
function useFoo() {
  while (1) {}
}

```
