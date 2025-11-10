---
category: misc
last_updated: null
source_file: README.md
summary: Lightweight bindings to Linux perf event counters.
tags:
- javascript
- testing
title: perf-counters
---
# perf-counters

Lightweight bindings to Linux perf event counters.

```
$ node
> var PerfCounters = require('perf-counters');
> PerfCounters.init();
> var start = PerfCounters.getCounters(); console.log('test'); var end = PerfCounters.getCounters();
test
> start
{ instructions: 1382, loads: 421, stores: 309 }
> end
{ instructions: 647633, loads: 195771, stores: 133246 }
>
```
