---
title: Custom Opt Out Directive.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: custom-opt-out-directive.expect.md
---
# Custom Opt Out Directive.Expect

## Input

```javascript
// @customOptOutDirectives:["use todo memo"]
function Component() {
  'use todo memo';
  return <div>hello world!</div>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
};

```

## Code

```javascript
// @customOptOutDirectives:["use todo memo"]
function Component() {
  "use todo memo";
  return <div>hello world!</div>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
};

```

### Eval output
(kind: ok) <div>hello world!</div>