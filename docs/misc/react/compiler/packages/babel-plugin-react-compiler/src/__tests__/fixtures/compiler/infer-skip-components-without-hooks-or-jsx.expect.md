---
category: misc
last_updated: null
source_file: infer-skip-components-without-hooks-or-jsx.expect.md
summary: "```javascript\n// @compilationMode:\"infer\"\n// This component is skipped\
  \ bc it doesn't call any hooks or\n// use JSX:\nfunction Component(props) {\n  return\
  \ render();\n}"
tags:
- javascript
title: Infer Skip Components Without Hooks Or Jsx.Expect
---

## Input

```javascript
// @compilationMode:"infer"
// This component is skipped bc it doesn't call any hooks or
// use JSX:
function Component(props) {
  return render();
}

```

## Code

```javascript
// @compilationMode:"infer"
// This component is skipped bc it doesn't call any hooks or
// use JSX:
function Component(props) {
  return render();
}

```
      