---
title: "turbo-palette: a ⌘K command palette for Hotwire"
excerpt: "One Stimulus controller, server-rendered results and keyboard navigation."
date: "2026-08-22T09:00:00.000Z"
tags: ["projects", "hotwire"]
authors: ["dev"]
cover: "./cover.jpg"
---

<div class="kg-card kg-callout-card kg-callout-card-grey"><div class="kg-callout-emoji">📦</div><div class="kg-callout-text"><b>Stack:</b> JavaScript, Stimulus, Turbo<br><b>License:</b> MIT<br><b>Status:</b> Active<br><b>Repository:</b> <code>github.com/example/turbo-palette</code></div></div>

A ⌘K command palette for Hotwire apps: one Stimulus controller, server-rendered results and keyboard navigation. _Example project for the theme._

```javascript
import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["dialog", "input"];

  open(event) {
    if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      this.dialogTarget.showModal();
      this.inputTarget.focus();
    }
  }
}
```

```erb
<div data-controller="palette" data-action="keydown@window->palette#open">
  <dialog data-palette-target="dialog">
    <%= form_with url: palette_path, method: :get, data: { turbo_frame: "palette_results" } do |f| %>
      <%= f.search_field :q, data: { palette_target: "input" } %>
    <% end %>
    <turbo-frame id="palette_results"></turbo-frame>
  </dialog>
</div>
```
