---
category: misc
last_updated: null
source_file: ssa-shadowing.expect.md
summary: '```javascript

  function log() {}'
tags:
- javascript
- testing
title: Ssa Shadowing.Expect
---

## Input

```javascript
function log() {}

function Foo(cond) {
  let str = '';
  if (cond) {
    let str = 'other test';
    log(str);
  } else {
    str = 'fallthrough test';
  }
  log(str);
}

```

## Code

```javascript
function log() {}

function Foo(cond) {
  let str = "";
  if (cond) {
    log("other test");
  } else {
    str = "fallthrough test";
  }

  log(str);
}

```
      