// Prefixes root-relative links and images in Markdown ("/images/x.jpg", "/about/") with the site's base,
// so posts keep working when the site is published under a subpath like /yaru-astro/.
// Covers Markdown elements and the raw HTML of the imported Ghost cards.
import { visit } from 'unist-util-visit';

export default function rehypeBaseUrl({ base = '/' } = {}) {
    const prefix = base.replace(/\/$/, '');
    const needsPrefix = (value) => value.startsWith('/') && !value.startsWith('//') && !value.startsWith(prefix + '/');

    return (tree) => {
        if (!prefix) return;
        visit(tree, (node) => {
            if (node.type === 'element') {
                for (const attr of ['href', 'src']) {
                    const value = node.properties?.[attr];
                    if (typeof value === 'string' && needsPrefix(value)) node.properties[attr] = prefix + value;
                }
            } else if (node.type === 'raw') {
                node.value = node.value.replace(/\b(href|src)="([^"]*)"/g, (match, attr, value) =>
                    needsPrefix(value) ? `${attr}="${prefix}${value}"` : match,
                );
            }
        });
    };
}
