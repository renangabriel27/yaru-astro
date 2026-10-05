---
title: "Spec-Driven Development: shipping features with AI agents"
excerpt: "PRD, tech spec, tasks and reviewed implementation, with a human approval between every step."
date: "2026-10-03T09:00:00.000Z"
tags: ["ai"]
authors: ["dev"]
featured: true
cover: "./cover.jpg"
---

Asking a coding agent to "build this feature" works until the feature touches more than a handful of files. After that, the agent guesses what you meant, and guessing is expensive. **Spec-Driven Development** flips the order: write the spec first, then the code, with a human approval between every step.

## The flow

1. **PRD:** the problem, who it affects and numbered acceptance criteria (AC01, AC02…).
2. **Tech spec:** alternatives with trade-offs, the recommendation, the design and a matrix linking every acceptance criterion to a test.
3. **Tasks:** small, sequential deliverables, each with its own tests.
4. **Implementation:** one task at a time, followed by an automated review against the project's conventions.

<div class="kg-card kg-callout-card kg-callout-card-accent"><div class="kg-callout-emoji">🧭</div><div class="kg-callout-text">The golden rule: the agent never moves to the next phase on its own. Every phase ends with <em>“approved?”</em> and only continues on a yes.</div></div>

## Everything is a file

Each phase produces a file that lives next to the code. The nice side effect: the pull request arrives with the _why_ already written down.

```bash
docs/specs/pix-checkout/
├── prd.md           # problem, scope and acceptance criteria
├── techspec.md      # alternatives, decision and design
├── tasks.md         # overview and progress
├── 1_task.md        # one small deliverable, with tests
├── 1_review.md      # automated review against the conventions
└── .flow.yml        # flow state, so you can resume later
```

```yaml
feature: pix-checkout
phase: implement
branch: feat/pix-checkout
tasks:
  - { n: 1, title: "Create the Pix charge at checkout", status: done }
  - { n: 2, title: "Confirm payment through the webhook", status: in_progress }
  - { n: 3, title: "Show the payment status on the order", status: pending }
```

## What changes day to day

- **Less rework:** product questions show up in the PRD, not in code review.
- **Smaller PRs:** every task becomes a reviewable commit.
- **Context that survives:** you can pause and come back days later, because the state lives in a file.

> The agent writes code faster than I do. The spec makes sure it writes the right code.
