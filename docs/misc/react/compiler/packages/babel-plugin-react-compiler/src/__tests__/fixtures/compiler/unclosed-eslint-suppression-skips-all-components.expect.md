---
category: misc
last_updated: null
source_file: unclosed-eslint-suppression-skips-all-components.expect.md
summary: '```javascript

  // @panicThreshold:"none"'
tags:
- javascript
title: Unclosed Eslint Suppression Skips All Components.Expect
---

## Input

```javascript
// @panicThreshold:"none"

// unclosed disable rule should affect all components
/* eslint-disable react-hooks/rules-of-hooks */

function ValidComponent1(props) {
  return <div>Hello World!</div>;
}

function ValidComponent2(props) {
  return <div>{props.greeting}</div>;
}

```

## Code

```javascript
// @panicThreshold:"none"

// unclosed disable rule should affect all components
/* eslint-disable react-hooks/rules-of-hooks */

function ValidComponent1(props) {
  return <div>Hello World!</div>;
}

function ValidComponent2(props) {
  return <div>{props.greeting}</div>;
}

```
      
### Eval output
(kind: exception) Fixture not implemented