import { copyFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

await copyFile(path.join(distDir, 'app.html'), path.join(distDir, 'index.html'));
await rm(path.join(distDir, 'app.html'));
