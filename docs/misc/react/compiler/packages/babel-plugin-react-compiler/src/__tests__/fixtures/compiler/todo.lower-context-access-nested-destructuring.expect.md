---
title: Todo.Lower Context Access Nested Destructuring.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: todo.lower-context-access-nested-destructuring.expect.md
---
## Input

```javascript
// @lowerContextAccess
function App() {
  const {
    joe: {foo},
    bar,
  } = useContext(MyContext);
  return <Bar foo={foo} bar={bar} />;
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @lowerContextAccess
function App() {
  const $ = _c(3);
  const { joe: t0, bar } = useContext(MyContext);
  const { foo } = t0;
  let t1;
  if ($[0] !== bar || $[1] !== foo) {
    t1 = <Bar foo={foo} bar={bar} />;
    $[0] = bar;
    $[1] = foo;
    $[2] = t1;
  } else {
    t1 = $[2];
  }
  return t1;
}

```
      