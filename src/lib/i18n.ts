// Interface strings. English is the key itself; pt-BR comes from the Ghost theme's locale file.
import ptBR from '../i18n/pt-BR.json';
import { site } from '../config';

const dictionaries: Record<string, Record<string, string>> = { 'pt-BR': ptBR };

/** Translates a string; `{name}` placeholders are replaced by `vars` and `%` by `vars.n` */
export function t(key: string, vars: Record<string, string | number> = {}): string {
    let text = dictionaries[site.locale]?.[key] || key;
    for (const [name, value] of Object.entries(vars)) {
        text = name === 'n' ? text.replace('%', String(value)) : text.replaceAll(`{${name}}`, String(value));
    }
    return text;
}

/** Ghost's {{plural}}: picks the empty, singular or plural string */
export function plural(count: number, empty: string, singular: string, many: string): string {
    if (count === 0) return t(empty);
    if (count === 1) return t(singular);
    return t(many, { n: count });
}
