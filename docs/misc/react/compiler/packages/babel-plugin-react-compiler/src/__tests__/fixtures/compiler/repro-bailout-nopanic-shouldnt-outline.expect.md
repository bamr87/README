---
title: Repro Bailout Nopanic Shouldnt Outline.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: repro-bailout-nopanic-shouldnt-outline.expect.md
---
## Input

```javascript
// @panicThreshold(none)
'use no memo';

function Foo() {
  return <button onClick={() => alert('hello!')}>Click me!</button>;
}

```

## Code

```javascript
// @panicThreshold(none)
"use no memo";

function Foo() {
  return <button onClick={() => alert("hello!")}>Click me!</button>;
}

```
      
### Eval output
(kind: exception) Fixture not implemented