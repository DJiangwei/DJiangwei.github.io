import { RevealSection } from './RevealSection';
import type { MarketLensContent } from '../types';

interface MarketLensProps {
  content: MarketLensContent;
}

export function MarketLens({ content }: MarketLensProps) {
  return (
    <RevealSection id="method">
      <div className="section-head">
        <div>
          <p className="kicker">{content.kicker}</p>
          <h2 className="section-title">{content.title}</h2>
          <p className="section-intro">{content.intro}</p>
        </div>
      </div>

      <div className="lens-layout">
        <ol className="lens-list">
          {content.bullets.map((bullet) => (
            <li className="lens-item" key={bullet}>
              <p className="lens-note">{bullet}</p>
            </li>
          ))}
        </ol>

        <div className="lens-side">
          <div className="framework-panel">
            <p className="principles-title">{content.frameworkTitle}</p>
            {content.framework.map((item) => (
              <div className="meta-block" key={item.label}>
                <p className="meta-label">{item.label}</p>
                <p className="meta-value">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="lens-closing">
            <p>{content.closing}</p>
          </div>
        </div>
      </div>

      <div className="about-layout lens-method-detail">
        <div className="about-copy">
          {content.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="about-principles">
          <p className="principles-title">{content.principlesTitle}</p>
          <ul className="principles-list">
            {content.principles.map((principle) => (
              <li key={principle}>{principle}</li>
            ))}
          </ul>
        </div>
      </div>
    </RevealSection>
  );
}
