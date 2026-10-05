---
title: "Rails 8 without Redis: Solid Queue, Solid Cache and Solid Cable"
excerpt: "Jobs, cache and WebSockets on top of the database you already have."
date: "2026-09-27T09:00:00.000Z"
tags: ["rails"]
authors: ["dev"]
featured: true
cover: "./cover.jpg"
---

For years, a new Rails app meant PostgreSQL _and_ Redis: one for data, the other for jobs, cache and Action Cable. Rails 8 ships with the **Solid** trio, which runs all three on top of the database you already have.

| Need | Before | Rails 8 default |
| --- | --- | --- |
| Background jobs | Sidekiq + Redis | Solid Queue |
| Cache | Redis / Memcached | Solid Cache |
| WebSockets | Redis pub/sub | Solid Cable |

## Solid Queue

Jobs are rows in a table, picked up with `FOR UPDATE SKIP LOCKED`. Recurring jobs live in a YAML file, no extra scheduler needed:

```yaml
# config/recurring.yml
production:
  clear_abandoned_carts:
    class: ClearAbandonedCartsJob
    schedule: every day at 3am
  sync_exchange_rates:
    command: "ExchangeRate.sync!"
    schedule: every hour
```

## Solid Cache

The cache lives on disk instead of RAM. Disk is cheap, so you can keep a much bigger cache for much longer.

```ruby
# config/environments/production.rb
config.cache_store = :solid_cache_store
```

## When you still want Redis

- Very high job throughput, where the extra database load matters.
- Features that rely on Redis data structures: rate limiting with sorted sets, leaderboards.
- An existing Sidekiq setup that works. There's no prize for migrating.

<div class="kg-card kg-callout-card kg-callout-card-accent"><div class="kg-callout-emoji">🧰</div><div class="kg-callout-text">One less service means one less thing to provision, monitor and upgrade. For most apps, that's the real win.</div></div>
