---
category: api
last_updated: null
source_file: hook-inside-logical-expression.expect.md
summary: "``javascript\nfunction Component(props) {\n  const user =\n    useFragment(\n\
  \      graphql\n        fragment F on T {\n          id\n        }\n      `,\n \
  \     props.user\n    ) ?? {};\n  return user.name;\n}"
tags:
- javascript
- api
- api
title: Hook Inside Logical Expression.Expect
---

## Input

```javascript
function Component(props) {
  const user =
    useFragment(
      graphql`
        fragment F on T {
          id
        }
      `,
      props.user
    ) ?? {};
  return user.name;
}

```

## Code

```javascript
function Component(props) {
  const user =
    useFragment(
      graphql`
        fragment F on T {
          id
        }
      `,
      props.user,
    ) ?? {};
  return user.name;
}

```
      