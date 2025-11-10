---
category: misc
last_updated: null
source_file: useEffect-method-call.expect.md
summary: "```javascript\nlet x = {};\nfunction Component() {\n  React.useEffect(()\
  \ => {\n    x.foo = 1;\n  });\n}"
tags:
- javascript
title: Useeffect Method Call.Expect
---

## Input

```javascript
let x = {};
function Component() {
  React.useEffect(() => {
    x.foo = 1;
  });
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
};

```

## Code

```javascript
let x = {};
function Component() {
  React.useEffect(_temp);
}
function _temp() {
  x.foo = 1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
};

```
      
### Eval output
(kind: ok) 