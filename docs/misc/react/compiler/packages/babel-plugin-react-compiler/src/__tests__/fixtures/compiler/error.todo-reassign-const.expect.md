---
category: misc
last_updated: null
source_file: error.todo-reassign-const.expect.md
summary: '```javascript

  import {Stringify} from ''sharedruntime'';'
tags:
- javascript
title: Error.Todo Reassign Const.Expect
---

## Input

```javascript
import {Stringify} from 'shared-runtime';

function Component({foo}) {
  let bar = foo.bar;
  return (
    <Stringify
      handler={() => {
        foo = true;
      }}
    />
  );
}

```


## Error

```
Found 1 error:

Todo: Support destructuring of context variables

error.todo-reassign-const.ts:3:20
  1 | import {Stringify} from 'shared-runtime';
  2 |
> 3 | function Component({foo}) {
    |                     ^^^ Support destructuring of context variables
  4 |   let bar = foo.bar;
  5 |   return (
  6 |     <Stringify
```
          
      