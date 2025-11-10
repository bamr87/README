---
category: misc
last_updated: null
source_file: valid-set-state-in-useEffect-from-ref.expect.md
summary: '```javascript

  // @validateNoSetStateInEffects

  import {useState, useRef, useEffect} from ''react'';'
tags:
- javascript
title: Valid Set State In Useeffect From Ref.Expect
---

## Input

```javascript
// @validateNoSetStateInEffects
import {useState, useRef, useEffect} from 'react';

function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useEffect(() => {
    const {height} = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  return tooltipHeight;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Tooltip,
  params: [],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @validateNoSetStateInEffects
import { useState, useRef, useEffect } from "react";

function Tooltip() {
  const $ = _c(2);
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);
  let t0;
  let t1;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = () => {
      const { height } = ref.current.getBoundingClientRect();
      setTooltipHeight(height);
    };
    t1 = [];
    $[0] = t0;
    $[1] = t1;
  } else {
    t0 = $[0];
    t1 = $[1];
  }
  useEffect(t0, t1);
  return tooltipHeight;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Tooltip,
  params: [],
};

```
      
### Eval output
(kind: exception) Cannot read properties of null (reading 'getBoundingClientRect')