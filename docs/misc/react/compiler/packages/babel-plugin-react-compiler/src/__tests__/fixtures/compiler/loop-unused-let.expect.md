---
category: misc
last_updated: null
source_file: loop-unused-let.expect.md
summary: "```javascript\nfunction useFoo() {\n  while (1) {\n    let foo;\n  }\n}"
tags:
- javascript
title: Loop Unused Let.Expect
---

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
      