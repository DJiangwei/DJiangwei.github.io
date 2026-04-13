import { RevealSection } from './RevealSection';
import type { Locale, SourceItem, SourceMedium, SourceSectionContent } from '../types';
import { sourceMediumOrder } from '../content/siteContent';

interface SourceColumnsProps {
  id: string;
  content: SourceSectionContent;
  locale: Locale;
  mediumLabels: Record<SourceMedium, string>;
  actionLabel: string;
  sources: Record<SourceMedium, SourceItem[]>;
}

function getLanguageBadge(language: SourceItem['language']) {
  return language === 'zh' ? '中文' : 'EN';
}

export function SourceColumns({
  id,
  content,
  locale,
  mediumLabels,
  actionLabel,
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

