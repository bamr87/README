---
title: Repro No Gating Import Without Compiled Functions.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: repro-no-gating-import-without-compiled-functions.expect.md
---
# Repro No Gating Import Without Compiled Functions.Expect

## Input

```javascript
// @gating
import {isForgetEnabled_Fixtures} from 'ReactForgetFeatureFlag';

export default 42;

```

## Code

```javascript
// @gating
import { isForgetEnabled_Fixtures } from "ReactForgetFeatureFlag";

export default 42;

```
