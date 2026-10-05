---
title: "Code review tips that make everyone better"
excerpt: "Small PRs, questions instead of assertions and prefixes that show how much a comment weighs."
date: "2026-08-19T09:00:00.000Z"
tags: ["career"]
authors: ["dev"]
cover: "./cover.jpg"
---

Reviewing pull requests is one of the fastest ways to learn a codebase and to help a team write code that needs less review. A few things that make reviews better for everyone.

## Small PRs get reviewed; big PRs get approved

A 50-line PR gets useful comments. A 1,500-line one gets "LGTM". Splitting the work is the best way to get a real review.

## Ask before you assert

"This is wrong" ends the conversation. "What happens here if the order has no items?" starts one. Half the time, the author already thought about it and you learn something.

## Say how much a comment weighs

- `blocking:` a bug, a security issue, data loss.
- `suggestion:` would make it better, can wait.
- `nit:` style detail, ignore if you want.
- `question:` I want to understand, not a change request.

> The goal of code review isn't to prove you're smarter than the author. It's to make the whole team understand the code.
