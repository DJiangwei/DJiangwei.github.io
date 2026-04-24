import type { SourceItem } from '../types';

export const followedSources: SourceItem[] = [
  {
    "id": "federal-reserve-press",
    "title": "Federal Reserve Press Releases",
    "language": "en",
    "url": "https://www.federalreserve.gov/newsevents/pressreleases.htm",
    "note": {
      "en": "A core policy feed for keeping official Fed language close to the market tape.",
      "zh": "这是追踪美联储官方措辞的核心来源，适合把政策语言和市场反应放在一起看。"
    },
    "medium": "read",
    "domain": "markets",
    "tag": "Policy",
    "priority": "core",
    "active": true,
    "strategy": "rss",
    "feedUrl": "https://www.federalreserve.gov/feeds/press_all.xml",
    "summaryMode": "bilingual",
    "maxItems": 5,
    "regionTags": [
      "US",
      "Global"
    ],
    "topicTags": [
      "rates",
      "policy",
      "liquidity"
    ],
    "latestItemTitle": "Agencies finalize changes to enhance community bank leverage ratio",
    "latestItemUrl": "https://www.federalreserve.gov/newsevents/pressreleases/bcreg20260423a.htm",
    "latestPublishedAt": "2026-04-23T19:30:00.000Z",
    "latestItemRawSummary": "Agencies finalize changes to enhance community bank leverage ratio",
    "trackedItemCount": 5
  }
];
