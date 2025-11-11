---
title: DOM Fixtures
category: api
tags:
- javascript
- testing
- api
last_updated: null
source_file: README.md
---
# DOM Fixtures

A set of DOM test cases for quickly identifying browser issues.

## Setup

To reference a local build of React, first run `yarn build` at the root
of the React project. Then:

```
cd fixtures/dom
yarn
yarn dev
```

The `dev` command runs a script that copies over the local build of react into
the public directory.
