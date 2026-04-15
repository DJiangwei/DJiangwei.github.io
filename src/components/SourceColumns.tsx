import { RevealSection } from './RevealSection';
import type {
  Locale,
  SourceItem,
  SourceMedium,
  SourceSectionContent,
  SiteLocaleContent,
} from '../types';
import { sourceMediumOrder } from '../content/siteContent';

interface SourceColumnsProps {
  id: string;
  content: SourceSectionContent;
  locale: Locale;
  mediumLabels: Record<SourceMedium, string>;
  actionLabel: string;
  trackingLabels: SiteLocaleContent['trackingLabels'];
  sources: Record<SourceMedium, SourceItem[]>;
}

function getLanguageBadge(language: SourceItem['language']) {
  return language === 'zh' ? '中文' : 'EN';
}

function formatTrackedDate(value: string | undefined, locale: Locale) {
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

export function SourceColumns({
  id,
  content,
  locale,
  mediumLabels,
  actionLabel,
  trackingLabels,
  sources,
}: SourceColumnsProps) {
  return (
    <RevealSection id={id}>
      <div className="section-head">
        <div>
          <p className="kicker">{content.kicker}</p>
          <h2 className="section-title">{content.title}</h2>
          <p className="section-intro">{content.intro}</p>
        </div>
        <p className="section-quote">{content.quote}</p>
      </div>

      <div className="source-columns">
        {sourceMediumOrder.map((medium) => (
          <div className="source-column" key={medium}>
            <div className="source-column-header">
              <h3 className="source-column-title">{mediumLabels[medium]}</h3>
              <span className="source-column-count">{sources[medium].length}</span>
            </div>

            <ul className="source-list">
              {sources[medium].map((item) => (
                <li className="source-item" key={item.id}>
                  <div className="source-item-head">
                    <span className="source-badge">{getLanguageBadge(item.language)}</span>
                    {item.tag ? <span className="source-tag">{item.tag}</span> : null}
                    {item.priority ? (
                      <span className="source-tag">
                        {trackingLabels.priority[item.priority]}
                      </span>
                    ) : null}
                  </div>
                  <a
                    className="source-title"
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.title}
                  </a>
                  <p className="source-note">{item.note[locale]}</p>
                  {item.latestItemTitle ? (
                    <div className="tracked-update">
                      <p className="tracked-label">{trackingLabels.latestUpdate}</p>
                      <a
                        className="tracked-title"
                        href={item.latestItemUrl ?? item.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.latestItemTitle}
                      </a>
                      {item.latestPublishedAt ? (
                        <p className="tracked-meta">
                          {trackingLabels.updated} {formatTrackedDate(item.latestPublishedAt, locale)}
                        </p>
                      ) : null}
                      {item.latestItemSummary?.[locale] ? (
                        <p className="tracked-summary">{item.latestItemSummary[locale]}</p>
                      ) : item.latestItemRawSummary ? (
                        <p className="tracked-summary">{item.latestItemRawSummary}</p>
                      ) : null}
                      {item.latestWhyItMatters?.[locale] ? (
                        <p className="tracked-why">
                          <span className="tracked-why-label">
                            {trackingLabels.whyItMatters}
                          </span>{' '}
                          {item.latestWhyItMatters[locale]}
                        </p>
                      ) : null}
                      {item.latestSignalType ? (
                        <p className="tracked-signal">
                          {trackingLabels.signalType}: {item.latestSignalType}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                  <a
                    className="source-link"
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {actionLabel}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </RevealSection>
  );
}
