import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../config';
import { getPosts } from '../lib/posts';
import { postUrl } from '../lib/url';

export async function GET(context: APIContext) {
    const posts = await getPosts();
    return rss({
        title: site.title,
        description: site.description,
        site: new URL(import.meta.env.BASE_URL, context.site),
        items: posts.map((post) => ({
            title: post.data.title,
            description: post.data.excerpt,
            pubDate: post.data.date,
            link: postUrl(post.id),
        })),
        customData: `<language>${site.locale}</language>`,
    });
}
