---
category: misc
last_updated: null
source_file: for-of-iterator-of-immutable-collection.expect.md
summary: "```javascript\nfunction Router({title, mapping}) {\n  const array = [];\n\
  \  for (let entry of mapping.values()) {\n    array.push([title, entry]);\n  }\n\
  \  return array;\n}"
tags:
- javascript
title: For Of Iterator Of Immutable Collection.Expect
---

## Input

```javascript
function Router({title, mapping}) {
  const array = [];
  for (let entry of mapping.values()) {
    array.push([title, entry]);
  }
  return array;
}

const routes = new Map([
  ['about', '/about'],
  ['contact', '/contact'],
]);

export const FIXTURE_ENTRYPOINT = {
  fn: Router,
  params: [],
  sequentialRenders: [
    {
      title: 'Foo',
      mapping: routes,
    },
    {
      title: 'Bar',
      mapping: routes,
    },
  ],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Router(t0) {
  const $ = _c(3);
  const { title, mapping } = t0;
  let array;
  if ($[0] !== mapping || $[1] !== title) {
    array = [];
    for (const entry of mapping.values()) {
      array.push([title, entry]);
    }
    $[0] = mapping;
    $[1] = title;
    $[2] = array;
  } else {
    array = $[2];
  }
  return array;
}

const routes = new Map([
  ["about", "/about"],
  ["contact", "/contact"],
]);

export const FIXTURE_ENTRYPOINT = {
  fn: Router,
  params: [],
  sequentialRenders: [
    {
      title: "Foo",
      mapping: routes,
    },
    {
      title: "Bar",
      mapping: routes,
    },
  ],
};

```
      
### Eval output
(kind: ok) [["Foo","/about"],["Foo","/contact"]]
[["Bar","/about"],["Bar","/contact"]]