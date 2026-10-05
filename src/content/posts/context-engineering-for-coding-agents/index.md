---
title: "Context engineering for coding agents"
excerpt: "Rules, skills, tools and hooks: deciding what the model sees matters more than the model."
date: "2026-09-18T09:00:00.000Z"
tags: ["ai"]
authors: ["dev"]
cover: "./cover.jpg"
---

Prompt engineering was about finding the magic words. **Context engineering** is about deciding what the model sees: which rules, which files, which tools, and when. For coding agents it matters more than the model you pick.

## The layers

| Layer | Loaded | Example |
| --- | --- | --- |
| Rules | Always | "Commit messages in English" |
| Skills | On demand | "How we write service objects" |
| Tools | When called | Issue tracker, staging database, browser |
| Hooks | On events | Run the linter after every edit |

## Keep the rules file short

Everything in `AGENTS.md` or `CLAUDE.md` is read on every turn. Long files dilute the instructions that matter. Keep it to conventions that apply everywhere and point to skills for the rest.

```markdown
# Project rules

- Ruby 3.4, Rails 8. Run `bin/rails test` before saying you're done.
- Business logic goes in `app/services`, one public `call` method.
- Never edit files in `db/schema.rb` by hand; write a migration.
- For anything about specs, load the `rspec` skill.
```

## Skills: knowledge on demand

A skill is a folder with a `SKILL.md`. Its description is what the agent reads to decide whether to load it, so it has to say _when to use it_ and _when not to_.

```markdown
---
name: rails-services
description: Conventions for service objects. Use whenever you implement business
  logic that writes data, calls external APIs or spans a transaction.
  Don't use it for simple reads (see rails-queries).
---

# Service objects
1. One public method: `call`.
2. Return a result object; never raise for control flow.
3. Wrap database writes in a transaction, never HTTP calls.
```

## Hooks: automatic feedback

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": "bin/agent-lint" }]
      }
    ]
  }
}
```

<div class="kg-card kg-callout-card kg-callout-card-accent"><div class="kg-callout-emoji">💡</div><div class="kg-callout-text">Start with the skills that fix the mistakes you keep pointing out in code review. They pay for themselves in the first week.</div></div>
