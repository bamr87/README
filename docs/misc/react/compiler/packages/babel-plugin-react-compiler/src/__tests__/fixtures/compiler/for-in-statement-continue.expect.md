---
category: misc
last_updated: null
source_file: for-in-statement-continue.expect.md
summary: "```javascript\nfunction Component(props) {\n  let x;\n  const object = {...props.value};\n\
  \  for (const y in object) {\n    if (y === 'continue') {\n      continue;\n   \
  \ }\n    x = object[y];\n  }\n  return x;\n}"
tags:
- javascript
title: For In Statement Continue.Expect
---

## Input

```javascript
function Component(props) {
  let x;
  const object = {...props.value};
  for (const y in object) {
    if (y === 'continue') {
      continue;
    }
    x = object[y];
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{value: {a: 'a', continue: 'skip', b: 'hello!'}}],
  sequentialRenders: [
    {value: {a: 'a', continue: 'skip', b: 'hello!'}},
    {value: {a: 'a', continue: 'skip', b: 'hello!'}},
    {value: {a: 'skip!', continue: true}},
    {value: {a: 'a', continue: 'skip', b: 'hello!'}},
    {value: {a: 'skip!', continue: true}},
    {value: {a: 'a', continue: 'skip', b: 'hello!'}},
    {value: {a: 'skip!', continue: true}},
    {value: {a: 'skip!', continue: true}},
  ],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(2);
  let x;
  let t0;
  if ($[0] !== props.value) {
    t0 = { ...props.value };
    $[0] = props.value;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  const object = t0;
  for (const y in object) {
    if (y === "continue") {
      continue;
    }

    x = object[y];
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ value: { a: "a", continue: "skip", b: "hello!" } }],
  sequentialRenders: [
    { value: { a: "a", continue: "skip", b: "hello!" } },
    { value: { a: "a", continue: "skip", b: "hello!" } },
    { value: { a: "skip!", continue: true } },
    { value: { a: "a", continue: "skip", b: "hello!" } },
    { value: { a: "skip!", continue: true } },
    { value: { a: "a", continue: "skip", b: "hello!" } },
    { value: { a: "skip!", continue: true } },
    { value: { a: "skip!", continue: true } },
  ],
};

```
      
### Eval output
(kind: ok) "hello!"
"hello!"
"skip!"
"hello!"
"skip!"
"hello!"
"skip!"
"skip!"