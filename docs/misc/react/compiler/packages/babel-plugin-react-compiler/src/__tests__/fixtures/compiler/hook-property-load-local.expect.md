---
category: misc
last_updated: null
source_file: hook-property-load-local.expect.md
summary: '```javascript

  function useFoo() {}'
tags:
- javascript
title: Hook Property Load Local.Expect
---

## Input

```javascript
function useFoo() {}

function Foo() {
  let name = useFoo.name;
  console.log(name);
  return name;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [],
};

```

## Code

```javascript
function useFoo() {}

function Foo() {
  const name = useFoo.name;
  console.log(name);
  return name;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [],
};

```
      
### Eval output
(kind: ok) "useFoo"
logs: ['useFoo']