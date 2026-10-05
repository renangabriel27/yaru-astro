---
title: "Deploying Rails with Kamal 2"
excerpt: "Zero-downtime deploys and automatic HTTPS on any server you can SSH into."
date: "2026-09-15T09:00:00.000Z"
tags: ["rails", "devops"]
authors: ["dev"]
cover: "./cover.jpg"
---

Kamal deploys Docker containers to any server you can SSH into. Version 2 ships with **kamal-proxy**, which handles zero-downtime deploys and automatic HTTPS, so a VPS and a domain are all you need.

## The whole config

```yaml
# config/deploy.yml
service: shop
image: acme/shop

servers:
  web:
    - 203.0.113.10
  job:
    hosts:
      - 203.0.113.10
    cmd: bin/jobs

proxy:
  ssl: true
  host: shop.example.com

registry:
  username: acme
  password:
    - KAMAL_REGISTRY_PASSWORD

env:
  secret:
    - RAILS_MASTER_KEY
```

## Deploying

```bash
kamal setup     # first time: installs Docker, boots the proxy and the app
kamal deploy    # every time after that
kamal app logs -f
kamal rollback <version>
```

## Secrets

Secrets go in `.kamal/secrets`, which can read them from a password manager instead of storing them in plain text:

```bash
KAMAL_REGISTRY_PASSWORD=$(op read "op://Deploy/registry/password")
RAILS_MASTER_KEY=$(cat config/master.key)
```

<div class="kg-card kg-toggle-card" data-kg-toggle-state="close"><div class="kg-toggle-heading"><h4 class="kg-toggle-heading-text">Do I need Kubernetes?</h4><button class="kg-toggle-card-icon"></button></div><div class="kg-toggle-content"><p>Probably not. A couple of well-sized servers behind Kamal handle a lot of traffic, and you can read the entire deployment setup in one file.</p></div></div>
