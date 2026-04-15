import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const rootDir = path.resolve(__dirname, '..');
export const sourceRegistryPath = path.join(rootDir, 'data', 'followed-sources.json');
export const trackedItemsPath = path.join(rootDir, 'data', 'source-items.json');
export const digestJsonPath = path.join(rootDir, 'data', 'latest-digest.json');
export const digestMarkdownPath = path.join(rootDir, 'data', 'latest-digest.md');
export const followedSourcesModulePath = path.join(
  rootDir,
  'src',
  'content',
  'followedSources.generated.ts',
);

const RAW_SUMMARY_MAX_LENGTH = 1200;
const DIGEST_ITEM_LIMIT = Number(process.env.DIGEST_ITEM_LIMIT ?? '12');
const DEFAULT_MAX_ITEMS = Number(process.env.SOURCE_MAX_ITEMS ?? '5');
const PRIORITY_ORDER = {
  core: 0,
  watchlist: 1,
  manual: 2,
};

export async function readJsonFile(filePath, fallbackValue) {
  try {
    const raw = await readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return fallbackValue;
    }

    throw error;
  }
}

export async function writeJsonFile(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export function slugify(value) {
  const slug = value
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || `source-${Date.now()}`;
}

function compareRegistryItems(left, right) {
  const leftPriority = PRIORITY_ORDER[left.priority ?? 'watchlist'];
  const rightPriority = PRIORITY_ORDER[right.priority ?? 'watchlist'];

  if (leftPriority !== rightPriority) {
    return leftPriority - rightPriority;
  }

  return left.title.localeCompare(right.title, 'en');
}

function parseDateScore(value) {
  if (!value) {
    return 0;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? 0 : parsed.valueOf();
}

export function sortTrackedItems(items) {
  return [...items].sort((left, right) => {
    const byDate = parseDateScore(right.publishedAt) - parseDateScore(left.publishedAt);
    if (byDate !== 0) {
      return byDate;
    }

    return left.title.localeCompare(right.title, 'en');
  });
}

export async function readSourceRegistry() {
  const items = await readJsonFile(sourceRegistryPath, []);
  return [...items].sort(compareRegistryItems);
}

export async function readTrackedSourceItems() {
  return sortTrackedItems(await readJsonFile(trackedItemsPath, []));
}

export async function writeTrackedSourceItems(items) {
  const sorted = sortTrackedItems(items);
  await writeJsonFile(trackedItemsPath, sorted);
  return sorted;
}

function decodeXml(value = '') {
  return value
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function stripTags(value = '') {
  return decodeXml(decodeXml(value).replace(/<[^>]+>/g, ' '));
}

function truncateText(value, maxLength = RAW_SUMMARY_MAX_LENGTH) {
  if (!value) {
    return undefined;
  }

  return value.length <= maxLength
    ? value
    : `${value.slice(0, maxLength - 1).trim()}…`;
}

function extractTag(block, tagNames) {
  for (const tag of tagNames) {
    const fullMatch = block.match(
      new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'),
    );

    if (fullMatch?.[1]) {
      return fullMatch[1];
    }
  }

  return undefined;
}

function extractLink(block) {
  const atomAlternate = block.match(
    /<link[^>]*rel="alternate"[^>]*href="([^"]+)"[^>]*\/?>/i,
  );

  if (atomAlternate?.[1]) {
    return decodeXml(atomAlternate[1]);
  }

  const hrefAttribute = block.match(/<link[^>]*href="([^"]+)"[^>]*\/?>/i);
  if (hrefAttribute?.[1]) {
    return decodeXml(hrefAttribute[1]);
  }

  const rssLink = extractTag(block, ['link']);
  return rssLink ? stripTags(rssLink) : undefined;
}

function normalizePublishedAt(value) {
  if (!value) {
    return undefined;
  }

  const raw = stripTags(value);
  const parsed = new Date(raw);
  return Number.isNaN(parsed.valueOf()) ? raw : parsed.toISOString();
}

function getSummaryFields(strategy) {
  switch (strategy) {
    case 'youtube':
      return ['media:description', 'summary', 'content', 'title'];
    case 'podcast':
      return ['itunes:summary', 'description', 'content:encoded', 'title'];
    case 'atom':
      return ['summary', 'content', 'title'];
    case 'rss':
    case 'auto':
    default:
      return ['description', 'content:encoded', 'summary', 'title'];
  }
}

function getEntryBlocks(xmlText) {
  const itemBlocks = [...xmlText.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map(
    (match) => match[0],
  );
  if (itemBlocks.length > 0) {
    return itemBlocks;
  }

  return [...xmlText.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map(
    (match) => match[0],
  );
}

function buildContentHash(parts) {
  return createHash('sha256').update(parts.join('||')).digest('hex');
}

export function detectStrategy(item) {
  if (item.strategy && item.strategy !== 'auto') {
    return item.strategy;
  }

  if (item.feedUrl?.includes('youtube.com/feeds/videos.xml')) {
    return 'youtube';
  }

  if (item.medium === 'listen') {
    return 'podcast';
  }

  return 'rss';
}

export function parseFeedItems(xmlText, source) {
  const strategy = detectStrategy(source);
  const blocks = getEntryBlocks(xmlText);
  const summaryFields = getSummaryFields(strategy);
  const maxItems = source.maxItems ?? DEFAULT_MAX_ITEMS;

  return blocks
    .slice(0, maxItems)
    .map((block, index) => {
      const title = stripTags(extractTag(block, ['title']) ?? '');
      const url = extractLink(block) ?? source.url;
      const publishedAt = normalizePublishedAt(
        extractTag(block, ['pubDate', 'published', 'updated', 'dc:date']),
      );
      const summarySource = summaryFields
        .map((field) => extractTag(block, [field]))
        .find(Boolean);
      const rawSummary = truncateText(stripTags(summarySource ?? ''));
      const canonicalId =
        stripTags(extractTag(block, ['guid', 'id']) ?? '') ||
        url ||
        `${source.id}-${index}-${title}`;

      if (!title && !url && !rawSummary) {
        return null;
      }

      const itemId = buildContentHash([source.id, canonicalId]).slice(0, 16);

      return {
        sourceId: source.id,
        itemId,
        title: title || source.title,
        url,
        publishedAt,
        rawSummary,
        contentHash: buildContentHash([
          source.id,
          title || '',
          url || '',
          publishedAt || '',
          rawSummary || '',
        ]),
        sourcePriority: source.priority ?? 'watchlist',
      };
    })
    .filter(Boolean);
}

export async function fetchTrackedItemsForSource(source) {
  if (!source.feedUrl) {
    return [];
  }

  const response = await fetch(source.feedUrl, {
    headers: {
      'user-agent': 'east-meridian-source-sync/1.0',
      accept:
        'application/rss+xml, application/atom+xml, application/xml, text/xml',
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const xmlText = await response.text();
  return parseFeedItems(xmlText, source);
}

export function mergeFetchedItems(source, fetchedItems, existingItems) {
  const existingById = new Map(existingItems.map((item) => [item.itemId, item]));

  return fetchedItems.map((item) => {
    const existing = existingById.get(item.itemId);

    if (existing && existing.contentHash === item.contentHash) {
      return {
        ...item,
        summary: existing.summary,
        whyItMatters: existing.whyItMatters,
        signalType: existing.signalType,
        keywords: existing.keywords,
        summarizedAt: existing.summarizedAt,
      };
    }

    return item;
  });
}

function buildSourceSnapshot(registry, items) {
  const itemsBySource = new Map();

  for (const item of sortTrackedItems(items)) {
    const existing = itemsBySource.get(item.sourceId) ?? [];
    existing.push(item);
    itemsBySource.set(item.sourceId, existing);
  }

  return registry
    .filter((source) => source.active !== false)
    .map((source) => {
      const trackedItems = itemsBySource.get(source.id) ?? [];
      const latestItem = trackedItems[0];

      return {
        id: source.id,
        title: source.title,
        language: source.language,
        url: source.url,
        note: source.note,
        medium: source.medium,
        domain: source.domain,
        tag: source.tag,
        priority: source.priority ?? 'watchlist',
        active: source.active ?? true,
        strategy: source.strategy ?? 'auto',
        feedUrl: source.feedUrl,
        summaryMode: source.summaryMode ?? 'bilingual',
        maxItems: source.maxItems ?? DEFAULT_MAX_ITEMS,
        regionTags: source.regionTags ?? [],
        topicTags: source.topicTags ?? [],
        latestItemTitle: latestItem?.title,
        latestItemUrl: latestItem?.url,
        latestPublishedAt: latestItem?.publishedAt,
        latestItemSummary: latestItem?.summary,
        latestWhyItMatters: latestItem?.whyItMatters,
        latestItemRawSummary: latestItem?.rawSummary,
        latestSignalType: latestItem?.signalType,
        latestKeywords: latestItem?.keywords,
        trackedItemCount: trackedItems.length,
      };
    });
}

export async function writeFollowedSourcesModule(registry, items) {
  const snapshot = buildSourceSnapshot(registry, items);
  const source = `import type { SourceItem } from '../types';\n\nexport const followedSources: SourceItem[] = ${JSON.stringify(
    snapshot,
    null,
    2,
  )};\n`;

  await mkdir(path.dirname(followedSourcesModulePath), { recursive: true });
  await writeFile(followedSourcesModulePath, source, 'utf8');
}

function buildDigestPayload(registry, items) {
  const sourceById = new Map(registry.map((source) => [source.id, source]));
  const digestItems = sortTrackedItems(items)
    .filter((item) => item.summary || item.rawSummary)
    .slice(0, DIGEST_ITEM_LIMIT)
    .map((item) => {
      const source = sourceById.get(item.sourceId);

      return {
        sourceId: item.sourceId,
        sourceTitle: source?.title ?? item.sourceId,
        priority: item.sourcePriority ?? source?.priority ?? 'watchlist',
        domain: source?.domain,
        medium: source?.medium,
        title: item.title,
        url: item.url,
        publishedAt: item.publishedAt,
        summary: item.summary,
        whyItMatters: item.whyItMatters,
        rawSummary: item.rawSummary,
        signalType: item.signalType,
      };
    });

  return {
    generatedAt: new Date().toISOString(),
    itemCount: digestItems.length,
    items: digestItems,
  };
}

function formatDigestMarkdown(digest) {
  const sections = ['# East Meridian Source Digest', '', `Generated: ${digest.generatedAt}`, ''];
  const groupedPriorities = ['core', 'watchlist', 'manual'];

  for (const priority of groupedPriorities) {
    const items = digest.items.filter((item) => item.priority === priority);
    if (items.length === 0) {
      continue;
    }

    sections.push(`## ${priority[0].toUpperCase()}${priority.slice(1)}`, '');

    for (const item of items) {
      sections.push(`### ${item.sourceTitle}`);
      sections.push(`[${item.title}](${item.url})`);

      if (item.publishedAt) {
        sections.push(`Published: ${item.publishedAt}`);
      }

      if (item.summary?.en) {
        sections.push(`Summary (EN): ${item.summary.en}`);
      } else if (item.rawSummary) {
        sections.push(`Summary: ${item.rawSummary}`);
      }

      if (item.summary?.zh) {
        sections.push(`摘要: ${item.summary.zh}`);
      }

      if (item.whyItMatters?.en) {
        sections.push(`Why it matters (EN): ${item.whyItMatters.en}`);
      }

      if (item.whyItMatters?.zh) {
        sections.push(`为什么重要: ${item.whyItMatters.zh}`);
      }

      if (item.signalType) {
        sections.push(`Signal: ${item.signalType}`);
      }

      sections.push('');
    }
  }

  if (digest.items.length === 0) {
    sections.push('No tracked updates yet.');
  }

  sections.push('');
  return sections.join('\n');
}

export async function writeDigestFiles(registry, items) {
  const digest = buildDigestPayload(registry, items);
  await writeJsonFile(digestJsonPath, digest);
  await writeFile(digestMarkdownPath, formatDigestMarkdown(digest), 'utf8');
}

export async function writeDerivedSourceFiles(registry, items) {
  await writeFollowedSourcesModule(registry, items);
  await writeDigestFiles(registry, items);
}
