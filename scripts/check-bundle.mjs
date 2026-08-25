import { readFile, readdir, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import process from 'node:process';

const DIST_DIRECTORY = path.resolve('dist');
const MANIFEST_CANDIDATES = [
  path.join(DIST_DIRECTORY, '.vite', 'manifest.json'),
  path.join(DIST_DIRECTORY, 'manifest.json'),
];
const INITIAL_JAVASCRIPT_GZIP_BUDGET = 204800;
const INITIAL_IMAGE_TRANSFER_BUDGET = 1024 * 1024;
const NON_HERO_IMAGE_BUDGET = 350 * 1024;
const IMAGE_EXTENSION_PATTERN = /\.(?:avif|gif|jpe?g|png|svg|webp)$/i;
const IMAGE_REFERENCE_PATTERN = /(?:\/ben-portfolio\/)?([\w./ -]+?\.(?:avif|gif|jpe?g|png|svg|webp))(?:[?#][^"'\s)]*)?/gi;

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

function initialEntryAssets(manifest) {
  const initialFiles = new Set();
  const visitedEntries = new Set();

  function visit(entryName) {
    if (visitedEntries.has(entryName)) return;
    visitedEntries.add(entryName);

    const entry = manifest[entryName];
    if (!entry) throw new Error(`Manifest entry "${entryName}" was referenced but not found.`);

    initialFiles.add(entry.file);
    for (const cssFile of entry.css ?? []) initialFiles.add(cssFile);
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

async function deployableImageFiles(directory = DIST_DIRECTORY) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return deployableImageFiles(entryPath);
    return IMAGE_EXTENSION_PATTERN.test(entry.name) ? [entryPath] : [];
  }));
  return files.flat();
}

function initialImagePaths(initialAssetContents) {
  const references = new Set();
  for (const content of initialAssetContents) {
    for (const match of content.matchAll(IMAGE_REFERENCE_PATTERN)) {
      references.add(match[1]);
    }
  }
  return [...references].sort();
}

const { manifest, manifestPath } = await readManifest();
const initialAssets = initialEntryAssets(manifest);
const javascriptFiles = initialAssets.filter((file) => file.endsWith('.js'));
const javascriptSizes = await Promise.all(
  javascriptFiles.map(async (file) => ({
    file,
    gzipBytes: gzipSync(await readFile(resolveDistAsset(file))).length,
  })),
);
const totalGzipBytes = javascriptSizes.reduce((total, file) => total + file.gzipBytes, 0);
const initialAssetContents = await Promise.all([
  readFile(path.join(DIST_DIRECTORY, 'index.html'), 'utf8'),
  ...initialAssets.map((file) => readFile(resolveDistAsset(file), 'utf8')),
]);
const initialImages = await Promise.all(initialImagePaths(initialAssetContents).map(async (file) => ({
  file,
  bytes: (await stat(resolveDistAsset(file))).size,
})));
const initialImageBytes = initialImages.reduce((total, file) => total + file.bytes, 0);
const deployableImages = await Promise.all((await deployableImageFiles()).map(async (file) => ({
  file: path.relative(DIST_DIRECTORY, file),
  bytes: (await stat(file)).size,
})));
const oversizedImages = deployableImages.filter((file) => file.bytes >= NON_HERO_IMAGE_BUDGET);

console.log(`Manifest: ${path.relative(process.cwd(), manifestPath)}`);
for (const { file, gzipBytes } of javascriptSizes) console.log(`${file}: ${gzipBytes} gzip bytes`);
console.log(`Initial JavaScript: ${totalGzipBytes} gzip bytes (budget: ${INITIAL_JAVASCRIPT_GZIP_BUDGET})`);
for (const { file, bytes } of initialImages) console.log(`${file}: ${bytes} initial image bytes`);
console.log(`Initial images: ${initialImageBytes} bytes (budget: ${INITIAL_IMAGE_TRANSFER_BUDGET})`);
console.log(`Deployable images: ${deployableImages.length}; non-hero image budget: < ${NON_HERO_IMAGE_BUDGET} bytes`);

const failures = [];
if (totalGzipBytes > INITIAL_JAVASCRIPT_GZIP_BUDGET) {
  failures.push(`Initial JavaScript gzip budget exceeded by ${totalGzipBytes - INITIAL_JAVASCRIPT_GZIP_BUDGET} bytes.`);
}
if (initialImageBytes > INITIAL_IMAGE_TRANSFER_BUDGET) {
  failures.push(`Initial image transfer budget exceeded by ${initialImageBytes - INITIAL_IMAGE_TRANSFER_BUDGET} bytes.`);
}
if (oversizedImages.length > 0) {
  failures.push(`Deployable non-hero images must be below ${NON_HERO_IMAGE_BUDGET} bytes:\n${oversizedImages.map((file) => `- ${file.file}: ${file.bytes} bytes`).join('\n')}`);
}
if (failures.length > 0) {
  throw new Error(failures.join('\n'));
}
