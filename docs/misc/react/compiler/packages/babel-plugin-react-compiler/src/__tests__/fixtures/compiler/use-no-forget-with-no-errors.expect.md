---
category: misc
last_updated: null
source_file: use-no-forget-with-no-errors.expect.md
summary: "```javascript\nfunction Component() {\n  'use no forget';\n  return <div>Hello\
  \ World</div>;\n}"
tags:
- javascript
title: Use No Forget With No Errors.Expect
---

## Input

```javascript
function Component() {
  'use no forget';
  return <div>Hello World</div>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
  isComponent: true,
};

```

## Code

```javascript
function Component() {
  "use no forget";
  return <div>Hello World</div>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
  isComponent: true,
};

```
      
### Eval output
(kind: ok) <div>Hello World</div>