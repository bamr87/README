---
avatar: /assets/images/bamr-avatar.png
date: '2024-05-09T22:24:22.000Z'
description: Profile page for the IT-Journey founder and maintainer — IT generalist
  in Denver, lapsed banker, builder of the zer0-mistakes Jekyll theme.
email: null
excerpt: IT Wizard, Software Architect, Tech Enthusiast.
github: bamr87
lastmod: '2025-01-21T23:09:20.000Z'
linkedin: amrabdel
location: Denver, CO
name: Amr Abdel-Motaleb
permalink: /about/bamr87/
source_file: bamr87.md
title: Navigate to your current repository
twitter: bamr42
website: https://it-journey.dev
---
# Navigate to your current repository

```shell

cd ~/github/it-journey

# Add the GitHub profile repository as a remote repository

git remote add bamr87 https://github.com/bamr87/bamr87.git

# Add the remote repository as a subtree

git subtree add --prefix=pages/_about/contributors/bamr87 bamr87 main

```

<!-- Include the library. -->
<script
  src="https://unpkg.com/github-calendar@latest/dist/github-calendar.min.js">
</script>

<!-- Optionally, include the theme (if you don't want to struggle to write the CSS) -->
<link
rel="stylesheet" href="https://unpkg.com/github-calendar@latest/dist/github-calendar-responsive.css" />

<!-- Prepare a container for your calendar. -->
<div class="calendar">
    <!-- Loading stuff -->
    Loading the data just for you.
</div>

<script>

// or enable responsive functionality:
    GitHubCalendar(".calendar", "bamr87", { responsive: true });

</script>

