---
title: "Turbo morphing in practice"
excerpt: "Page refreshes that keep scroll, focus and form state, with one line of config."
date: "2026-08-25T09:00:00.000Z"
tags: ["rails", "hotwire"]
authors: ["dev"]
cover: "./cover.jpg"
---

Turbo 8 added **page refreshes with morphing**: instead of replacing the whole page, Turbo compares the new HTML with the current one and only changes what's different. Scroll position, focus and form state survive.

## Turn it on

```erb
<%# app/views/layouts/application.html.erb %>
<%= turbo_refreshes_with method: :morph, scroll: :preserve %>
```

## Broadcast a refresh

Instead of crafting a Turbo Stream for every change, tell everyone looking at a record to refresh. Morphing makes it cheap.

```ruby
class Board < ApplicationRecord
  has_many :cards
  broadcasts_refreshes
end

class Card < ApplicationRecord
  belongs_to :board, touch: true
end
```

```erb
<%= turbo_stream_from @board %>
```

## Gotchas

- Elements with state you want to keep, like an open dropdown, need `data-turbo-permanent`.
- Stimulus controllers reconnect on morph: keep `connect()` idempotent.
- Broadcast refreshes are debounced, so a burst of changes becomes one refresh.
