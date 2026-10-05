---
title: "Yaru theme style guide"
excerpt: "Palette, typography, editor cards and every theme option in one place."
date: "2026-08-13T09:00:00.000Z"
tags: ["design"]
authors: ["dev"]
cover: "./cover.jpg"
---

This post collects **the visual elements of the Yaru theme** and **the options you can change in `src/config.ts`**. Use it as a reference when writing: everything here is plain Markdown, plus the HTML of the Ghost editor cards (callouts, toggles, bookmarks, galleries) for the richer blocks.

## Palette

The theme follows Ubuntu 24.04's Yaru dark: charcoal surfaces, light text and the Ubuntu orange only in the details (cursor, active tab, links, buttons and focus).

<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;font-family:var(--font-mono);font-size:1.3rem;">
  <div><div style="height:56px;border-radius:6px;background:#1d1d1d;border:1px solid #3d3d3d"></div><div style="margin-top:6px;color:#f6f6f6">Background</div><div style="color:#8f8f8f">#1d1d1d</div></div>
  <div><div style="height:56px;border-radius:6px;background:#242424;border:1px solid #3d3d3d"></div><div style="margin-top:6px;color:#f6f6f6">Surface</div><div style="color:#8f8f8f">#242424</div></div>
  <div><div style="height:56px;border-radius:6px;background:#303030;border:1px solid #3d3d3d"></div><div style="margin-top:6px;color:#f6f6f6">Headerbar</div><div style="color:#8f8f8f">#303030</div></div>
  <div><div style="height:56px;border-radius:6px;background:#171421;border:1px solid #3d3d3d"></div><div style="margin-top:6px;color:#f6f6f6">Terminal</div><div style="color:#8f8f8f">#171421</div></div>
  <div><div style="height:56px;border-radius:6px;background:#f6f6f6"></div><div style="margin-top:6px;color:#f6f6f6">Headings</div><div style="color:#8f8f8f">#f6f6f6</div></div>
  <div><div style="height:56px;border-radius:6px;background:#c4c4c4"></div><div style="margin-top:6px;color:#f6f6f6">Body</div><div style="color:#8f8f8f">#c4c4c4</div></div>
  <div><div style="height:56px;border-radius:6px;background:#8f8f8f"></div><div style="margin-top:6px;color:#f6f6f6">Secondary</div><div style="color:#8f8f8f">#8f8f8f</div></div>
  <div><div style="height:56px;border-radius:6px;background:#e95420"></div><div style="margin-top:6px;color:#f6f6f6">Ubuntu orange</div><div style="color:#8f8f8f">#e95420</div></div>
  <div><div style="height:56px;border-radius:6px;background:#8ae234"></div><div style="margin-top:6px;color:#f6f6f6">Prompt: user</div><div style="color:#8f8f8f">#8ae234</div></div>
  <div><div style="height:56px;border-radius:6px;background:#729fcf"></div><div style="margin-top:6px;color:#f6f6f6">Prompt: path</div><div style="color:#8f8f8f">#729fcf</div></div>
</div>

The orange comes from `site.accentColor` in `src/config.ts`. Recommended: `#E95420`.

## Typography

Text is set in **Ubuntu Sans**; code, metadata and prompts in `Ubuntu Sans Mono`. Both fonts ship with the theme. If you pick another font in Design & branding → Typography, it replaces Ubuntu Sans.

A paragraph with **bold**, _italic_, [a link](https://ubuntu.com) and `inline code`. Body text uses a softer grey than headings, so long reads are easier on the eyes on a dark background.

## Heading level 2

Use H2 for the main sections of a post.

### Heading level 3

Use H3 for subsections.

#### Heading level 4

Use H4 for smaller groups.

## Lists

- Unordered list item
- Second item with **bold**
- Third item

1. First step
2. Second step
    1. Sub-step
3. Third step

## Quotes

> Default quote: italic, light text and an accent-colored bar on the left.

Alternative quote: larger and without the bar. In the editor, click the quote button twice.

## Code

With `code_blocks_as_windows` on, every code block becomes a GNOME window. The window title is the language picked in the editor's code card.

With `syntax_highlighting` on, code gets the Ubuntu terminal colors: keywords, strings, numbers, functions, tags and properties, variables, and _comments_ in grey. It works with JavaScript, TypeScript, JSX, HTML, CSS, SCSS, Handlebars, JSON, YAML, Markdown, Bash, Dockerfile, Nginx, INI, TOML, diff, SQL, GraphQL, Python, Ruby, ERB, PHP, Go, Rust, Java, Kotlin, C, C++, C#, Swift, Lua and Elixir.

```bash
sudo apt update && sudo apt upgrade -y
gsettings set org.gnome.desktop.interface color-scheme 'prefer-dark'
```

```javascript
// Greeting with a template string
const greet = (name, times = 1) => {
  if (!name) return null;
  return `Hello, ${name}!`.repeat(times);
};
```

```ruby
class Post < ApplicationRecord
  # Posts published in the last 30 days
  scope :recent, -> { where(published_at: 30.days.ago..) }

  def short_title(limit = 40)
    title.truncate(limit)
  end
end
```

```css
.gh-content pre {
  color: #e6e6e6;
  background-color: var(--color-terminal-bg);
  border-radius: 12px;
}
```

To change how code blocks look, use the `code_style` option: **Yaru** or **Ray.so**.

Without a language, the window is titled "Terminal":

```
$ uname -a
Linux yaru 6.8.0-generic x86_64 GNU/Linux
```

## Images

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/images/style-guide/1200.jpg" class="kg-image" alt="Image at text width" width="1600" height="1000"><figcaption>Image at text width, with a caption.</figcaption></figure>

<figure class="kg-card kg-image-card kg-width-wide kg-card-hascaption"><img src="/images/style-guide/1200-2.jpg" class="kg-image" alt="Wide image" width="1600" height="900"><figcaption>Wide image (the image card's <em>Wide</em> option).</figcaption></figure>

<figure class="kg-card kg-gallery-card kg-width-wide kg-card-hascaption"><div class="kg-gallery-container"><div class="kg-gallery-row"><div class="kg-gallery-image"><img src="/images/style-guide/1200-3.jpg" width="800" height="600" alt=""></div><div class="kg-gallery-image"><img src="/images/style-guide/1200-4.jpg" width="800" height="600" alt=""></div><div class="kg-gallery-image"><img src="/images/style-guide/1200-5.jpg" width="800" height="600" alt=""></div></div></div><figcaption>A gallery with three images.</figcaption></figure>

## Cards

<div class="kg-card kg-callout-card kg-callout-card-accent"><div class="kg-callout-emoji">💡</div><div class="kg-callout-text">Accent callout, for tips and important notes.</div></div>

<div class="kg-card kg-callout-card kg-callout-card-grey"><div class="kg-callout-emoji">📌</div><div class="kg-callout-text">Grey callout, for neutral remarks.</div></div>

<div class="kg-card kg-button-card kg-align-center"><a href="#/portal/signup" class="kg-btn kg-btn-accent">Accent button</a></div>

<div class="kg-card kg-toggle-card" data-kg-toggle-state="close"><div class="kg-toggle-heading"><h4 class="kg-toggle-heading-text">Frequently asked question (toggle)</h4><button class="kg-toggle-card-icon"></button></div><div class="kg-toggle-content"><p>The answer stays hidden until the reader clicks.</p></div></div>

<figure class="kg-card kg-bookmark-card"><a class="kg-bookmark-container" href="https://ghost.org/docs/themes/"><div class="kg-bookmark-content"><div class="kg-bookmark-title">Ghost Themes — official documentation</div><div class="kg-bookmark-description">Bookmark card with a title, description, metadata and thumbnail.</div><div class="kg-bookmark-metadata"><span class="kg-bookmark-author">Ghost</span><span class="kg-bookmark-publisher">ghost.org</span></div></div><div class="kg-bookmark-thumbnail"><img src="/images/style-guide/1200-6.jpg" alt=""></div></a></figure>

| Element | Font | Color |
| --- | --- | --- |
| Headings | Ubuntu Sans | `#f6f6f6` |
| Body | Ubuntu Sans | `#c4c4c4` |
| Metadata | Ubuntu Sans Mono | `#8f8f8f` |

---

## Theme options

All of them live in `theme` and `newsletter` in **`src/config.ts`**. Change them and rebuild the site.

### Site-wide

- `terminalPrompt` — user@host of the terminal prompt (home, breadcrumb, tag, author, 404). Empty = just `~$`. _Default: `guest@localhost`._
- `projectsTag` — Slug of the portfolio tag. Its posts are left out of `/blog/` and it doesn't show up in the category pills. _Default: `projects`._
- `promptSearch` — Title search in the prompt on the home, blog, tag and author pages: type after the `$` and the list is filtered. `/` focuses the search, `Enter` opens the first result and `Esc` clears it. _Default: on._
- `showBlinkingCursor` — Blinking orange cursor in the search prompt. _Default: on._
- `newsletter.heading` — Heading of the newsletter block (end of posts and footer). _Default: site title._
- `newsletter.subheading` — Text of the newsletter block. _Default: site description._
- `site.social` — Profile links (GitHub, Bluesky, LinkedIn…). Filled-in ones show up as icons in the footer.

### Homepage

- `showHomeIntro` — Large intro sentence at the top of the home page. _Default: on._
- `homeIntroText` — The intro sentence. _Default: site description._
- `showPostNumbers` — 01, 02… numbering in the post list. _Default: on._
- `showAuthor` — "BY AUTHOR" in the list metadata. _Default: on._
- `showReadingTime` — Reading time in the list. _Default: on._
- `showPublishDate` — Publish date in the list. _Default: off._

### Post

- `showBreadcrumb` — Prompt-style breadcrumb (`~/tag$`) at the top of posts and pages. _Default: on._
- `codeBlocksAsWindows` — Code blocks as GNOME windows, like the ones in the [Code](#code) section. _Default: on._
- `codeStyle` — Colors inside the code window: **Yaru** (Ubuntu terminal colors) or **Ray.so** (the same GNOME window, with a purple background, semibold text and pink, yellow, green and cyan colors). _Default: Yaru._
- `syntaxHighlighting` — Syntax colors in code blocks (Prism, applied at build time). _Default: on._
- `newsletter.showOnPosts` — Newsletter block at the end of posts (needs `newsletter.action`). _Default: on._
- `showRelatedArticles` — "Read next": three numbered posts that share tags with the current one. _Default: on._

## Recommended setup

- **Accent color** (`site.accentColor`): `#E95420`.
- **Primary navigation** (`site.navigation`): a few short items, such as Home, Blog, Projects and About. Categories live in the pills on the Blog and tag pages. The current page gets the orange bar; items that don't fit go into the `⋮` menu.
- **Secondary navigation** (`site.secondaryNavigation`): footer links (e.g. About, Uses, Contact, RSS).
- **Title**: set in mono, exactly as written in `site.title`.
- **Language** (`site.locale`): the site ships with English (`en`) and Brazilian Portuguese (`pt-BR`).
- **Tags** (`src/data/tags.json`): the first tag of a post is its primary tag, shown in the metadata and the breadcrumb; "Read next" uses shared tags.
