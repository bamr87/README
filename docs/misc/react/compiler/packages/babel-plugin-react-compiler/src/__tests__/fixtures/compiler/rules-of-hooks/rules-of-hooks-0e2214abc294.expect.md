---
category: misc
last_updated: null
source_file: rules-of-hooks-0e2214abc294.expect.md
summary: "```javascript\n// Valid because exceptions abort rendering\nfunction RegressionTest()\
  \ {\n  if (page == null) {\n    throw new Error('oh no!');\n  }\n  useState();\n\
  }"
tags:
- javascript
- testing
title: Rules Of Hooks 0E2214Abc294.Expect
---

## Input

```javascript
// Valid because exceptions abort rendering
function RegressionTest() {
  if (page == null) {
    throw new Error('oh no!');
  }
  useState();
}

```

## Code

```javascript
// Valid because exceptions abort rendering
function RegressionTest() {
  if (page == null) {
    throw new Error("oh no!");
  }

  useState();
}

```
      