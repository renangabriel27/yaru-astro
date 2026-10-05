// Links that respect the site's base (BASE_PATH), so the site works under a subpath on GitHub Pages
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function url(path = '/'): string {
    if (/^(https?:|mailto:|#)/.test(path)) return path;
    return base + '/' + path.replace(/^\//, '');
}

export const postUrl = (slug: string) => url(`/${slug}/`);
export const tagUrl = (slug: string) => url(`/tag/${slug}/`);
export const authorUrl = (slug: string) => url(`/author/${slug}/`);

/** True when `href` points at the page being rendered (Ghost's nav-current) */
export function isCurrent(href: string, pathname: string): boolean {
    const clean = (p: string) => p.replace(/\/$/, '') || '/';
    return clean(url(href)) === clean(pathname);
}
