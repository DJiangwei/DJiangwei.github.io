import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const postsDir = path.join(rootDir, 'content', 'posts');
const outputPath = path.join(rootDir, 'src', 'content', 'posts.generated.ts');

const VALID_LOCALES = new Set(['en', 'zh']);
const VALID_STATUSES = new Set(['draft', 'review', 'published']);

function shouldSkipEntry(name) {
  return name.startsWith('.') || name.startsWith('_');
}

async function collectMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (shouldSkipEntry(entry.name)) {
      continue;
    }

    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(entryPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md') {
      files.push(entryPath);
    }
  }

  return files.sort((left, right) => left.localeCompare(right));
}

function ensureString(value, field, filePath) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Missing required "${field}" in ${filePath}`);
  }

  return value.trim();
}

function optionalString(value) {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return value.toISOString().slice(0, 10);
  }

  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function normalizeTags(value) {
  if (Array.isArray(value)) {
    return value
      .map((tag) => (typeof tag === 'string' ? tag.trim() : ''))
      .filter(Boolean);
  }

  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

function getPostPath(locale, slug) {
  return locale === 'zh' ? `/zh/writing/${slug}` : `/writing/${slug}`;
}

function normalizeImageTarget(target) {
  if (/^(https?:)?\/\//.test(target) || target.startsWith('/')) {
    return target;
  }

  return `/${target.replace(/^\.?\//, '')}`;
}

function preprocessObsidianSyntax(markdown, locale, posts) {
  const postBySlug = new Map(posts.map((post) => [`${post.locale}:${post.slug}`, post]));
  const postByTranslation = new Map(posts.map((post) => [`${post.locale}:${post.translationKey}`, post]));
  const anyBySlug = new Map(posts.map((post) => [post.slug, post]));
  const anyByTranslation = new Map(posts.map((post) => [post.translationKey, post]));

  return markdown.replace(/(!)?\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, embed, rawTarget, rawLabel) => {
    const target = rawTarget.trim();
    const label = rawLabel?.trim();

    if (!target) {
      return '';
    }

    if (embed) {
      return `![${label ?? ''}](${normalizeImageTarget(target)})`;
    }

    const match =
      postBySlug.get(`${locale}:${target}`) ??
      postByTranslation.get(`${locale}:${target}`) ??
      anyBySlug.get(target) ??
      anyByTranslation.get(target);

    if (!match) {
      return label ?? target;
    }

    return `[${label ?? match.title}](${getPostPath(match.locale, match.slug)})`;
  });
}

function stripMarkdown(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~>-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function estimateReadingTime(markdown) {
  const plainText = stripMarkdown(markdown);
  const latinWords = plainText
    .replace(/[\u4e00-\u9fff]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  const cjkCharacters = (plainText.match(/[\u4e00-\u9fff]/g) ?? []).length;

  return Math.max(1, Math.ceil(latinWords / 220 + cjkCharacters / 450));
}

function comparePosts(left, right) {
  const leftTime = Date.parse(left.publishedAt ?? left.updatedAt ?? '');
  const rightTime = Date.parse(right.publishedAt ?? right.updatedAt ?? '');

  if (Number.isFinite(leftTime) && Number.isFinite(rightTime) && leftTime !== rightTime) {
    return rightTime - leftTime;
  }

  if (left.featured !== right.featured) {
    return Number(right.featured) - Number(left.featured);
  }

  return left.slug.localeCompare(right.slug);
}

const markdownFiles = await collectMarkdownFiles(postsDir);
const rawPosts = [];

for (const filePath of markdownFiles) {
  const source = await readFile(filePath, 'utf8');
  const { data, content } = matter(source);
  const title = ensureString(data.title, 'title', filePath);
  const slug = ensureString(data.slug, 'slug', filePath);
  const locale = ensureString(data.locale, 'locale', filePath);
  const status = ensureString(data.status, 'status', filePath);

  if (!VALID_LOCALES.has(locale)) {
    throw new Error(`Unsupported locale "${locale}" in ${filePath}`);
  }

  if (!VALID_STATUSES.has(status)) {
    throw new Error(`Unsupported status "${status}" in ${filePath}`);
  }

  const publishedAt = optionalString(data.publishedAt);
  if (status === 'published' && !publishedAt) {
    throw new Error(`Published post requires "publishedAt" in ${filePath}`);
  }

  rawPosts.push({
    id: `${slug}-${locale}`,
    title,
    slug,
    locale,
    translationKey: optionalString(data.translationKey) ?? slug,
    status,
    publishedAt,
    updatedAt: optionalString(data.updatedAt),
    summary: optionalString(data.summary),
    tags: normalizeTags(data.tags),
    featured: Boolean(data.featured),
    filePath: path.relative(rootDir, filePath),
    markdown: content.trim(),
  });
}

const builtPosts = [];

for (const post of rawPosts) {
  const markdown = preprocessObsidianSyntax(post.markdown, post.locale, rawPosts);
  const html = await marked.parse(markdown);
  const excerpt = post.summary ?? stripMarkdown(markdown).slice(0, 180);

  builtPosts.push({
    ...post,
    summary: excerpt,
    excerpt,
    readingTimeMinutes: estimateReadingTime(markdown),
    wordCount: stripMarkdown(markdown).length,
    path: getPostPath(post.locale, post.slug),
    html,
  });
}

const sortedPosts = builtPosts.sort(comparePosts);

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(
  outputPath,
  [
    "import type { ArticleItem } from '../types';",
    '',
    '// This file is auto-generated by scripts/build-posts.mjs',
    `export const posts: ArticleItem[] = ${JSON.stringify(sortedPosts, null, 2)};`,
    '',
  ].join('\n'),
  'utf8',
);

console.log(`Built ${sortedPosts.length} posts into ${path.relative(rootDir, outputPath)}`);
