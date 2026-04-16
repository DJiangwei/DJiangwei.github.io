import type { Locale } from '../types';

export type AppRoute =
  | { kind: 'home'; locale?: Locale }
  | { kind: 'post'; locale: Locale; slug: string }
  | { kind: 'notFound'; locale?: Locale };

const basePath = import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalizedPath}` || '/';
}

export function getHomeHref(locale: Locale) {
  return withBase(locale === 'zh' ? '/zh/' : '/');
}

export function getSectionHref(locale: Locale, sectionId: string) {
  return `${getHomeHref(locale)}#${sectionId}`;
}

export function getPostHref(locale: Locale, slug: string) {
  return withBase(locale === 'zh' ? `/zh/writing/${slug}` : `/writing/${slug}`);
}

function stripBase(pathname: string) {
  if (!basePath) {
    return pathname;
  }

  if (pathname === basePath) {
    return '/';
  }

  if (pathname.startsWith(`${basePath}/`)) {
    return pathname.slice(basePath.length);
  }

  return pathname;
}

export function parseRoute(pathname: string): AppRoute {
  const parts = stripBase(pathname).split('/').filter(Boolean);

  if (parts.length === 0) {
    return { kind: 'home' };
  }

  if (parts.length === 1 && parts[0] === 'zh') {
    return { kind: 'home', locale: 'zh' };
  }

  if (parts.length === 2 && parts[0] === 'writing') {
    return { kind: 'post', locale: 'en', slug: parts[1] };
  }

  if (parts.length === 3 && parts[0] === 'zh' && parts[1] === 'writing') {
    return { kind: 'post', locale: 'zh', slug: parts[2] };
  }

  return { kind: 'notFound', locale: parts[0] === 'zh' ? 'zh' : undefined };
}
