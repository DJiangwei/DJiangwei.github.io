import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const rootAssetsDir = path.join(rootDir, 'assets');

await cp(path.join(distDir, 'index.html'), path.join(rootDir, 'index.html'), {
  force: true,
});

await rm(rootAssetsDir, { recursive: true, force: true });
await mkdir(rootAssetsDir, { recursive: true });
await cp(path.join(distDir, 'assets'), rootAssetsDir, { recursive: true });
