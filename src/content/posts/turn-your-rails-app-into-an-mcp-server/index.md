---
title: "Turn your Rails app into an MCP server"
excerpt: "Let AI assistants call your app's features, with the same authorization as the rest of it."
date: "2026-09-24T09:00:00.000Z"
tags: ["ai", "rails"]
authors: ["dev"]
cover: "./cover.jpg"
---

The [Model Context Protocol](https://modelcontextprotocol.io) lets AI assistants call tools you define. If your product runs on Rails, a small MCP endpoint lets an assistant search orders, read a customer's history or open a support ticket, with the same authorization rules as the rest of your app.

## Install the SDK

```bash
bundle add mcp
```

## Define a tool

A tool is a class with a description, an input schema and a `call` method. The description is what the model reads to decide when to use it, so be specific.

```ruby
class SearchOrdersTool < MCP::Tool
  tool_name "search_orders"
  description "Search the current user's orders by status or product name"

  input_schema(
    properties: {
      query: { type: "string" },
      status: { type: "string", enum: %w[pending paid shipped cancelled] }
    },
    required: ["query"]
  )

  annotations(read_only_hint: true)

  def self.call(query:, server_context:, status: nil)
    orders = server_context[:user].orders.search(query)
    orders = orders.where(status:) if status

    MCP::Tool::Response.new([{ type: "text", text: orders.limit(20).to_json(only: %i[id status total]) }])
  end
end
```

## Expose it from a controller

```ruby
class McpController < ActionController::API
  include Authentication # your token-based auth

  def create
    server = MCP::Server.new(
      name: "shop",
      tools: [SearchOrdersTool],
      server_context: { user: Current.user }
    )

    render json: server.handle_json(request.body.read)
  end
end
```

## Guardrails

- **Scope everything to the user.** Pass the authenticated user through `server_context`, never trust IDs from the model.
- **Start read-only.** Mark tools with `read_only_hint` and add writes later, one at a time.
- **Return less.** Every byte you return goes into the model's context window.
