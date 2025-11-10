---
category: misc
last_updated: null
source_file: destructure-param-string-literal-key-invalid-identifier.expect.md
summary: "```javascript\nfunction foo({'datafoobar': dataTestID}) {\n  return dataTestID;\n\
  }"
tags:
- javascript
- testing
title: Destructure Param String Literal Key Invalid Identifier.Expect
---

## Input

```javascript
function foo({'data-foo-bar': dataTestID}) {
  return dataTestID;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [{'data-foo-bar': {}}],
  isComponent: false,
};

```

## Code

```javascript
function foo(t0) {
  const { "data-foo-bar": dataTestID } = t0;
  return dataTestID;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [{ "data-foo-bar": {} }],
  isComponent: false,
};

```
      
### Eval output
(kind: ok) {}