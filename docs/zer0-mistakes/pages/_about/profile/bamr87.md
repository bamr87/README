---
avatar: /assets/images/bamr-avatar.png
email: null
excerpt: IT Wizard, Software Architect, Tech Enthusiast.
github: bamr87
lastmod: 2024-05-25 19:07:46.394000+00:00
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

<!-- GitHub contribution calendar (bundled under assets/vendor/) -->
<script src="{{ '/assets/vendor/github-calendar/github-calendar.min.js' | relative_url }}"></script>
<link rel="stylesheet" href="{{ '/assets/vendor/github-calendar/github-calendar-responsive.css' | relative_url }}" />

<!-- Prepare a container for your calendar. -->
<div class="calendar">
    <!-- Loading stuff -->
    Loading the data just for you.
</div>

<script>

// or enable responsive functionality:
    GitHubCalendar(".calendar", "bamr87", { responsive: true });

</script>
