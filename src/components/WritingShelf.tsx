import type { MouseEvent } from 'react';
import { getPostHref } from '../content/routes';
import type { ArticleItem, ArticleLabels, Locale, WritingSectionContent } from '../types';
import { RevealSection } from './RevealSection';

interface WritingShelfProps {
  content: WritingSectionContent;
  labels: ArticleLabels;
  locale: Locale;
  featuredPost?: ArticleItem;
  recentPosts: ArticleItem[];
  onNavigate: (href: string) => void;
}

function formatPostDate(value: string | undefined, locale: Locale) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(parsed);
}

function getArticleMeta(post: ArticleItem, locale: Locale, labels: ArticleLabels) {
  const date = formatPostDate(post.publishedAt, locale);
  const readingTime = `${post.readingTimeMinutes} ${labels.minute}`;

  return [date, readingTime].filter(Boolean).join(' / ');
}

function shouldHandleAsInternalClick(event: MouseEvent<HTMLAnchorElement>) {
  return !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.altKey && !event.ctrlKey && !event.shiftKey;
}

export function WritingShelf({
  content,
  labels,
  locale,
  featuredPost,
  recentPosts,
  onNavigate,
}: WritingShelfProps) {
  const hasPosts = Boolean(featuredPost) || recentPosts.length > 0;

  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!shouldHandleAsInternalClick(event)) {
      return;
    }

    event.preventDefault();
    onNavigate(href);
  };

  return (
    <RevealSection id="writing" className="writing-section">
      <div className="section-head">
        <div>
          <p className="kicker">{content.kicker}</p>
          <h2 className="section-title">{content.title}</h2>
          <p className="section-intro">{content.intro}</p>
        </div>
      </div>

      {hasPosts ? (
        <div className="writing-layout">
          {featuredPost ? (
            <article className="writing-feature">
              <p className="writing-label">{content.featuredLabel}</p>
              <a
                className="writing-feature-title"
                href={getPostHref(featuredPost.locale, featuredPost.slug)}
                onClick={(event) =>
                  handleNavigate(event, getPostHref(featuredPost.locale, featuredPost.slug))
                }
              >
                {featuredPost.title}
              </a>
              <p className="writing-meta">
                {getArticleMeta(featuredPost, locale, labels)}
              </p>
              <p className="writing-summary">{featuredPost.summary}</p>
              <div className="writing-tags" aria-label="Tags">
                {featuredPost.tags.map((tag) => (
                  <span className="source-tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <a
                className="source-link"
                href={getPostHref(featuredPost.locale, featuredPost.slug)}
                onClick={(event) =>
                  handleNavigate(event, getPostHref(featuredPost.locale, featuredPost.slug))
                }
              >
                {labels.readArticle}
              </a>
            </article>
          ) : null}

          <div className="writing-list-panel">
            <p className="principles-title">{content.recentLabel}</p>
            <ol className="writing-list">
              {recentPosts.map((post) => {
                const href = getPostHref(post.locale, post.slug);

                return (
                  <li className="writing-list-item" key={post.id}>
                    <a
                      className="writing-list-title"
                      href={href}
                      onClick={(event) => handleNavigate(event, href)}
                    >
                      {post.title}
                    </a>
                    <p className="writing-meta">{getArticleMeta(post, locale, labels)}</p>
                    <p className="writing-list-summary">{post.summary}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      ) : (
        <p className="writing-empty">{content.emptyState}</p>
      )}
    </RevealSection>
  );
}
