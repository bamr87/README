---
category: api
last_updated: null
source_file: error.invalid-ref-value-as-props.expect.md
summary: "```javascript\n// @validateRefAccessDuringRender\nfunction Component(props)\
  \ {\n  const ref = useRef(null);\n  return <Foo ref={ref.current} />;\n}"
tags:
- javascript
- api
title: Error.Invalid Ref Value As Props.Expect
---

## Input

```javascript
// @validateRefAccessDuringRender
function Component(props) {
  const ref = useRef(null);
  return <Foo ref={ref.current} />;
}

```


## Error

```
Found 1 error:

Error: Cannot access refs during render

React refs are values that are not needed for rendering. Refs should only be accessed outside of render, such as in event handlers or effects. Accessing a ref value (the `current` property) during render can cause your component not to update as expected (https://react.dev/reference/react/useRef).

error.invalid-ref-value-as-props.ts:4:19
  2 | function Component(props) {
  3 |   const ref = useRef(null);
> 4 |   return <Foo ref={ref.current} />;
    |                    ^^^^^^^^^^^ Cannot access ref value during render
  5 | }
  6 |
```
          
      