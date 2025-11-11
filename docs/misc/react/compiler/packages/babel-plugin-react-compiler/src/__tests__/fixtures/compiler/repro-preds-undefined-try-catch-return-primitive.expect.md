---
title: Repro Preds Undefined Try Catch Return Primitive.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: repro-preds-undefined-try-catch-return-primitive.expect.md
---
# Repro Preds Undefined Try Catch Return Primitive.Expect

## Input

```javascript
// @enableAssumeHooksFollowRulesOfReact @enableTransitivelyFreezeFunctionExpressions

import {useMemo} from 'react';

const checkforTouchEvents = true;
function useSupportsTouchEvent() {
  return useMemo(() => {
    if (checkforTouchEvents) {
      try {
        document.createEvent('TouchEvent');
        return true;
      } catch {
        return false;
      }
    }
  }, []);
}

export const FIXTURE_ENTRYPOINT = {
  fn: useSupportsTouchEvent,
  params: [],
};

```

## Code

```javascript
// @enableAssumeHooksFollowRulesOfReact @enableTransitivelyFreezeFunctionExpressions

import { useMemo } from "react";

const checkforTouchEvents = true;
function useSupportsTouchEvent() {
  let t0;
  bb0: {
    if (checkforTouchEvents) {
      try {
        document.createEvent("TouchEvent");
        t0 = true;
        break bb0;
      } catch {
        t0 = false;
        break bb0;
      }
    }
    t0 = undefined;
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: useSupportsTouchEvent,
  params: [],
};

```

### Eval output
(kind: ok) true