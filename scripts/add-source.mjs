import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  readSourceRegistry,
  slugify,
  sourceRegistryPath,
  writeJsonFile,
} from './source-common.mjs';

const rl = readline.createInterface({ input, output });
const PRIORITY_ORDER = {
  core: 0,
  watchlist: 1,
  manual: 2,
};

function normalizeList(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

async function ask(prompt, fallback = '') {
  const suffix = fallback ? ` [${fallback}]` : '';
  const answer = await rl.question(`${prompt}${suffix}: `);
  return answer.trim() || fallback;
}

async function askYesNo(prompt, fallback = 'y') {
  const answer = (await ask(prompt, fallback)).toLowerCase();
  return answer === 'y' || answer === 'yes';
}

async function main() {
  const registry = await readSourceRegistry();

  const title = await ask('Source title');
  const suggestedId = slugify(title);
  let id = await ask('Source id', suggestedId);

  while (registry.some((item) => item.id === id)) {
    id = await ask('This id already exists. Enter a different id', `${id}-alt`);
  }

  const source = {
    id,
    title,
    language: await ask('Language (en/zh)', 'en'),
    url: await ask('Primary URL'),
    note: {
      en: await ask('English note'),
      zh: await ask('Chinese note'),
    },
    medium: await ask('Medium (read/listen/watch)', 'read'),
    domain: await ask('Domain (markets/beyondMarkets)', 'markets'),
    tag: await ask('Tag', 'Research'),
    priority: await ask('Priority (core/watchlist/manual)', 'watchlist'),
    active: await askYesNo('Active tracking? (y/n)', 'y'),
    strategy: await ask('Feed strategy (auto/rss/atom/podcast/youtube)', 'auto'),
    feedUrl: await ask('Feed URL (leave blank if none)'),
    summaryMode: await ask('Summary mode (bilingual/en-only/zh-only)', 'bilingual'),
    maxItems: Number(await ask('How many recent items to keep', '5')),
    regionTags: normalizeList(await ask('Region tags (comma separated)', 'Global')),
    topicTags: normalizeList(await ask('Topic tags (comma separated)', 'macro')),
  };

  registry.push(source);
  registry.sort((left, right) => {
    const leftPriority = PRIORITY_ORDER[left.priority ?? 'watchlist'];
    const rightPriority = PRIORITY_ORDER[right.priority ?? 'watchlist'];

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return left.title.localeCompare(right.title, 'en');
  });

  await writeJsonFile(sourceRegistryPath, registry);
  console.log(`Added ${source.title} to ${sourceRegistryPath}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => rl.close());
