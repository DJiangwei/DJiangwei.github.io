# North Meridian

A bilingual personal page for a macro trader / investor who reads across English and Chinese information worlds.

## Local development

```bash
npm install
npm run dev
```

Source entry HTML for Vite development lives in `app.html`.
The repository root `index.html` is kept as the built Pages artifact because this user site is currently published directly from the branch root.

## GitHub Pages

- If this code lives in a repository named `DJiangwei.github.io`, the site will build for the root URL: `https://djiangwei.github.io/`
- If it lives in another repository such as `DaiJiangwei`, the site will build for the project URL: `https://djiangwei.github.io/DaiJiangwei/`
- The Vite `base` path is auto-detected from `GITHUB_REPOSITORY` during CI so the same codebase works in both cases.

The included GitHub Actions workflow deploys the `dist/` output to GitHub Pages on pushes to `main`, but the build script also syncs the built artifact to the repository root so the site still works when Pages is configured to publish directly from `main`.
