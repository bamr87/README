---
title: Rules Of Hooks 69521D94Fa03.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: rules-of-hooks-69521d94fa03.expect.md
---
# Rules Of Hooks 69521D94Fa03.Expect

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
