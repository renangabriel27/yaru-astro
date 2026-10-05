---
title: "Prompt caching: cut LLM costs without changing your product"
excerpt: "Stop paying for the same prompt prefix on every request."
date: "2026-08-28T09:00:00.000Z"
tags: ["ai"]
authors: ["dev"]
cover: "./cover.jpg"
---

Most LLM features send the same long prefix on every request: system prompt, tool definitions, a few reference documents. Then they pay for those tokens again and again. **Prompt caching** lets the provider reuse that prefix, which usually cuts both cost and latency.

## How it works

You mark the end of the stable part of the prompt. Requests that start with exactly the same prefix read it from the cache instead of processing it again.

```json
{
  "model": "your-model-id",
  "max_tokens": 1024,
  "system": [
    {
      "type": "text",
      "text": "You are a support assistant for Acme. <500 lines of policies>",
      "cache_control": { "type": "ephemeral" }
    }
  ],
  "messages": [
    { "role": "user", "content": "Can I return an opened item?" }
  ]
}
```

## Order matters

1. Tools and system prompt first: they almost never change.
2. Reference documents next.
3. The conversation last: it changes every turn.

Anything dynamic before the cache breakpoint, like a timestamp or the user's name, invalidates the cache for everyone.

<div class="kg-card kg-toggle-card" data-kg-toggle-state="close"><div class="kg-toggle-heading"><h4 class="kg-toggle-heading-text">Does caching change the answers?</h4><button class="kg-toggle-card-icon"></button></div><div class="kg-toggle-content"><p>No. The model sees the same tokens; caching only skips reprocessing a prefix it has already seen.</p></div></div>

<div class="kg-card kg-toggle-card" data-kg-toggle-state="close"><div class="kg-toggle-heading"><h4 class="kg-toggle-heading-text">How do I know it's working?</h4><button class="kg-toggle-card-icon"></button></div><div class="kg-toggle-content"><p>Check the usage block of each response. Cached requests report tokens read from the cache separately from regular input tokens.</p></div></div>
