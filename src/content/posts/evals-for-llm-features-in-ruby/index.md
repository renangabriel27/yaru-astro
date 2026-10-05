---
title: "Evals for LLM features in Ruby"
excerpt: "You can't assert on non-deterministic output, but you can measure it."
date: "2026-09-12T09:00:00.000Z"
tags: ["ai", "testing"]
authors: ["dev"]
cover: "./cover.jpg"
---

You can't write `expect(summary).to eq("...")` for an LLM feature. The output changes every run. But "it's non-deterministic" is not an excuse to ship without tests. You need **evals**: a dataset of real cases and checks that measure how often the feature gets them right.

## Start with a dataset

Twenty real examples beat two hundred synthetic ones. Pull them from production logs and write down what a good answer must contain.

```yaml
- input: "Order #4821 arrived broken, I want my money back"
  expect:
    intent: refund
    mentions: ["4821"]
- input: "Can I change the delivery address?"
  expect:
    intent: change_address
```

## Cheap checks first

Most of the value comes from deterministic checks on structured output. Use an LLM as a judge only for what code can't check.

```ruby
RSpec.describe SupportTriage, :eval do
  cases = YAML.load_file("spec/evals/support_triage.yml", symbolize_names: true)

  it "classifies at least 90% of the cases correctly" do
    results = cases.map do |example|
      output = SupportTriage.call(example[:input])

      output.intent == example.dig(:expect, :intent) &&
        Array(example.dig(:expect, :mentions)).all? { output.summary.include?(it) }
    end

    accuracy = results.count(true).fdiv(results.size)
    expect(accuracy).to be >= 0.9
  end
end
```

## When to run them

- On every change to a prompt, model or retrieval step.
- Nightly, against the current model version, to catch provider-side drift.
- Keep them out of the regular suite: they're slower and cost money.

<div class="kg-card kg-callout-card kg-callout-card-accent"><div class="kg-callout-emoji">📈</div><div class="kg-callout-text">Track the score over time. A prompt change that moves accuracy from 92% to 85% is a regression, even if every unit test is green.</div></div>
