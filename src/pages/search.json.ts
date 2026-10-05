// Index for the prompt's title search (Ghost's Content API did this job): every post's title, URL, tags and authors
import { getPosts, postAuthors, postTags } from '../lib/posts';
import { postUrl } from '../lib/url';

export async function GET() {
    const posts = await getPosts();
    const index = await Promise.all(
        posts.map(async (post) => {
            const tags = await postTags(post);
            const authors = await postAuthors(post);
            return {
                title: post.data.title,
                url: postUrl(post.id),
                tag: tags[0]?.data.name ?? '',
                tags: tags.map((tag) => tag.id),
                authors: authors.map((author) => author.data.name).join(', '),
                authorSlugs: authors.map((author) => author.id),
            };
        }),
    );
    return Response.json(index);
}
