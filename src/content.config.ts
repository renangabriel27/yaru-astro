import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { file, glob } from 'astro/loaders';

// A post is either src/content/posts/<slug>.md or src/content/posts/<slug>/index.md (with its images next to it).
// The id, and so the URL, is the file or folder name.
const slugFromPath = ({ entry }: { entry: string }) => entry.replace(/\/index\.mdx?$/, '').replace(/\.mdx?$/, '');

const posts = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/posts', generateId: slugFromPath }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            /** Subtitle shown under the title and in the list (Ghost's custom excerpt) */
            excerpt: z.string().optional(),
            date: z.coerce.date(),
            updated: z.coerce.date().optional(),
            /** Tag slugs from src/data/tags.json; the first one is the primary tag */
            tags: z.array(reference('tags')).default([]),
            /** Author slugs from src/data/authors.json; empty = the default author in src/config.ts */
            authors: z.array(reference('authors')).default([]),
            cover: image().optional(),
            coverAlt: z.string().optional(),
            coverCaption: z.string().optional(),
            featured: z.boolean().default(false),
            draft: z.boolean().default(false),
        }),
});

const pages = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/pages', generateId: slugFromPath }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            excerpt: z.string().optional(),
            /** Show the breadcrumb, title, excerpt and cover (Ghost's "Show title and feature image") */
            showTitle: z.boolean().default(true),
            cover: image().optional(),
            coverAlt: z.string().optional(),
            coverCaption: z.string().optional(),
        }),
});

const tags = defineCollection({
    loader: file('src/data/tags.json'),
    schema: z.object({
        name: z.string(),
        description: z.string().optional(),
    }),
});

const authors = defineCollection({
    loader: file('src/data/authors.json'),
    schema: ({ image }) =>
        z.object({
            name: z.string(),
            bio: z.string().optional(),
            avatar: image().optional(),
            location: z.string().optional(),
            website: z.url().optional(),
            /** Profile URLs, shown as links on the author page */
            social: z
                .object({
                    x: z.url(),
                    linkedin: z.url(),
                    bluesky: z.url(),
                    mastodon: z.url(),
                    instagram: z.url(),
                    youtube: z.url(),
                    github: z.url(),
                })
                .partial()
                .default({}),
        }),
});

export const collections = { posts, pages, tags, authors };
