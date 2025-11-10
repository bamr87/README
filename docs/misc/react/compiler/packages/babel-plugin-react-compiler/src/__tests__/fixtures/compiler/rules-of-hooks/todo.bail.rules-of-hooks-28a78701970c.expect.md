---
title: Todo.Bail.Rules Of Hooks 28A78701970C.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: todo.bail.rules-of-hooks-28a78701970c.expect.md
---
## Input

```javascript
// @skip
// Unsupported input

// Valid because hooks can be used in anonymous function arguments to
// React.memo.
const MemoizedFunction = React.memo(props => {
  useHook();
  return <button {...props} />;
});

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @skip
// Unsupported input

// Valid because hooks can be used in anonymous function arguments to
// React.memo.
const MemoizedFunction = React.memo((props) => {
  const $ = _c(2);
  useHook();
  let t0;
  if ($[0] !== props) {
    t0 = <button {...props} />;
    $[0] = props;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
});

```
      