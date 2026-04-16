import { mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const postsDir = path.join(rootDir, 'content', 'posts');

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

async function fileExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

function createTemplate({
  title,
  slug,
  locale,
  translationKey,
  publishedAt,
  status,
  featured,
}) {
  const summaryPlaceholder =
    locale === 'zh'
      ? '用 1-2 句话概括这篇文章最重要的判断。'
      : 'Summarize the core argument of this note in one or two sentences.';
  const bodyPlaceholder =
    locale === 'zh'
      ? '在这里开始写正文。建议使用标准 Markdown 语法，图片尽量使用 `/images/...` 这类公开路径。'
      : 'Start writing here. Standard Markdown works best, and images are easiest to manage through `/images/...` public paths.';

  return `---
title: ${title}
slug: ${slug}
locale: ${locale}
translationKey: ${translationKey}
status: ${status}
publishedAt: ${publishedAt}
summary: ${summaryPlaceholder}
tags:
  - macro
featured: ${featured}
---

${bodyPlaceholder}
`;
}

const rl = readline.createInterface({ input, output });

try {
  const englishTitle = (await rl.question('English title: ')).trim();
  if (!englishTitle) {
    throw new Error('English title is required.');
  }

  const chineseTitle = (await rl.question('Chinese title: ')).trim() || englishTitle;
  const suggestedSlug = slugify(englishTitle);
  const slugInput = (await rl.question(`Slug [${suggestedSlug}]: `)).trim();
  const slug = slugInput || suggestedSlug;

  if (!slug) {
    throw new Error('A valid slug is required.');
  }

  const publishNow = /^(y|yes)$/i.test((await rl.question('Publish immediately? [y/N]: ')).trim());
  const featured = /^(y|yes)$/i.test((await rl.question('Feature on homepage? [y/N]: ')).trim());
  const today = new Date().toISOString().slice(0, 10);
  const status = publishNow ? 'published' : 'draft';
  const publishedAt = publishNow ? today : today;
  const translationKey = slug;

  await mkdir(postsDir, { recursive: true });

  const englishPath = path.join(postsDir, `${today}-${slug}.en.md`);
  const chinesePath = path.join(postsDir, `${today}-${slug}.zh.md`);

  if ((await fileExists(englishPath)) || (await fileExists(chinesePath))) {
    throw new Error(`Post files already exist for slug "${slug}".`);
  }

  await writeFile(
    englishPath,
    createTemplate({
      title: englishTitle,
      slug,
      locale: 'en',
      translationKey,
      publishedAt,
      status,
      featured,
    }),
    'utf8',
  );

  await writeFile(
    chinesePath,
    createTemplate({
      title: chineseTitle,
      slug,
      locale: 'zh',
      translationKey,
      publishedAt,
      status,
      featured,
    }),
    'utf8',
  );

  console.log(`Created:\n- ${path.relative(rootDir, englishPath)}\n- ${path.relative(rootDir, chinesePath)}`);
  console.log('Next step: open the repo as an Obsidian vault, edit the new files, then run `npm run posts:build`.');
} finally {
  rl.close();
}
