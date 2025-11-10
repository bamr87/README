---
category: misc
last_updated: null
source_file: useMemo-return-empty.expect.md
summary: "```javascript\nfunction component(a) {\n  let x = useMemo(() => {\n    mutate(a);\n\
  \  }, []);\n  return x;\n}"
tags:
- javascript
title: Usememo Return Empty.Expect
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
      