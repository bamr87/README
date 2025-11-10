---
category: misc
last_updated: null
source_file: todo.lower-context-access-property-load.expect.md
summary: "```javascript\n// @lowerContextAccess\nfunction App() {\n  const context\
  \ = useContext(MyContext);\n  const foo = context.foo;\n  const bar = context.bar;\n\
  \  return <Bar foo={foo} bar={bar} />;\n}"
tags:
- javascript
title: Todo.Lower Context Access Property Load.Expect
---

## Input

```javascript
// @lowerContextAccess
function App() {
  const context = useContext(MyContext);
  const foo = context.foo;
  const bar = context.bar;
  return <Bar foo={foo} bar={bar} />;
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @lowerContextAccess
function App() {
  const $ = _c(3);
  const context = useContext(MyContext);
  const foo = context.foo;
  const bar = context.bar;
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
      