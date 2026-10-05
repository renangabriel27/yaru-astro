---
title: "skillshelf: share AI agent skills across your team"
excerpt: "A CLI to install, update and version agent skills from a Git repository."
date: "2026-09-30T09:00:00.000Z"
tags: ["projects", "ai"]
authors: ["dev"]
featured: true
cover: "./cover.jpg"
---

<div class="kg-card kg-callout-card kg-callout-card-grey"><div class="kg-callout-emoji">📦</div><div class="kg-callout-text"><b>Stack:</b> Go, GitHub API<br><b>License:</b> MIT<br><b>Status:</b> Active<br><b>Repository:</b> <code>github.com/example/skillshelf</code></div></div>

A CLI to share AI agent skills across a team: install them from a Git repository, keep them up to date and see who changed what. _Example project for the theme._

```bash
$ skillshelf add github.com/acme/agent-skills
✔ 14 skills installed in ~/.claude/skills

$ skillshelf outdated
rails-services   1.2.0 → 1.3.0   "Add transaction rules"
rspec            0.9.1 → 1.0.0   "Spec tree before code"

$ skillshelf update
```

## Why

Skills copied by hand drift apart within a week. With a shelf, changing a skill is a pull request, and everyone gets the new version with one command.

## Configuration

```yaml
# .skillshelf.yml
sources:
  - repo: github.com/acme/agent-skills
    ref: main
target: ~/.claude/skills
pin:
  rspec: 0.9.1
```
