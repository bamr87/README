---
category: misc
last_updated: null
source_file: repro-dont-add-hook-guards-on-retry.expect.md
summary: '```javascript

  // @flow @enableEmitHookGuards @panicThreshold:"none" @enableFire'
tags:
- javascript
title: Repro Dont Add Hook Guards On Retry.Expect
---

## Input

```javascript
// @flow @enableEmitHookGuards @panicThreshold:"none" @enableFire

component Foo(useDynamicHook) {
  useDynamicHook();
  return <div>hello world</div>;
}

```

## Code

```javascript
function Foo({
  useDynamicHook,
}: $ReadOnly<{ useDynamicHook: any }>): React.Node {
  useDynamicHook();
  return <div>hello world</div>;
}

```
      
### Eval output
(kind: exception) Fixture not implemented