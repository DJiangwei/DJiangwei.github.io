# East Meridian

A bilingual personal page for a macro trader / investor who reads across English and Chinese information worlds.

## Local development

```bash
npm install
npm run dev
```

Source entry HTML for Vite development lives in `app.html`.
The repository root `index.html` is kept as the built Pages artifact because this user site is currently published directly from the branch root.

## Obsidian writing workflow

The site now supports an Obsidian-first article workflow. Open this repository root as an Obsidian vault, then write publishable notes in [content/posts](/Users/jiangwei/Personal%20Page/content/posts).

Useful commands:

```bash
npm run post:new
npm run posts:build
npm run dev
npm run build
```

What each command does:

- `post:new`: creates a bilingual `.en.md` / `.zh.md` article pair with frontmatter
- `posts:build`: converts Markdown posts into `src/content/posts.generated.ts`
- `dev`: rebuilds posts once, then starts the Vite dev server
- `build`: rebuilds posts, checks TypeScript, builds the site, and syncs the GitHub Pages root artifact

Each post uses frontmatter like this:

```yaml
title: Reading Across Two Information Worlds
slug: reading-across-two-information-worlds
locale: en
translationKey: reading-across-two-information-worlds
status: draft
publishedAt: 2026-04-16
summary: One or two sentences for the homepage and article header.
tags:
  - macro
  - process
featured: false
```

Publishing rules:

- `status: draft` and `status: review` stay out of the public article list
- `status: published` appears on the website after `npm run posts:build`
- `translationKey` links English and Chinese versions of the same article
- Use standard Markdown for public posts; basic Obsidian `[[some-slug]]` links between posts are supported
- Put public images under `public/images/...` and reference them as `/images/...`

## Source tracking workflow

Tracked sources live in [data/followed-sources.json](/Users/jiangwei/Personal%20Page/data/followed-sources.json).

Useful commands:

```bash
npm run source:add
npm run sources:sync
OPENAI_API_KEY=your_key npm run sources:summarize
npm run sources:refresh
```

What each command does:

- `source:add`: interactive CLI for adding a new tracked source
- `sources:sync`: fetches the latest feed items and writes `data/source-items.json`
- `sources:summarize`: summarizes new tracked items with the OpenAI Responses API
- `sources:refresh`: runs sync + summarize together

Generated outputs:

- `data/source-items.json`: recent tracked feed items
- `data/latest-digest.json`: machine-readable digest
- `data/latest-digest.md`: human-readable digest for quick review
- `src/content/followedSources.generated.ts`: site snapshot used by the frontend

For GitHub automation, add an `OPENAI_API_KEY` repository secret. The scheduled workflow in `.github/workflows/source-tracking.yml` refreshes tracked sources every 6 hours and commits changes back to `main`.

## GitHub Pages

- If this code lives in a repository named `DJiangwei.github.io`, the site will build for the root URL: `https://djiangwei.github.io/`
- If it lives in another repository such as `DaiJiangwei`, the site will build for the project URL: `https://djiangwei.github.io/DaiJiangwei/`
- The Vite `base` path is auto-detected from `GITHUB_REPOSITORY` during CI so the same codebase works in both cases.

The included GitHub Actions workflow deploys the `dist/` output to GitHub Pages on pushes to `main`, but the build script also syncs the built artifact to the repository root so the site still works when Pages is configured to publish directly from `main`.
