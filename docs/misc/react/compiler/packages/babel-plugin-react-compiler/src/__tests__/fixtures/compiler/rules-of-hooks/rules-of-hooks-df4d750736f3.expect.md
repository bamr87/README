---
category: misc
last_updated: null
source_file: rules-of-hooks-df4d750736f3.expect.md
summary: '```javascript

  // Valid because they''re not matching use[AZ].

  fooState();

  use();

  useState();

  usehook();

  // also valid because it''s not matching the PascalCase namespace

  jest.useFakeTimer();'
tags:
- javascript
title: Rules Of Hooks Df4D750736F3.Expect
---

## Input

```javascript
// Valid because they're not matching use[A-Z].
fooState();
_use();
_useState();
use_hook();
// also valid because it's not matching the PascalCase namespace
jest.useFakeTimer();

```

## Code

```javascript
// Valid because they're not matching use[A-Z].
fooState();
_use();
_useState();
use_hook();
// also valid because it's not matching the PascalCase namespace
jest.useFakeTimer();

```
      