---
title: Todo.Bail.Rules Of Hooks Fadd52C1E460.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: todo.bail.rules-of-hooks-fadd52c1e460.expect.md
---
# Todo.Bail.Rules Of Hooks Fadd52C1E460.Expect

## Input

```javascript
// @skip
// Unsupported input

// Currently invalid.
// These are variations capturing the current heuristic--
// we only allow hooks in PascalCase or useFoo functions.
// We *could* make some of these valid. But before doing it,
// consider specific cases documented above that contain reasoning.
function a() {
  useState();
}
const whatever = function b() {
  useState();
};
const c = () => {
  useState();
};
let d = () => useState();
e = () => {
  useState();
};
({
  f: () => {
    useState();
  },
});
({
  g() {
    useState();
  },
});
const {
  j = () => {
    useState();
  },
} = {};
({
  k = () => {
    useState();
  },
} = {});

```

## Code

```javascript
// @skip
// Unsupported input

// Currently invalid.
// These are variations capturing the current heuristic--
// we only allow hooks in PascalCase or useFoo functions.
// We *could* make some of these valid. But before doing it,
// consider specific cases documented above that contain reasoning.
function a() {
  useState();
}

const whatever = function b() {
  useState();
};

const c = () => {
  useState();
};

let d = () => {
  return useState();
};
e = () => {
  useState();
};

({
  f: () => {
    useState();
  },
});
({
  g() {
    useState();
  },
});
const {
  j = () => {
    useState();
  },
} = {};
({
  k = () => {
    useState();
  },
} = {});

```
