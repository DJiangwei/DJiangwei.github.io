import type { HeroContent } from '../types';

interface HeroProps {
  content: HeroContent;
}

export function Hero({ content }: HeroProps) {
  return (
    <section className="hero" id="top">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow hero-line hero-line-1">{content.eyebrow}</p>
          <h1 className="hero-title hero-line hero-line-2">{content.title}</h1>
          <p className="hero-role hero-line hero-line-3">{content.role}</p>
          <p className="hero-summary hero-line hero-line-4">{content.summary}</p>
          <p className="hero-secondary hero-line hero-line-5">{content.secondary}</p>
          <a className="hero-cta hero-line hero-line-6" href="#market-sources">
            {content.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
