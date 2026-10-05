#!/usr/bin/env node
// Imports a Ghost export (Settings → Advanced → Import/Export → Export your content) into the site:
//   posts  → src/content/posts/<slug>/index.md (cover image next to it)
//   pages  → src/content/pages/<slug>/index.md
//   tags   → src/data/tags.json
//   users  → src/data/authors.json (when the export has them)
//   images in the content → public/images/<slug>/
//
// Usage: npm run import:ghost -- <export.json> [--url https://your-ghost-site.com] [--force]
//   --url    your Ghost site's address, to resolve the __GHOST_URL__ placeholders of the export
//   --force  overwrite posts and pages that already exist
//
// Rich cards from the Ghost editor (callouts, toggles, bookmarks, galleries, HTML cards…) stay as HTML inside the
// Markdown, so they keep the theme's styles; everything else becomes plain Markdown.

import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith('--') && args[args.indexOf(arg) - 1] !== '--url');
const ghostUrl = (args.includes('--url') ? args[args.indexOf('--url') + 1] : '').replace(/\/$/, '');
const force = args.includes('--force');

if (!file) {
    console.error('Usage: npm run import:ghost -- <export.json> [--url https://your-ghost-site.com] [--force]');
    process.exit(1);
}

const json = JSON.parse(await readFile(file, 'utf8'));
const data = (json.db ? json.db[0] : json).data;
const byId = (list = []) => new Map(list.map((item) => [item.id, item]));
const tags = byId(data.tags);
const users = byId(data.users);

function related(joins = [], key, lookup, postId) {
    return joins
        .filter((join) => join.post_id === postId)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((join) => lookup.get(join[key]))
        .filter(Boolean);
}

function resolveUrl(src) {
    if (!src) return src;
    if (src.startsWith('__GHOST_URL__')) return ghostUrl ? src.replace('__GHOST_URL__', ghostUrl) : null;
    if (src.startsWith('/content/images/')) return ghostUrl ? ghostUrl + src : null;
    return src;
}

/** Downloads `src` to `dest` (without extension); returns the file name, or null when it fails */
async function download(src, dest) {
    const href = resolveUrl(src);
    if (!href || !/^https?:/.test(href)) {
        console.warn(`  ! skipped image ${src}${href === null ? ' (pass --url to resolve it)' : ''}`);
        return null;
    }
    try {
        const res = await fetch(href);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const ext = path.extname(new URL(href).pathname).toLowerCase() || '.jpg';
        await mkdir(path.dirname(dest), { recursive: true });
        await writeFile(dest + ext, Buffer.from(await res.arrayBuffer()));
        return path.basename(dest + ext);
    } catch (error) {
        console.warn(`  ! could not download ${href}: ${error.message}`);
        return null;
    }
}

/** Downloads every <img> of the HTML to public/images/<slug>/ and points the HTML at the copies */
async function localizeImages(html, slug) {
    // Only `src` is downloaded, so drop the responsive variants that still point at Ghost
    html = html.replace(/<img[^>]*>/g, (tag) => tag.replace(/\s(srcset|sizes)="[^"]*"/g, ''));
    const sources = [...new Set([...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]))];
    const taken = new Set();
    for (const [i, src] of sources.entries()) {
        let base = path.basename(new URL(resolveUrl(src) || src, 'http://x').pathname).replace(/\.[^.]+$/, '') || `image-${i + 1}`;
        // URLs like picsum.photos/seed/<id>/1600/1000 share their last segment
        if (taken.has(base)) base = `${base}-${i + 1}`;
        taken.add(base);
        const name = await download(src, path.join(ROOT, 'public/images', slug, base));
        if (name) html = html.replaceAll(`"${src}"`, `"/images/${slug}/${name}"`);
    }
    return html;
}

const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-', hr: '---' });
turndown.use(gfm);
// Editor cards stay as HTML, so the theme's .kg-* styles still apply
turndown.keep((node) => node.nodeType === 1 && /\bkg-card\b/.test(node.getAttribute('class') || ''));
turndown.addRule('iframe', { filter: ['iframe', 'video', 'audio'], replacement: (_, node) => `\n\n${node.outerHTML}\n\n` });

function toMarkdown(html) {
    // HTML cards go into the Markdown untouched (a placeholder paragraph holds their place during the conversion)
    const htmlCards = [];
    const clean = html
        .replace(/<!--kg-card-begin: html-->([\s\S]*?)<!--kg-card-end: html-->/g, (_, card) => {
            htmlCards.push(card.trim());
            return `<p>KGHTMLCARD${htmlCards.length - 1}</p>`;
        })
        .replace(/<!--kg-card-(begin|end):[^>]*-->/g, '');
    return turndown
        .turndown(clean)
        .replace(/^KGHTMLCARD(\d+)$/gm, (_, i) => htmlCards[i])
        .replace(/^(\s*)(-|\d+\.) {2,}/gm, '$1$2 ') // "-   item" → "- item"
        .replace(/\n{3,}/g, '\n\n')
        .trim() + '\n';
}

const yaml = (value) => JSON.stringify(value);

function frontmatter(fields) {
    const lines = Object.entries(fields)
        .filter(([, value]) => value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && !value.length))
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? `[${value.map(yaml).join(', ')}]` : yaml(value)}`);
    return `---\n${lines.join('\n')}\n---\n\n`;
}

const isoDate = (value) => value && new Date(value.replace(' ', 'T') + (/Z|[+-]\d\d:?\d\d$/.test(value) ? '' : 'Z')).toISOString();

// Tags and authors
const usedTags = new Set((data.posts_tags || []).map((join) => join.tag_id));
const tagList = [...tags.values()]
    .filter((tag) => usedTags.has(tag.id) && tag.visibility !== 'internal')
    .map((tag) => ({ id: tag.slug, name: tag.name, ...(tag.description && { description: tag.description }) }));
await mkdir(path.join(ROOT, 'src/data'), { recursive: true });
await writeFile(path.join(ROOT, 'src/data/tags.json'), JSON.stringify(tagList, null, 4) + '\n');
console.log(`tags: ${tagList.length}`);

if (users.size) {
    const authors = [...users.values()].map((user) => ({
        id: user.slug,
        name: user.name,
        ...(user.bio && { bio: user.bio }),
        ...(user.location && { location: user.location }),
        ...(user.website && { website: user.website }),
    }));
    await writeFile(path.join(ROOT, 'src/data/authors.json'), JSON.stringify(authors, null, 4) + '\n');
    console.log(`authors: ${authors.length}`);
}

// Posts and pages
let written = 0;
for (const post of data.posts) {
    if (!['published', 'draft'].includes(post.status)) continue;
    const kind = post.type === 'page' ? 'pages' : 'posts';
    const dir = path.join(ROOT, 'src/content', kind, post.slug);
    if (existsSync(dir) && !force) {
        console.log(`- ${kind}/${post.slug} already exists (use --force to overwrite)`);
        continue;
    }
    console.log(`+ ${kind}/${post.slug}`);

    const html = await localizeImages(post.html || '', post.slug);
    const cover = post.feature_image ? await download(post.feature_image, path.join(dir, 'cover')) : null;
    const postTags = related(data.posts_tags, 'tag_id', tags, post.id).filter((tag) => tag.visibility !== 'internal');
    const postAuthors = related(data.posts_authors, 'author_id', users, post.id);
    const meta = (data.posts_meta || []).find((m) => m.post_id === post.id) || {};

    const fields = {
        title: post.title,
        excerpt: post.custom_excerpt,
        ...(kind === 'posts' && {
            date: isoDate(post.published_at || post.created_at),
            tags: postTags.map((tag) => tag.slug),
            authors: postAuthors.map((user) => user.slug),
            featured: post.featured ? true : undefined,
            draft: post.status === 'draft' ? true : undefined,
        }),
        ...(kind === 'pages' && post.show_title_and_feature_image === 0 && { showTitle: false }),
        cover: cover && `./${cover}`,
        coverAlt: meta.feature_image_alt,
        coverCaption: meta.feature_image_caption,
    };

    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'index.md'), frontmatter(fields) + toMarkdown(html));
    written += 1;
}
console.log(`done: ${written} written`);
