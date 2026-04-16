import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const managedEntries = new Set(['assets', 'images', 'media', '404.html', 'index.html']);

await mkdir(rootDir, { recursive: true });

for (const entry of managedEntries) {
  await rm(path.join(rootDir, entry), { recursive: true, force: true });
}

for (const entry of await readdir(distDir, { withFileTypes: true })) {
  const source = path.join(distDir, entry.name);
  const target = path.join(rootDir, entry.name);

  await cp(source, target, {
    recursive: entry.isDirectory(),
    force: true,
  });
}
