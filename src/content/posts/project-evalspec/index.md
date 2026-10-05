---
title: "evalspec: RSpec matchers for LLM evals"
excerpt: "YAML datasets, accuracy thresholds and reports you can diff between runs."
date: "2026-09-09T09:00:00.000Z"
tags: ["projects", "testing"]
authors: ["dev"]
cover: "./cover.jpg"
---

<div class="kg-card kg-callout-card kg-callout-card-grey"><div class="kg-callout-emoji">📦</div><div class="kg-callout-text"><b>Stack:</b> Ruby, RSpec<br><b>License:</b> MIT<br><b>Status:</b> Active<br><b>Repository:</b> <code>github.com/example/evalspec</code></div></div>

RSpec matchers and a runner for evaluating LLM features: datasets in YAML, accuracy thresholds and a report you can diff between runs. _Example project for the theme._

```ruby
RSpec.describe SupportTriage, :eval do
  dataset "spec/evals/support_triage.yml"

  it { is_expected.to classify(:intent).with_accuracy(0.9) }
  it { is_expected.to mention(:order_number).in_at_least(0.95) }
end
```

```bash
$ bundle exec evalspec --compare main
SupportTriage   intent accuracy   0.93 → 0.91   ▼ 0.02
SupportTriage   mentions          0.97 → 0.98   ▲ 0.01
```
