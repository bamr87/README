---
title: Error.Todo Repro Declaration For All Identifiers.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: error.todo-repro-declaration-for-all-identifiers.expect.md
---
## Input

```javascript
function Foo() {
  try {
    // NOTE: this fixture previously failed during LeaveSSA;
    // double-check this code when supporting value blocks in try/catch
    for (let i = 0; i < 2; i++) {}
  } catch {}
}

```


## Error

```
Found 1 error:

Todo: Support value blocks (conditional, logical, optional chaining, etc) within a try/catch statement

error.todo-repro-declaration-for-all-identifiers.ts:5:20
  3 |     // NOTE: this fixture previously failed during LeaveSSA;
  4 |     // double-check this code when supporting value blocks in try/catch
> 5 |     for (let i = 0; i < 2; i++) {}
    |                     ^ Support value blocks (conditional, logical, optional chaining, etc) within a try/catch statement
  6 |   } catch {}
  7 | }
  8 |
```
          
      