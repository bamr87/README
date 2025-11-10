---
title: Error.Nomemo And Change Detect.Expect
category: setup
tags:
- javascript
- setup
last_updated: null
source_file: error.nomemo-and-change-detect.expect.md
---
## Input

```javascript
// @disableMemoizationForDebugging @enableChangeDetectionForDebugging
function Component(props) {}

```


## Error

```
Found 1 error:

Error: Invalid environment config: the 'disableMemoizationForDebugging' and 'enableChangeDetectionForDebugging' options cannot be used together
```
          
      