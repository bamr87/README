---
title: Block Scoping Switch Dead Code.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: block-scoping-switch-dead-code.expect.md
---
# Block Scoping Switch Dead Code.Expect

## Input

```javascript
function useHook(a, b) {
  switch (a) {
    case 1:
      if (b == null) {
        return;
      }
      console.log(b);
      break;
    case 2:
      return;
    default:
      return;
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: useHook,
  params: [1, 'foo'],
};

```

## Code

```javascript
function useHook(a, b) {
  bb0: switch (a) {
    case 1: {
      if (b == null) {
        return;
      }

      console.log(b);
      break bb0;
    }
    case 2: {
      return;
    }
    default: {
      return;
    }
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: useHook,
  params: [1, "foo"],
};

```

### Eval output
(kind: ok)
logs: ['foo']