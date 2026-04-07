---
category: reporting
date: 2025-11-22 16:10:21+00:00
description: Generate comprehensive workflow execution summary
inputs:
- workflow_name
- execution_id
- all_outputs
name: Workflow Summary
outputs:
- summary_report
- next_steps
source_file: workflow-summary.prompt.md
title: Workflow Execution Summary
version: 1.0.0
---
# Workflow Execution Summary

Generate a comprehensive summary of the workflow execution.

**Workflow**: {{ inputs.workflow_name }}
**Execution ID**: {{ inputs.execution_id }}

## Summary Requirements

1. **What Was Created**
   - Article title and location
   - Quest title and location
   - Supporting files

2. **Quality Metrics**
   - Validation scores
   - Improvements made
   - Final quality assessment

3. **Next Steps**
   - Manual review tasks
   - Testing recommendations
   - Publication checklist

4. **Files Created**
   - Complete list with paths
   - File sizes and line counts

## Output Format

Return a well-formatted summary suitable for README or documentation.
