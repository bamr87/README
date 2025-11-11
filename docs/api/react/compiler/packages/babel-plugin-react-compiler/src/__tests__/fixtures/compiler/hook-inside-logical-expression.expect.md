---
title: Hook Inside Logical Expression.Expect
category: api
tags:
- javascript
- api
last_updated: null
source_file: hook-inside-logical-expression.expect.md
---
# Hook Inside Logical Expression.Expect

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
