---
title: Rules Of Hooks 0592Bd574811.Expect
category: misc
tags:
- javascript
- testing
last_updated: null
source_file: rules-of-hooks-0592bd574811.expect.md
---
## Input

```javascript
// @compilationMode:"infer"
// Regression test for some internal code.
// This shows how the "callback rule" is more relaxed,
// and doesn't kick in unless we're confident we're in
// a component or a hook.
function makeListener(instance) {
  each(pixelsWithInferredEvents, pixel => {
    if (useExtendedSelector(pixel.id) && extendedButton) {
      foo();
    }
  });
}

```

## Code

```javascript
// @compilationMode:"infer"
// Regression test for some internal code.
// This shows how the "callback rule" is more relaxed,
// and doesn't kick in unless we're confident we're in
// a component or a hook.
function makeListener(instance) {
  each(pixelsWithInferredEvents, (pixel) => {
    if (useExtendedSelector(pixel.id) && extendedButton) {
      foo();
    }
  });
}

```
      