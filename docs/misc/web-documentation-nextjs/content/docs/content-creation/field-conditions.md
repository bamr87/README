---
category: misc
date: 2022-12-08 15:30:17.335000+00:00
description: Learn how to show or hide fields based on the value of another field
last_updated: null
lastmod: 2024-02-22 17:36:07.737000+00:00
slug: content-creation/field-conditions
source_file: field-conditions.md
summary: 'Field conditions allow you to show or hide fields based on the value of
  another field.

  This is useful when you want to show a field only when a specific value is selected
  or provided.'
tags:
- documentation
title: Field conditions
weight: 200.41
---


# Field conditions

Field conditions allow you to show or hide fields based on the value of another field.
This is useful when you want to show a field only when a specific value is selected or provided.

## Show or hide fields

To show or hide a field, you need to add the `when` property to the field.

```json
{
  "title": "Show or hide field",
  "name": "showOrHideField",
  "type": "string",
  "when": {
    "fieldRef": "title",
    "operator": "contains",
    "value": "<the value to validate>",
    "caseSensitive": false
  }
}
```

| Property | Description |
| --- | --- |
| `fieldRef` | The name of the field to validate |
| `operator` | The operator to use to validate the field value. See [Supported operators](#supported-operators) |
| `value` | The value to validate |
| `caseSensitive` | If the validation should be case sensitive. Default: `true` |

## Supported operators

| Type | Value |
| --- | --- |
| Equals | `eq` |
| Not equals | `neq` |
| Contains | `contains` |
| Not contains | `notContains` |
| Starts with | `startsWith` |
| Ends with | `endsWith` |
| Greater than | `gt` |
| Greater than or equal | `gte` |
| Less than | `lt` |
| Less than or equal | `lte` |
