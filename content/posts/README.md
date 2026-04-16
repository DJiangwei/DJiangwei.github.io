# Obsidian Writing Folder

Open the repository root in Obsidian, then write publishable notes in this folder.

Recommended workflow:

1. Run `npm run post:new` to scaffold a bilingual article pair.
2. Edit the generated `.en.md` and `.zh.md` files in Obsidian.
3. Keep `status: draft` while writing.
4. Change `status` to `published` when the article is ready to appear on the site.
5. Run `npm run posts:build` to refresh `src/content/posts.generated.ts`.
6. Run `npm run build` before publishing.

Use standard Markdown for published posts. Basic Obsidian wiki links like `[[some-slug]]` are supported for links between posts, but standard Markdown links and images are the safest format for public web output.
