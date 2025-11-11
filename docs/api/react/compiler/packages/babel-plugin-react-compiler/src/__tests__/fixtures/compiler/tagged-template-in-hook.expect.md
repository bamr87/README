---
title: Tagged Template In Hook.Expect
category: api
tags:
- javascript
- api
last_updated: null
source_file: tagged-template-in-hook.expect.md
---
# Tagged Template In Hook.Expect

## Input

```javascript
import {useFragment} from 'shared-runtime';

function Component(props) {
  const user = useFragment(
    graphql`
      fragment F on User {
        name
      }
    `,
    props.user
  );
  return user.name;
}

```

## Code

```javascript
import { useFragment } from "shared-runtime";

function Component(props) {
  const user = useFragment(
    graphql`
      fragment F on User {
        name
      }
    `,
    props.user,
  );
  return user.name;
}

```
