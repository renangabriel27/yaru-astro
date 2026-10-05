---
title: "Resumable jobs with Active Job Continuations"
excerpt: "Long jobs that survive deploys and pick up where they stopped."
date: "2026-09-03T09:00:00.000Z"
tags: ["rails"]
authors: ["dev"]
cover: "./cover.jpg"
---

A long job that gets interrupted by a deploy usually starts over from scratch. With **Active Job Continuations**, introduced in Rails 8.1, a job is split into steps and remembers a cursor, so a restart picks up where it stopped.

```ruby
class ImportCustomersJob < ApplicationJob
  include ActiveJob::Continuable

  def perform(import_id)
    @import = Import.find(import_id)

    step :validate do
      @import.validate_file!
    end

    step :process do |step|
      @import.rows.find_each(start: step.cursor) do |row|
        Customer.upsert_from(row)
        step.advance! from: row.id
      end
    end

    step :finalize
  end

  private

  def finalize
    @import.update!(finished_at: Time.current)
  end
end
```

## How it works

- Completed steps are skipped when the job runs again.
- `step.cursor` holds the progress inside a step; `advance!` moves it forward.
- When the worker is shutting down, the job stops at the next checkpoint and is re-enqueued.

<div class="kg-card kg-callout-card kg-callout-card-grey"><div class="kg-callout-emoji">⚠️</div><div class="kg-callout-text">Each piece of work inside a step still has to be idempotent: the last row before an interruption may be processed twice.</div></div>
