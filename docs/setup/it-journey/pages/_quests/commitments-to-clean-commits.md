---
title: Commitments To Clean Commits
category: setup
tags:
- testing
- setup
last_updated: null
source_file: commitments-to-clean-commits.md
---
# Commitments To Clean Commits

**Ah, brave adventurer!** You've mastered the sacred art of branching and the scroll-writing ritual known as the Pull Request. Now, prepare thyself for the next enchanted trial:

* * * *

**📝 Commit Hygiene & the Magic of Tiny Spells (Chapter 2)**
============================================================

Welcome to the Hall of Git Commit Lore, where great developers are remembered not by the size of their changes, but by the clarity of their messages. Here, we embrace the **Tiny Spell Rule**: One spell per scroll. One change per commit.

* * * *

**🪄 The Rule of Atomicity**
----------------------------

A wise coder once said: "Don't mix your potions." Each commit should contain **one logical change**---no more, no less. Fixing a bug and tweaking the font? That's two commits, dear wizard.

### **🧠 Why care?**

-   Easy to track what broke (and who broke it 👀)

-   Easier reviews, easier rollbacks

-   Clean history = happy time-traveling with git blame

* * * *

**📦 Naming Your Spells (a.k.a. Commit Messages)**
--------------------------------------------------

Commits should read like commands from an ancient book. Short, imperative, and focused.

### **✨ The Format:**

```
[type]: Brief, powerful description

Optional: Details for fellow wizards.
- Use bullet points
- Reference issues like Fixes #42
```

### **🧙‍♂️ Allowed Spell Types:**

-   feat: A dazzling new feature

-   fix: Bug exorcism

-   docs: Documentation enchantments

-   refactor: Code reweaving without changing behavior

-   test: Adding test shields

-   chore: Non-functional but necessary work (e.g., build updates, lint configs)

* * * *

**🧪 Example Commit Scrolls**
-----------------------------

```
fix: Prevent unicorns from breaking login form

Login page now properly handles magical input.
- Added validation for glitter overflow
- Fixed edge case for rainbow passwords

Fixes #99
```
```
feat: Summon dark mode theme toggle

- Adds crescent moon toggle in navbar
- Stores user preference in local storage
```
```
chore: Update potion dependencies to latest brew
```

* * * *

**🧹 Commit Smells (Avoid These Cursed Patterns)**
--------------------------------------------------

-   ❌ update stuff

-   ❌ more fixes lol

-   ❌ final version for real

-   ❌ temp pls ignore

These are scrolls written in the ancient language of confusion. Burn them.

* * * *

🎩 **Bonus Spell**: Use git rebase -i to rewrite messy commit history. Clean your spellbook before publishing it to the world.

* * * *

Now go forth and cast tiny, purposeful commits that will echo through the halls of version control! 🏰

Ready to open the next dusty tome? We'll be diving into **Changelogs & Documentation**, the sacred texts of any thriving code kingdom. Shall we?