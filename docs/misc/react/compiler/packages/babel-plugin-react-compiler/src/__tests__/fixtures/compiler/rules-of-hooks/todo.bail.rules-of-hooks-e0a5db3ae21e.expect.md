---
category: misc
last_updated: null
source_file: todo.bail.rules-of-hooks-e0a5db3ae21e.expect.md
summary: '```javascript

  // @skip

  // Unsupported input'
tags:
- javascript
title: Todo.Bail.Rules Of Hooks E0A5Db3Ae21E.Expect
---

## Input

```javascript
// @skip
// Unsupported input

// Valid because hooks can call hooks.
function useHook() {
  useState();
}
const whatever = function useHook() {
  useState();
};
const useHook1 = () => {
  useState();
};
let useHook2 = () => useState();
useHook2 = () => {
  useState();
};
({
  useHook: () => {
    useState();
  },
});
({
  useHook() {
    useState();
  },
});
const {
  useHook3 = () => {
    useState();
  },
} = {};
({
  useHook = () => {
    useState();
  },
} = {});
Namespace.useHook = () => {
  useState();
};

```

## Code

```javascript
// @skip
// Unsupported input

// Valid because hooks can call hooks.
function useHook() {
  useState();
}

const whatever = function useHook() {
  useState();
};

const useHook1 = () => {
  useState();
};

let useHook2 = () => {
  return useState();
};
useHook2 = () => {
  useState();
};

({
  useHook: () => {
    useState();
  },
});
({
  useHook() {
    useState();
  },
});
const {
  useHook3 = () => {
    useState();
  },
} = {};
({
  useHook = () => {
    useState();
  },
} = {});
Namespace.useHook = () => {
  useState();
};

```
      