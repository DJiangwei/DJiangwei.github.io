import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isUserSiteRepo = repoName.toLowerCase() === 'djiangwei.github.io';
const base = repoName && !isUserSiteRepo ? `/${repoName}/` : '/';

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    rollupOptions: {
      input: resolve(__dirname, 'app.html'),
    },
  },
});
