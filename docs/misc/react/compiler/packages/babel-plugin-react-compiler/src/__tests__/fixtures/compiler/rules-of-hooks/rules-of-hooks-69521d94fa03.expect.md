---
category: misc
last_updated: null
source_file: rules-of-hooks-69521d94fa03.expect.md
summary: "```javascript\n// Valid because the neither the condition nor the loop affect\
  \ the hook call.\nfunction App(props) {\n  const someObject = {propA: true};\n \
  \ for (const propName in someObject) {\n    if (pro..."
tags:
- javascript
title: Rules Of Hooks 69521D94Fa03.Expect
---

## Input

```javascript
// Valid because the neither the condition nor the loop affect the hook call.
function App(props) {
  const someObject = {propA: true};
  for (const propName in someObject) {
    if (propName === true) {
    } else {
    }
  }
  const [myState, setMyState] = useState(null);
}

```

## Code

```javascript
// Valid because the neither the condition nor the loop affect the hook call.
function App(props) {
  const someObject = { propA: true };
  for (const propName in someObject) {
    if (propName === true) {
    }
  }

  useState(null);
}

```
      