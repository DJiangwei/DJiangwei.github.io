import type { MouseEvent } from 'react';
import { getPostHref } from '../content/routes';
import type { ArticleItem, ArticleLabels, Locale } from '../types';

interface ArticlePageProps {
  post?: ArticleItem;
  locale: Locale;
  labels: ArticleLabels;
  translation?: ArticleItem;
  writingHref: string;
  homeHref: string;
  onNavigate: (href: string) => void;
}

function formatArticleDate(value: string | undefined, locale: Locale) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(parsed);
}

function shouldHandleAsInternalClick(event: MouseEvent<HTMLAnchorElement>) {
  return !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.altKey && !event.ctrlKey && !event.shiftKey;
}

export function ArticlePage({
  post,
  locale,
  labels,
  translation,
  writingHref,
  homeHref,
  onNavigate,
}: ArticlePageProps) {
  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!shouldHandleAsInternalClick(event)) {
      return;
    }

    event.preventDefault();
    onNavigate(href);
  };

  if (!post) {
    return (
      <section className="article-page article-not-found">
        <p className="kicker">{labels.backToWriting}</p>
        <h1 className="article-title">{labels.notFoundTitle}</h1>
        <p className="article-dek">{labels.notFoundBody}</p>
        <a className="hero-cta" href={homeHref} onClick={(event) => handleNavigate(event, homeHref)}>
          {labels.returnHome}
        </a>
      </section>
    );
  }

  const publishedAt = formatArticleDate(post.publishedAt, locale);
  const updatedAt = formatArticleDate(post.updatedAt, locale);
  const translationHref = translation ? getPostHref(translation.locale, translation.slug) : null;

  return (
    <article className="article-page">
      <div className="article-back-row">
        <a
          className="source-link"
          href={writingHref}
          onClick={(event) => handleNavigate(event, writingHref)}
        >
          {labels.backToWriting}
        </a>
        {translationHref ? (
          <a
            className="article-translation"
            href={translationHref}
            onClick={(event) => handleNavigate(event, translationHref)}
          >
            {labels.translation}
          </a>
        ) : null}
      </div>

      <header className="article-hero">
        <div className="article-meta-line">
          {publishedAt ? (
            <span>
              {labels.published} {publishedAt}
            </span>
          ) : null}
          {updatedAt ? (
            <span>
              {labels.updated} {updatedAt}
            </span>
          ) : null}
          <span>
            {labels.readingTime} {post.readingTimeMinutes} {labels.minute}
          </span>
        </div>
        <h1 className="article-title">{post.title}</h1>
        <p className="article-dek">{post.summary}</p>
        <div className="writing-tags" aria-label="Tags">
          {post.tags.map((tag) => (
            <span className="source-tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div
        className="article-body"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </article>
  );
}
