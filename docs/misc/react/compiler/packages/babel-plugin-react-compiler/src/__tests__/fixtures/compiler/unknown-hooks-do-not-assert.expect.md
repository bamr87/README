---
category: misc
last_updated: null
source_file: unknown-hooks-do-not-assert.expect.md
summary: '```javascript

  // Forget currently bails out when it detects a potential mutation (Effect.Mutate)

  // to an immutable value. This should not apply to unknown / untyped hooks.

  function Component(props) {...'
tags:
- javascript
title: Unknown Hooks Do Not Assert.Expect
---

## Input

```javascript
// Forget currently bails out when it detects a potential mutation (Effect.Mutate)
// to an immutable value. This should not apply to unknown / untyped hooks.
function Component(props) {
  const x = useUnknownHook1(props);
  const y = useUnknownHook2(x);
  return y;
}

```

## Code

```javascript
// Forget currently bails out when it detects a potential mutation (Effect.Mutate)
// to an immutable value. This should not apply to unknown / untyped hooks.
function Component(props) {
  const x = useUnknownHook1(props);
  const y = useUnknownHook2(x);
  return y;
}

```
      