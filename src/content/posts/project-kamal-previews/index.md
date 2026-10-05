---
title: "kamal-previews: a preview app for every pull request"
excerpt: "Per-PR environments on a single server, destroyed when the PR closes."
date: "2026-08-31T09:00:00.000Z"
tags: ["projects", "devops"]
authors: ["dev"]
cover: "./cover.jpg"
---

<div class="kg-card kg-callout-card kg-callout-card-grey"><div class="kg-callout-emoji">📦</div><div class="kg-callout-text"><b>Stack:</b> Ruby, Kamal 2, GitHub Actions<br><b>License:</b> MIT<br><b>Status:</b> Experimental<br><b>Repository:</b> <code>github.com/example/kamal-previews</code></div></div>

Preview environments for every pull request, deployed with Kamal to a single server and destroyed when the PR is closed. _Example project for the theme._

```yaml
# .github/workflows/preview.yml
on:
  pull_request:
    types: [opened, synchronize, closed]

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: example/kamal-previews@v1
        with:
          host: "pr-${{ github.event.number }}.preview.example.com"
          destroy: ${{ github.event.action == 'closed' }}
```

## How it works

- Each PR gets its own Kamal destination and subdomain.
- kamal-proxy routes by host name and issues the certificate.
- The database is a copy of a seeded template, created in seconds.
