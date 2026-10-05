// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import rehypeBaseUrl from './src/lib/rehype-base-url.mjs';

// SITE_URL and BASE_PATH come from the deploy workflow; locally the site runs at "/".
// A GitHub Pages project site lives under /<repo>/, a custom domain or Cloudflare Pages under "/".
const site = process.env.SITE_URL || 'https://example.com';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
    site,
    base,
    trailingSlash: 'ignore',
    integrations: [sitemap()],
    markdown: {
        // Prism tokens, colored by the theme (Yaru or Ray.so palette); the Ghost version ran Prism in the browser
        syntaxHighlight: 'prism',
        processor: unified({ rehypePlugins: [[rehypeBaseUrl, { base }]] }),
    },
});
