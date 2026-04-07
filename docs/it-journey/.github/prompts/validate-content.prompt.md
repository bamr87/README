---
category: quality-assurance
date: 2025-11-22 16:10:21+00:00
description: Validate article and quest content against IT-Journey standards
inputs:
- article_content
- article_frontmatter
- quest_content
- quest_frontmatter
name: Validate Content
outputs:
- validation_report
- article_score
- quest_score
source_file: validate-content.prompt.md
title: Validate Content Quality
version: 1.0.0
---
# Validate Content Quality

Validate both article and quest content against IT-Journey educational standards.

## Validation Criteria

### Article Validation
- Frontmatter completeness and correctness
- Learning objectives clarity and measurability
- Technical accuracy
- Code examples tested and working
- Multi-platform coverage
- Accessibility (headings, alt text, clear language)

### Quest Validation
- All article criteria PLUS:
- Fantasy theme integration
- Binary level format correct
- Quest objectives clear and achievable
- Challenges appropriately difficult
- Mermaid diagrams present and valid
- Validation criteria defined

## Scoring

Return scores out of 100 for both article and quest.
- 80-100: Excellent, ready to publish
- 60-79: Good, minor improvements needed
- Below 60: Needs significant work

## Output Format

Return detailed validation report with specific issues and recommendations.
