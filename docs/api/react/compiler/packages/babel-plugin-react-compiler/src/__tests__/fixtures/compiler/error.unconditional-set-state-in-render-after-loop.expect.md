---
title: Error.Unconditional Set State In Render After Loop.Expect
category: api
tags:
- javascript
- api
last_updated: null
source_file: error.unconditional-set-state-in-render-after-loop.expect.md
---
# Error.Unconditional Set State In Render After Loop.Expect

## Input

```javascript
// @validateNoSetStateInRender
function Component(props) {
  const [state, setState] = useState(false);
  for (const _ of props) {
  }
  setState(true);
  return state;
}

```


## Error

```
Found 1 error:

Error: Calling setState during render may trigger an infinite loop

Calling setState during render will trigger another render, and can lead to infinite loops. (https://react.dev/reference/react/useState).

error.unconditional-set-state-in-render-after-loop.ts:6:2
  4 |   for (const _ of props) {
  5 |   }
> 6 |   setState(true);
    |   ^^^^^^^^ Found setState() in render
  7 |   return state;
  8 | }
  9 |
```

