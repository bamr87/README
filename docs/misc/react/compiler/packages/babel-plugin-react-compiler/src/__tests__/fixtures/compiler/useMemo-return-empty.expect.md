---
title: Usememo Return Empty.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: useMemo-return-empty.expect.md
---
## Input

```javascript
function component(a) {
  let x = useMemo(() => {
    mutate(a);
  }, []);
  return x;
}

```

## Code

```javascript
function component(a) {
  mutate(a);
}

```
      