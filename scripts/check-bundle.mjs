import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import process from 'node:process';

const DIST_DIRECTORY = path.resolve('dist');
const MANIFEST_CANDIDATES = [
  path.join(DIST_DIRECTORY, '.vite', 'manifest.json'),
  path.join(DIST_DIRECTORY, 'manifest.json'),
];
const INITIAL_JAVASCRIPT_GZIP_BUDGET = 204800;

async function readManifest() {
  for (const manifestPath of MANIFEST_CANDIDATES) {
    try {
      return {
        manifest: JSON.parse(await readFile(manifestPath, 'utf8')),
        manifestPath,
      };
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }
  }

  throw new Error(`Vite manifest not found. Run npm run build first (looked in ${MANIFEST_CANDIDATES.join(', ')}).`);
}

function initialJavaScriptFiles(manifest) {
  const initialFiles = new Set();
  const visitedEntries = new Set();

  function visit(entryName) {
    if (visitedEntries.has(entryName)) return;
    visitedEntries.add(entryName);

    const entry = manifest[entryName];
    if (!entry) throw new Error(`Manifest entry "${entryName}" was referenced but not found.`);

    if (entry.file.endsWith('.js')) initialFiles.add(entry.file);
    for (const importedEntry of entry.imports ?? []) visit(importedEntry);
  }

  const entrypoints = Object.entries(manifest).filter(([, entry]) => entry.isEntry);
  if (entrypoints.length === 0) throw new Error('Vite manifest contains no initial entry chunks.');

  for (const [entryName] of entrypoints) visit(entryName);
  return [...initialFiles].sort();
}

function resolveDistAsset(file) {
  const assetPath = path.resolve(DIST_DIRECTORY, file);
  if (!assetPath.startsWith(`${DIST_DIRECTORY}${path.sep}`)) {
    throw new Error(`Manifest asset is outside dist: ${file}`);
  }
  return assetPath;
}

const { manifest, manifestPath } = await readManifest();
const files = initialJavaScriptFiles(manifest);
const sizes = await Promise.all(
  files.map(async (file) => ({
    file,
    gzipBytes: gzipSync(await readFile(resolveDistAsset(file))).length,
  })),
);
const totalGzipBytes = sizes.reduce((total, file) => total + file.gzipBytes, 0);

console.log(`Manifest: ${path.relative(process.cwd(), manifestPath)}`);
for (const { file, gzipBytes } of sizes) console.log(`${file}: ${gzipBytes} gzip bytes`);
console.log(`Initial JavaScript: ${totalGzipBytes} gzip bytes (budget: ${INITIAL_JAVASCRIPT_GZIP_BUDGET})`);

if (totalGzipBytes > INITIAL_JAVASCRIPT_GZIP_BUDGET) {
  throw new Error(`Initial JavaScript gzip budget exceeded by ${totalGzipBytes - INITIAL_JAVASCRIPT_GZIP_BUDGET} bytes.`);
}
