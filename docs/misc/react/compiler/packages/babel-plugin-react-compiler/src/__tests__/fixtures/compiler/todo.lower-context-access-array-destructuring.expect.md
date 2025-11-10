---
category: misc
last_updated: null
source_file: todo.lower-context-access-array-destructuring.expect.md
summary: "```javascript\n// @lowerContextAccess\nfunction App() {\n  const [foo, bar]\
  \ = useContext(MyContext);\n  return <Bar foo={foo} bar={bar} />;\n}"
tags:
- javascript
title: Todo.Lower Context Access Array Destructuring.Expect
---

## Input

```javascript
// @lowerContextAccess
function App() {
  const [foo, bar] = useContext(MyContext);
  return <Bar foo={foo} bar={bar} />;
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @lowerContextAccess
function App() {
  const $ = _c(3);
  const [foo, bar] = useContext(MyContext);
  let t0;
  if ($[0] !== bar || $[1] !== foo) {
    t0 = <Bar foo={foo} bar={bar} />;
    $[0] = bar;
    $[1] = foo;
    $[2] = t0;
  } else {
    t0 = $[2];
  }
  return t0;
}

```
      