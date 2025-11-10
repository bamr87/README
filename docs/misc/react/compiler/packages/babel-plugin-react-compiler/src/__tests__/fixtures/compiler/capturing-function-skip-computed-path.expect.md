---
title: Capturing Function Skip Computed Path.Expect
category: misc
tags:
- javascript
- docker
last_updated: null
source_file: capturing-function-skip-computed-path.expect.md
---
## Input

```javascript
function StoreLandingUnseenGiftModalContainer(a) {
  const giftsSeen = {a};
  return (gift => (gift.id ? giftsSeen[gift.id] : false))();
}

export const FIXTURE_ENTRYPOINT = {
  fn: StoreLandingUnseenGiftModalContainer,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function StoreLandingUnseenGiftModalContainer(a) {
  const $ = _c(2);
  let t0;
  if ($[0] !== a) {
    const giftsSeen = { a };
    t0 = ((gift) => (gift.id ? giftsSeen[gift.id] : false))();
    $[0] = a;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: StoreLandingUnseenGiftModalContainer,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      