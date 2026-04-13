import { RevealSection } from './RevealSection';
import type { AboutContent } from '../types';

interface AboutMethodProps {
  content: AboutContent;
}

export function AboutMethod({ content }: AboutMethodProps) {
  return (
    <RevealSection id="method">
      <div className="section-head">
        <div>
          <p className="kicker">{content.kicker}</p>
          <h2 className="section-title">{content.title}</h2>
          <p className="section-intro">{content.intro}</p>
        </div>
      </div>

      <div className="about-layout">
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

