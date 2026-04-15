import {
  readSourceRegistry,
  readTrackedSourceItems,
  writeDerivedSourceFiles,
  writeTrackedSourceItems,
} from './source-common.mjs';

const OPENAI_API_URL = 'https://api.openai.com/v1/responses';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const SUMMARY_LIMIT = Number(process.env.SUMMARY_LIMIT ?? '12');

const SUMMARY_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    summary: {
      type: 'object',
      additionalProperties: false,
      properties: {
        en: { type: 'string' },
        zh: { type: 'string' },
      },
      required: ['en', 'zh'],
    },
    whyItMatters: {
      type: 'object',
      additionalProperties: false,
      properties: {
        en: { type: 'string' },
        zh: { type: 'string' },
      },
      required: ['en', 'zh'],
    },
    signalType: {
      type: 'string',
      enum: [
        'data',
        'news',
        'opinion',
        'interview',
        'institutional',
        'historical',
        'documentary',
      ],
    },
    keywords: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['summary', 'whyItMatters', 'signalType', 'keywords'],
};

function getResponseText(responseJson) {
  if (typeof responseJson.output_text === 'string' && responseJson.output_text.trim()) {
    return responseJson.output_text;
  }

  const textPart = responseJson.output
    ?.flatMap((entry) => entry.content ?? [])
    ?.find((part) => typeof part.text === 'string' && part.text.trim());

  return textPart?.text;
}

async function summarizeTrackedItem(source, item, apiKey) {
  const payload = {
    source: {
      title: source.title,
      domain: source.domain,
      medium: source.medium,
      priority: source.priority ?? 'watchlist',
      language: source.language,
      note: source.note,
      topicTags: source.topicTags ?? [],
      regionTags: source.regionTags ?? [],
    },
    item: {
      title: item.title,
      url: item.url,
      publishedAt: item.publishedAt,
      rawSummary: item.rawSummary,
    },
  };

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: [
        {
          role: 'developer',
          content: [
            {
              type: 'input_text',
              text:
                'You summarize feed updates for a bilingual macro investor website. Be concise, factual, non-promotional, and useful. The English and Chinese summaries should both read naturally, not as literal translations.',
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: JSON.stringify(payload, null, 2),
            },
          ],
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'tracked_source_summary',
          strict: true,
          schema: SUMMARY_SCHEMA,
        },
      },
    }),
  });

  const responseJson = await response.json();

  if (!response.ok) {
    throw new Error(responseJson.error?.message ?? 'OpenAI summary request failed');
  }

  const rawText = getResponseText(responseJson);
  if (!rawText) {
    throw new Error('No structured summary returned from OpenAI');
  }

  return JSON.parse(rawText);
}

async function main() {
  const registry = await readSourceRegistry();
  const trackedItems = await readTrackedSourceItems();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn('OPENAI_API_KEY is not set. Skipping source summarization.');
    await writeDerivedSourceFiles(registry, trackedItems);
    return;
  }

  const sourceById = new Map(registry.map((source) => [source.id, source]));
  const pendingKeys = new Set(
    trackedItems
      .filter((item) => item.sourcePriority !== 'manual')
      .filter((item) => !item.summary || !item.whyItMatters)
      .slice(0, SUMMARY_LIMIT)
      .map((item) => `${item.sourceId}::${item.itemId}`),
  );

  let summarizedCount = 0;
  const nextItems = [];

  for (const item of trackedItems) {
    const itemKey = `${item.sourceId}::${item.itemId}`;

    if (!pendingKeys.has(itemKey)) {
      nextItems.push(item);
      continue;
    }

    const source = sourceById.get(item.sourceId);
    if (!source) {
      nextItems.push(item);
      continue;
    }

    try {
      const summary = await summarizeTrackedItem(source, item, apiKey);
      nextItems.push({
        ...item,
        summary: summary.summary,
        whyItMatters: summary.whyItMatters,
        signalType: summary.signalType,
        keywords: summary.keywords.slice(0, 5),
        summarizedAt: new Date().toISOString(),
      });
      summarizedCount += 1;
    } catch (error) {
      console.warn(
        `Summary failed for ${source.title}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      nextItems.push(item);
    }
  }

  const writtenItems = await writeTrackedSourceItems(nextItems);
  await writeDerivedSourceFiles(registry, writtenItems);
  console.log(`Summarized ${summarizedCount} tracked items.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
