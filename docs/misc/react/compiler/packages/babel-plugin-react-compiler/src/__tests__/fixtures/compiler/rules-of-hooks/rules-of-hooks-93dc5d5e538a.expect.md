---
category: misc
last_updated: null
source_file: rules-of-hooks-93dc5d5e538a.expect.md
summary: "```javascript\n// Valid because the loop doesn't change the order of hooks\
  \ calls.\nfunction RegressionTest() {\n  const res = [];\n  const additionalCond\
  \ = true;\n  for (let i = 0; i !== 10 && additionalCo..."
tags:
- javascript
- testing
title: Rules Of Hooks 93Dc5D5E538A.Expect
---

## Input

```javascript
// Valid because the loop doesn't change the order of hooks calls.
function RegressionTest() {
  const res = [];
  const additionalCond = true;
  for (let i = 0; i !== 10 && additionalCond; ++i) {
    res.push(i);
  }
  React.useLayoutEffect(() => {});
}

```

## Code

```javascript
// Valid because the loop doesn't change the order of hooks calls.
function RegressionTest() {
  const res = [];

  for (let i = 0; i !== 10 && true; ++i) {
    res.push(i);
  }

  React.useLayoutEffect(_temp);
}
function _temp() {}

```
      