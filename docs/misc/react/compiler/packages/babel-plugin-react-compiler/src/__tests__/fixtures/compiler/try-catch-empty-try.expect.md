---
category: misc
last_updated: null
source_file: try-catch-empty-try.expect.md
summary: "```javascript\nfunction Component(props) {\n  let x = props.default;\n \
  \ try {\n  } catch (e) {\n    x = e;\n  }\n  return x;\n}"
tags:
- javascript
title: Try Catch Empty Try.Expect
---

## Input

```javascript
function Component(props) {
  let x = props.default;
  try {
  } catch (e) {
    x = e;
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{default: 42}],
};

```

## Code

```javascript
function Component(props) {
  const x = props.default;
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ default: 42 }],
};

```
      
### Eval output
(kind: ok) 42