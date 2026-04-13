export type Locale = 'en' | 'zh';
export type SourceMedium = 'read' | 'listen' | 'watch';
export type SourceDomain = 'markets' | 'beyondMarkets';
export type SourceLanguage = 'en' | 'zh';

export interface SourceItem {
  id: string;
  title: string;
  language: SourceLanguage;
  url: string;
  note: Record<Locale, string>;
  medium: SourceMedium;
  domain: SourceDomain;
  tag?: string;
}

export interface HeroMetaItem {
  label: string;
  value: string;
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  role: string;
  summary: string;
  secondary: string;
  cta: string;
}

export interface SectionIntro {
  kicker: string;
  title: string;
  intro: string;
}

export interface MarketLensContent extends SectionIntro {
  bullets: string[];
  frameworkTitle: string;
  framework: HeroMetaItem[];
  closing: string;
  paragraphs: string[];
  principlesTitle: string;
  principles: string[];
}

export interface SourceSectionContent extends SectionIntro {
  quote: string;
}

export interface AboutContent extends SectionIntro {
  paragraphs: string[];
  principlesTitle: string;
  principles: string[];
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterContent {
  note: string;
  links: FooterLink[];
}

export interface SiteLocaleContent {
  brand: string;
  subtitle: string;
  languageToggleLabel: string;
  nav: {
    about: string;
    marketSources: string;
    beyondMarkets: string;
    method: string;
  };
  hero: HeroContent;
  marketLens: MarketLensContent;
  marketSources: SourceSectionContent;
  beyondMarkets: SourceSectionContent;
  about: AboutContent;
  mediumLabels: Record<SourceMedium, string>;
  sourceAction: string;
  footer: FooterContent;
}
