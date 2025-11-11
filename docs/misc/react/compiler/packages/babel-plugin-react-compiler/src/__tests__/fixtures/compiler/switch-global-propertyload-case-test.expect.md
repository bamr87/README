---
title: Switch Global Propertyload Case Test.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: switch-global-propertyload-case-test.expect.md
---
# Switch Global Propertyload Case Test.Expect

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
