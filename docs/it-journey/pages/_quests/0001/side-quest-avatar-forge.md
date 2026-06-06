---
author: Quest Master IT-Journey Team
categories:
- Quests
- Community
- Customization
comments: true
date: 2026-03-20 00:00:00+00:00
description: Design and integrate a custom avatar for your contributor character profile
difficulty: 🟢 Easy
draft: false
estimated_time: 20-30 minutes
excerpt: Visit the Portrait Studio and commission a visual identity worthy of your
  class.
fmContentType: quest
keywords:
- avatar
- profile image
- contributor
- customization
lastmod: 2026-03-21 15:12:32.233000+00:00
learning_paths:
  character_classes:
  - 🎵 Bard
  - 💚 Healer
  primary_paths:
  - Community Contributor
  skill_trees:
  - Community & Collaboration
  - Frontend Basics
learning_style: hands-on
level: '0001'
permalink: /quests/side-quest-avatar-forge/
prerequisites:
  knowledge_requirements:
  - Completed Forge Your Character quest
  - Basic understanding of image URLs and HTML
  system_requirements:
  - Text editor or IDE
  - An image hosting service or local image file
primary_technology: html
quest_arc: 'Act I: Arrival at the Guild'
quest_dependencies:
  recommended_quests: []
  required_quests:
  - /quests/forge-your-character/
  unlocks_quests: []
quest_line: Contributor Chronicles
quest_series: 'Contributor Path: Identity & Recognition'
quest_type: side_quest
rewards:
  badges:
  - 🎨 Portrait Artist — Custom avatar displayed on character sheet
  progression_points: 50
skill_focus:
- frontend
snippet: The Portrait Artist awaits — every hero deserves a face
source_file: side-quest-avatar-forge.md
tags:
- lvl-0001
- contributor
- avatar
- profile
- customization
- hands-on
- gamified-learning
title: '🎨 Avatar Forge: Crafting Your Digital Portrait'
validation_criteria:
  completion_requirements:
  - Avatar URL set in contributor data file
  - Avatar renders on character sheet
  - Image is appropriate and accessible (has alt text context)
---
# 🎨 Avatar Forge: Crafting Your Digital Portrait

> *"A blurred silhouette does not inspire fear — or trust. Let us give you a face."*
> — The Portrait Artist

## 🎯 Quest Objectives

- [ ] Find or create an avatar image
- [ ] Host the image at an accessible URL
- [ ] Update your contributor data file
- [ ] Verify the avatar renders on your profile

## 📖 Background

Your character sheet currently shows a GitHub-generated identicon. While functional, a custom avatar makes your profile uniquely yours.

## 🗺️ Quest Steps

### Step 1: Choose Your Avatar

Options for sourcing an avatar:

| Method | Difficulty | Notes |
|--------|-----------|-------|
| GitHub profile photo | Easiest | Use `https://github.com/YOUR_USERNAME.png` |
| Upload to repo | Easy | Add to `assets/images/contributors/` |
| External URL | Easy | Any publicly accessible image URL |
| Generate with AI | Fun | Use an AI art tool for a fantasy portrait |
| Custom art | Advanced | Draw your own class-themed portrait |

**Recommended size**: 200×200px or larger, square aspect ratio.

### Step 2: Update Your Data File

Edit `_data/contributors/YOUR_USERNAME.yml`:

```yaml
profile:
  avatar: "https://github.com/YOUR_USERNAME.png"  # or your custom URL
```

Or if hosting in the repo:

```yaml
profile:
  avatar: "/assets/images/contributors/YOUR_USERNAME.png"
```

### Step 3: Host Locally (Optional)

If adding the image to the repo:

```bash
mkdir -p assets/images/contributors
cp /path/to/your/avatar.png assets/images/contributors/YOUR_USERNAME.png
```

### Step 4: Verify

Build the site and check your profile page:

```bash
bundle exec jekyll serve
# Visit http://localhost:4000/contributors/YOUR_USERNAME/
```

Your avatar should appear in the circular frame at the top of your character card.

- [ ] Avatar displays correctly
- [ ] Fallback still works if image fails to load

## 🏆 Reward: Portrait Artist Badge 🎨

Once your avatar is live, you've earned the **Portrait Artist** badge (+50 XP).

---

> *"Now the realm shall know your face. Go forth, adventurer."*
