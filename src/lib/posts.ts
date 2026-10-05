import { getCollection, getEntries, getEntry, type CollectionEntry } from 'astro:content';
import { site, theme } from '../config';

export type Post = CollectionEntry<'posts'>;
export type Tag = CollectionEntry<'tags'>;
export type Author = CollectionEntry<'authors'>;

/** Published posts, newest first. Drafts show up in `astro dev` only. */
export async function getPosts(): Promise<Post[]> {
    const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
    return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Posts of the blog: every post except the projects tag (the /blog/ route of the Ghost version) */
export function blogPosts(posts: Post[]): Post[] {
    return posts.filter((post) => !post.data.tags.some((tag) => tag.id === theme.projectsTag));
}

/** Public tags with posts for the category pills (except the projects tag), from most to fewest posts */
export async function pillTags(posts: Post[]): Promise<{ tag: Tag; count: number }[]> {
    const tags = await getCollection('tags');
    return tags
        .filter((tag) => tag.id !== theme.projectsTag)
        .map((tag) => ({ tag, count: posts.filter((post) => post.data.tags.some((t) => t.id === tag.id)).length }))
        .filter(({ count }) => count > 0)
        .sort((a, b) => b.count - a.count);
}

/** Ghost's reading time: 275 words a minute, at least one minute */
export function readingTime(post: { body?: string }): number {
    const text = (post.body || '').replace(/<[^>]+>/g, ' ').replace(/[#>*_`~\-|[\]()!]/g, ' ');
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 275));
}

export async function postTags(post: Post): Promise<Tag[]> {
    return getEntries(post.data.tags);
}

export async function postAuthors(post: Post): Promise<Author[]> {
    if (post.data.authors.length) return getEntries(post.data.authors);
    const author = await getEntry('authors', site.defaultAuthor);
    return author ? [author] : [];
}

/** Up to `limit` posts sharing a tag with `post`, newest first (Ghost's related posts) */
export function relatedPosts(post: Post, posts: Post[], limit = 3): Post[] {
    const tags = new Set(post.data.tags.map((tag) => tag.id));
    return posts.filter((p) => p.id !== post.id && p.data.tags.some((tag) => tags.has(tag.id))).slice(0, limit);
}

export function hasAuthor(post: Post, slug: string): boolean {
    return post.data.authors.length ? post.data.authors.some((a) => a.id === slug) : slug === site.defaultAuthor;
}

export interface Pagination<T = Post> {
    page: number;
    pages: number;
    total: number;
    items: T[];
}

/** Splits a list into pages of `site.postsPerPage` */
export function paginate<T>(items: T[]): Pagination<T>[] {
    const size = site.postsPerPage;
    const pages = Math.max(1, Math.ceil(items.length / size));
    return Array.from({ length: pages }, (_, i) => ({
        page: i + 1,
        pages,
        total: items.length,
        items: items.slice(i * size, (i + 1) * size),
    }));
}

export const isoDate = (date: Date) => date.toISOString().slice(0, 10);

/** Ghost's {{date format="LL"}}: "October 4, 2026" (in the site's language) */
export const longDate = (date: Date) =>
    date.toLocaleDateString(site.locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** Ghost's {{date format="D MMM YYYY"}}: "4 Oct 2026" */
export const shortDate = (date: Date) =>
    date.toLocaleDateString(site.locale === 'en' ? 'en-GB' : site.locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
