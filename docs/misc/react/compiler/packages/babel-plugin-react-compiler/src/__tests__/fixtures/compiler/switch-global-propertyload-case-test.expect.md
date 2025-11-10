---
category: misc
last_updated: null
source_file: switch-global-propertyload-case-test.expect.md
summary: "```javascript\nfunction Component(props) {\n  switch (props.value) {\n \
  \   case Global.Property: {\n      return true;\n    }\n    default: {\n      return\
  \ false;\n    }\n  }\n}"
tags:
- javascript
title: Switch Global Propertyload Case Test.Expect
---

## Input

```javascript
function Component(props) {
  switch (props.value) {
    case Global.Property: {
      return true;
    }
    default: {
      return false;
    }
  }
}

```

## Code

```javascript
function Component(props) {
  switch (props.value) {
    case Global.Property: {
      return true;
    }
    default: {
      return false;
    }
  }
}

```
      