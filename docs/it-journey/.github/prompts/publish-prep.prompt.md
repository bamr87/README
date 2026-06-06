---
category: publishing
date: 2025-11-22 16:10:21+00:00
description: Prepare final files for publication including file naming, README updates,
  and navigation
inputs:
- article_content
- article_frontmatter
- quest_content
- quest_frontmatter
name: Publish Preparation
outputs:
- final_article_file
- final_quest_file
- readme_updates
- navigation_updates
source_file: publish-prep.prompt.md
title: Publish Preparation
version: 1.0.0
---
# Publish Preparation

Prepare final files with proper naming and integration into IT-Journey structure.

## Tasks

1. **Generate Filenames**
   - Article: `YYYY-MM-DD-title-with-hyphens.md` in `pages/_posts/category/`
   - Quest: `index.md` in `pages/_quests/level-XXXX-title/`

2. **Combine Frontmatter + Content**
   - Merge frontmatter and content
   - Ensure proper YAML formatting
   - Add final review date

3. **README Updates**
   - Add to quest collection README
   - Update parent directory READMEs
   - Add cross-references

4. **Navigation Updates**
   - Add to `_data/navigation/` if needed
   - Update quest progression maps

## Output Format

Return file paths and content for each file to create or update.
