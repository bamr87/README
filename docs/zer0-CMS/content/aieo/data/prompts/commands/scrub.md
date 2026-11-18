---
display_name: AI Pattern Scrubber
inputs: content
model_hint: gpt-5.4
name: scrub
outputs: markdown
source_file: content/aieo/data/prompts/commands/scrub.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/content/aieo/data/prompts/commands/scrub.md
title: Scrub
---
Rewrite the content to reduce robotic patterns:
- avoid repetitive sentence openings
- remove filler phrases
- replace excessive em-dashes
- keep facts and structure intact
Return only revised markdown.
