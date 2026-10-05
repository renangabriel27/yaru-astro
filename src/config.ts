// Site settings and theme options. In the Ghost version these lived in Ghost Admin
// (Settings → General, Navigation and Design & branding); here you edit them and redeploy.

export type Locale = 'en' | 'pt-BR';

export interface NavItem {
    label: string;
    url: string;
}

export const site = {
    title: 'dev@localhost',
    description: 'Notes on Ruby on Rails, AI-assisted development and open source.',
    /** Accent color (Ghost's Settings → Design → Accent color). Ubuntu orange */
    accentColor: '#E95420',
    /** 'en' or 'pt-BR': language of the interface strings and of <html lang> */
    locale: 'en' as Locale,
    /** Slug of the author used when a post doesn't list any (see src/data/authors.json) */
    defaultAuthor: 'dev',
    postsPerPage: 5,
    /** A few short items: categories live in the pills on /blog/ and the tag pages. Extra items go into the ⋮ menu */
    navigation: [
        { label: 'Home', url: '/' },
        { label: 'Blog', url: '/blog/' },
        { label: 'Projects', url: '/tag/projects/' },
        { label: 'About', url: '/about/' },
    ] as NavItem[],
    secondaryNavigation: [
        { label: 'About', url: '/about/' },
        { label: 'Uses', url: '/uses/' },
        { label: 'Contact', url: '/contact/' },
        { label: 'RSS', url: '/rss.xml' },
    ] as NavItem[],
    /** Social profiles shown in the footer. Leave empty to hide one. */
    social: {
        x: '',
        facebook: '',
        linkedin: 'https://www.linkedin.com/in/dev',
        bluesky: 'https://bsky.app/profile/dev.bsky.social',
        mastodon: '',
        threads: '',
        instagram: '',
        youtube: '',
        tiktok: '',
        github: 'https://github.com/renangabriel27',
    },
};

export const theme = {
    /** user@host of the terminal prompt (breadcrumb and top of the home page). Empty = just "~$" */
    terminalPrompt: 'guest@localhost',
    /** Slug of the portfolio tag: left out of /blog/ and of the category pills */
    projectsTag: 'projects',
    /** Title search in the prompt on the home, blog, tag and author pages. When off, the prompt shows the command */
    promptSearch: true,
    /** Blinking orange cursor in the search prompt */
    showBlinkingCursor: true,

    // Homepage
    /** Large intro sentence above the post list */
    showHomeIntro: true,
    /** The intro sentence; empty = site description */
    homeIntroText: '',
    /** 01, 02… numbering in the post list */
    showPostNumbers: true,
    showAuthor: true,
    showReadingTime: true,
    showPublishDate: false,

    // Post
    /** Prompt-style breadcrumb at the top of posts and pages */
    showBreadcrumb: true,
    /** Code blocks with a GNOME window headerbar */
    codeBlocksAsWindows: true,
    /** Code colors inside the window: Ubuntu terminal ('Yaru') or ray.so palette ('Ray.so') */
    codeStyle: 'Yaru' as 'Yaru' | 'Ray.so',
    /** Syntax colors in code blocks (Prism, applied when the site is built) */
    syntaxHighlighting: true,
    showRelatedArticles: true,
};

/**
 * Newsletter block (end of posts and footer). Static sites have no members, so the form posts the
 * email to a newsletter service: set `action` to its form endpoint, e.g. Buttondown's
 * "https://buttondown.com/api/emails/embed-subscribe/<username>". Empty = no newsletter block.
 */
export const newsletter = {
    action: '',
    /** Empty = site title */
    heading: '',
    /** Empty = site description */
    subheading: '',
    showOnPosts: true,
};
