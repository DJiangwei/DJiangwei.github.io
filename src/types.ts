export type Locale = 'en' | 'zh';
export type SourceMedium = 'read' | 'listen' | 'watch';
export type SourceDomain = 'markets' | 'beyondMarkets';
export type SourceLanguage = 'en' | 'zh';
export type SourcePriority = 'core' | 'watchlist' | 'manual';
export type SummaryMode = 'bilingual' | 'en-only' | 'zh-only';
export type FeedStrategy = 'auto' | 'rss' | 'atom' | 'podcast' | 'youtube';
export type SourceSignalType =
  | 'data'
  | 'news'
  | 'opinion'
  | 'interview'
  | 'institutional'
  | 'historical'
  | 'documentary';

export interface SourceItem {
  id: string;
  title: string;
  language: SourceLanguage;
  url: string;
  note: Record<Locale, string>;
  medium: SourceMedium;
  domain: SourceDomain;
  tag?: string;
  priority?: SourcePriority;
  active?: boolean;
  strategy?: FeedStrategy;
  feedUrl?: string;
  summaryMode?: SummaryMode;
  maxItems?: number;
  regionTags?: string[];
  topicTags?: string[];
  latestItemTitle?: string;
  latestItemUrl?: string;
  latestPublishedAt?: string;
  latestItemSummary?: Record<Locale, string>;
  latestWhyItMatters?: Record<Locale, string>;
  latestItemRawSummary?: string;
  latestSignalType?: SourceSignalType;
  latestKeywords?: string[];
  trackedItemCount?: number;
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

export interface TrackingLabels {
  latestUpdate: string;
  whyItMatters: string;
  updated: string;
  signalType: string;
  priority: Record<SourcePriority, string>;
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
  trackingLabels: TrackingLabels;
  footer: FooterContent;
}

export interface TrackedSourceItem {
  sourceId: string;
  itemId: string;
  title: string;
  url: string;
  publishedAt?: string;
  rawSummary?: string;
  contentHash: string;
  summary?: Record<Locale, string>;
  whyItMatters?: Record<Locale, string>;
  signalType?: SourceSignalType;
  keywords?: string[];
  summarizedAt?: string;
  sourcePriority?: SourcePriority;
}
