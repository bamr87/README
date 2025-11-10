---
category: misc
last_updated: null
source_file: use-memo-noemit.expect.md
summary: '```javascript

  // @noEmit'
tags:
- javascript
title: Use Memo Noemit.Expect
---

## Input

```javascript
// @noEmit

function Foo() {
  'use memo';
  return <button onClick={() => alert('hello!')}>Click me!</button>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [],
};

```

## Code

```javascript
// @noEmit

function Foo() {
  "use memo";
  return <button onClick={() => alert("hello!")}>Click me!</button>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [],
};

```
      
### Eval output
(kind: ok) <button>Click me!</button>