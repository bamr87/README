---
author: IT-Journey Team
categories:
- Quests
- Cloud
- Azure
- Deployment
date: '2025-07-05T12:12:17.000Z'
description: 'Deploy the IT-Journey Jekyll site to Azure Static Web Apps: provision
  the app, wire up a CI/CD pipeline, secure your secrets, and verify production.'
difficulty: 🔴 Hard
draft: false
estimated_time: 90-120 minutes
fmContentType: quest
keywords:
  primary:
  - azure
  - jekyll
  secondary:
  - static-web-apps
  - deployment
  - ci-cd
lastmod: 2026-01-14
layout: quest
learning_style: hands-on
level: '1000'
permalink: /quests/1000/azure-ascension-jekyll-deployment/
primary_technology: azure-static-web-apps
quest_series: Cloud Deployment Quests
quest_type: main_quest
skill_focus: devops
source_file: azure-ascension-jekyll-deployment.md
tags:
- azure
- jekyll
- static-web-apps
- ci-cd
title: 'setup: verifies prerequisites and provisions the Azure Static Web App'
---
*Rise, cloud wanderer! This quest guides you through deploying the IT-Journey Jekyll site to Azure Static Web Apps, wiring up CI/CD, and verifying a clean production build.*

## 🎯 Quest Objectives

### Primary Objectives
- [ ] **Provision Azure Static Web Apps** - Create the app and link to GitHub
- [ ] **Configure Build & Deploy** - Ensure Jekyll build works in CI
- [ ] **Secure Secrets** - Store keys safely in GitHub
- [ ] **Verify Production** - Confirm the deployed site loads correctly

## 🗺️ Quest Prerequisites

### 📋 Knowledge Requirements
- [ ] Basic GitHub workflow familiarity
- [ ] Comfort with terminal commands
- [ ] Understanding of static sites

### 🛠️ System Requirements
- [ ] Azure account with permissions to create Static Web Apps
- [ ] GitHub account with repo access
- [ ] [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli) installed and authenticated (`az login`) — Chapter 2 depends on Azure authentication
- [ ] Ruby ≥ 3.2 and Bundler installed (`gem install bundler`)

## 🧙‍♂️ Chapter 1: Prepare the Repository

First, clone the IT-Journey repository and change into the Jekyll site root — every command below assumes this is your working directory (it is where the `Gemfile` lives):

```bash
git clone https://github.com/bamr87/it-journey.git
cd it-journey
```

Ensure dependencies are installed (run from the `it-journey` repo root, next to the `Gemfile`):

```bash
bundle install
```

Verify local build:

```bash
bundle exec jekyll build
```

## ☁️ Chapter 2: Deploy with the Azure Helper Script

Use the built-in deployment script. Run it **from the `it-journey` repo root** (the same directory you cloned into in Chapter 1) using its repo-relative path:

```bash
# setup: verifies prerequisites and provisions the Azure Static Web App
scripts/deployment/azure-jekyll-deploy.sh setup

# deploy: pushes the build and wires up the GitHub Actions CI/CD workflow
#   --app-name    the name for your Azure Static Web App (e.g. my-it-journey)
#   --github-repo the HTTPS URL of your fork (e.g. https://github.com/<you>/it-journey)
scripts/deployment/azure-jekyll-deploy.sh deploy --app-name <your-app-name> --github-repo <your-repo-url>
```

Follow the prompts for Azure authentication and GitHub workflow setup.

## 🔐 Chapter 3: Secrets & Workflow Verification

1. Confirm the required GitHub secret is set: the Azure Static Web Apps deployment token,
stored as `AZURE_STATIC_WEB_APPS_API_TOKEN` under **Settings → Secrets and variables → Actions** in your repo. The `deploy` step above prints this token; copy it into the secret.
2. Open the generated workflow in `.github/workflows/`.
3. Trigger a deploy by pushing a small change.

## ✅ Chapter 4: Validate the Deployment

- [ ] Visit the Azure-provided URL
- [ ] Confirm `/quests/` loads correctly
- [ ] Check logs for a successful build

## 🏁 Quest Completion Checklist

- [ ] Azure Static Web App created and linked
- [ ] CI/CD pipeline runs successfully
- [ ] Site is accessible in production

## 🔗 Related Quests

- [GitHub Pages Portal](../0001/github-pages-portal.md)
- [Jekyll Fundamentals](../0001/jekyll-fundamentals.md)
- [Link to the Future: Hyperlink Checking](../1010/link-to-the-future-automated-hyperlink-checking-and-error-reporting.md)

## 🕸️ Knowledge Graph

*Structured wiki-links connect this quest to the IT-Journey knowledge graph. Open the [Obsidian Graph View](/notes/obsidian/graph/) to explore connections.*

**Level hub:** [[Level 1000 (8) - Cloud Computing]] **Overworld:** [[🏰 Overworld - Master Quest Map]] **Obsidian docs:** [[Obsidian Knowledge Graph and Wiki Links]]

