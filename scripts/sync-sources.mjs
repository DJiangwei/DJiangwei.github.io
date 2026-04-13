import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const configPath = path.join(rootDir, 'data', 'followed-sources.json');
const outputPath = path.join(
  rootDir,
  'src',
  'content',
  'followedSources.generated.ts',
);

const SUMMARY_MAX_LENGTH = 280;

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
  return decodeXml(value.replace(/<[^>]+>/g, ' '));
}

function truncateSummary(value) {
  if (!value) {
    return undefined;
  }

  return value.length <= SUMMARY_MAX_LENGTH
    ? value
    : `${value.slice(0, SUMMARY_MAX_LENGTH - 1).trim()}…`;
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

  const atomFallback = block.match(/<link[^>]*href="([^"]+)"[^>]*\/?>/i);
  if (atomFallback?.[1]) {
    return decodeXml(atomFallback[1]);
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

function buildFeedPayload(block, summaryFields) {
  const latestItemTitle = stripTags(extractTag(block, ['title']) ?? '');
  const latestItemUrl = extractLink(block);
  const latestPublishedAt = normalizePublishedAt(
    extractTag(block, ['pubDate', 'published', 'updated', 'dc:date']),
  );

  const summarySource = summaryFields
    .map((field) => extractTag(block, [field]))
    .find(Boolean);

  const latestItemSummary = truncateSummary(stripTags(summarySource ?? ''));

  if (!latestItemTitle && !latestItemUrl && !latestItemSummary) {
    return {};
  }

  return {
    latestItemTitle: latestItemTitle || undefined,
    latestItemUrl,
    latestPublishedAt,
    latestItemSummary,
  };
}

function detectStrategy(item) {
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

function parseFeed(xmlText, strategy) {
  const itemMatch =
    xmlText.match(/<item\b[\s\S]*?<\/item>/i) ??
    xmlText.match(/<entry\b[\s\S]*?<\/entry>/i);

  if (!itemMatch) {
    return {};
  }

  const block = itemMatch[0];

  switch (strategy) {
    case 'youtube':
      return buildFeedPayload(block, [
        'media:description',
        'summary',
        'content',
        'title',
      ]);
    case 'podcast':
      return buildFeedPayload(block, [
        'itunes:summary',
        'description',
        'content:encoded',
        'title',
      ]);
    case 'atom':
      return buildFeedPayload(block, ['summary', 'content', 'title']);
    case 'rss':
    case 'auto':
    default:
      return buildFeedPayload(block, [
        'description',
        'content:encoded',
        'summary',
        'title',
      ]);
  }
}

async function fetchLatestItem(item) {
  if (!item.feedUrl) {
    return {};
  }

  const strategy = detectStrategy(item);

  try {
    const response = await fetch(item.feedUrl, {
      headers: {
        'user-agent': 'east-meridian-source-sync/1.0',
        accept:
          'application/rss+xml, application/atom+xml, application/xml, text/xml',
      },
    });

    if (!response.ok) {
      console.warn(
        `Skipping ${item.title}: ${response.status} ${response.statusText}`,
      );
      return {};
    }

    const xmlText = await response.text();
    return parseFeed(xmlText, strategy);
  } catch (error) {
    console.warn(
      `Skipping ${item.title}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return {};
  }
}

function toModuleSource(items) {
  const payload = JSON.stringify(items, null, 2);
  return `import type { SourceItem } from '../types';\n\nexport const followedSources: SourceItem[] = ${payload};\n`;
}

async function main() {
  const raw = await readFile(configPath, 'utf8');
  const configItems = JSON.parse(raw);
  const generatedItems = [];

  for (const item of configItems) {
    const feedData = await fetchLatestItem(item);
    generatedItems.push({
      id: item.id,
      title: item.title,
      language: item.language,
      url: item.url,
      note: item.note,
      medium: item.medium,
      domain: item.domain,
      tag: item.tag,
      latestItemTitle: feedData.latestItemTitle,
      latestItemUrl: feedData.latestItemUrl,
      latestPublishedAt: feedData.latestPublishedAt,
      latestItemSummary: feedData.latestItemSummary,
    });
  }

  await writeFile(outputPath, toModuleSource(generatedItems), 'utf8');
  console.log(
    `Synced ${generatedItems.length} followed sources to ${path.relative(
      rootDir,
      outputPath,
    )}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
