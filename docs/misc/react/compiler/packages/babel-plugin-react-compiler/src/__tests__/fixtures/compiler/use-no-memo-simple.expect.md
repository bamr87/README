---
category: misc
last_updated: null
source_file: use-no-memo-simple.expect.md
summary: "```javascript\nfunction Component(props) {\n  'use no memo';\n  let x =\
  \ [props.foo];\n  return <div x={x}>\"foo\"</div>;\n}"
tags:
- javascript
title: Use No Memo Simple.Expect
---

## Input

```javascript
function Component(props) {
  'use no memo';
  let x = [props.foo];
  return <div x={x}>"foo"</div>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{foo: 1}],
  isComponent: true,
};

```

## Code

```javascript
function Component(props) {
  "use no memo";
  let x = [props.foo];
  return <div x={x}>"foo"</div>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ foo: 1 }],
  isComponent: true,
};

```
      
### Eval output
(kind: ok) <div x="1">"foo"</div>