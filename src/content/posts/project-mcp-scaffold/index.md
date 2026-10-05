---
title: "mcp_scaffold: generators for MCP tools in Rails"
excerpt: "Turn models and services into MCP tools, with an authenticated endpoint and tests."
date: "2026-09-21T09:00:00.000Z"
tags: ["projects", "rails"]
authors: ["dev"]
cover: "./cover.jpg"
---

<div class="kg-card kg-callout-card kg-callout-card-grey"><div class="kg-callout-emoji">📦</div><div class="kg-callout-text"><b>Stack:</b> Ruby, Rails generators, MCP Ruby SDK<br><b>License:</b> MIT<br><b>Status:</b> Beta<br><b>Repository:</b> <code>github.com/example/mcp_scaffold</code></div></div>

Rails generators that turn models and service objects into MCP tools, with an authenticated endpoint and tests. _Example project for the theme._

```bash
bin/rails generate mcp:install
bin/rails generate mcp:tool SearchOrders query:string status:string --read-only
```

## What it generates

- `app/mcp/tools/search_orders_tool.rb` with the input schema already filled in.
- A route and a controller that build the server with the current user in `server_context`.
- A test that calls the tool through the endpoint.

```ruby
class SearchOrdersToolTest < ActionDispatch::IntegrationTest
  test "returns only the user's orders" do
    response = call_mcp_tool "search_orders", query: "keyboard", as: users(:alice)

    assert_equal [orders(:alice_keyboard).id], response.json.pluck("id")
  end
end
```

<div class="kg-card kg-button-card kg-align-center"><a href="/turn-your-rails-app-into-an-mcp-server/" class="kg-btn kg-btn-accent">Read: Turn your Rails app into an MCP server</a></div>
