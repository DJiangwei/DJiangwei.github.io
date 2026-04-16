import type { ArticleItem, Locale } from '../types';
import { posts } from './posts.generated';

export const publishedPosts = posts.filter((post) => post.status === 'published');

export function getPostsForLocale(locale: Locale) {
  return publishedPosts.filter((post) => post.locale === locale);
}

export function getPostBySlug(locale: Locale, slug: string) {
  return publishedPosts.find((post) => post.locale === locale && post.slug === slug);
}

export function getPostTranslation(post: ArticleItem, locale: Locale) {
  if (post.locale === locale) {
    return post;
  }

  return publishedPosts.find(
    (candidate) =>
      candidate.locale === locale && candidate.translationKey === post.translationKey,
  );
}

export function getFeaturedPost(locale: Locale) {
  const localePosts = getPostsForLocale(locale);
  return localePosts.find((post) => post.featured) ?? localePosts[0];
}

export function getRecentPosts(locale: Locale, excludedId?: string, limit = 4) {
  return getPostsForLocale(locale)
    .filter((post) => post.id !== excludedId)
    .slice(0, limit);
}
