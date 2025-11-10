---
category: api
last_updated: null
source_file: tagged-template-in-hook.expect.md
summary: '```javascript

  import {useFragment} from ''sharedruntime'';'
tags:
- javascript
- api
- api
title: Tagged Template In Hook.Expect
---

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
      