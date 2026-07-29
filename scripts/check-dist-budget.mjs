import { gzipSync } from 'node:zlib';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const INITIAL_JAVASCRIPT_BUDGET = 250 * 1024;
const BELOW_FOLD_IMAGE_BUDGET = 350 * 1024;
const distDirectory = path.resolve(process.env.DIST_DIR ?? 'dist');

const readDirectoryFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) return readDirectoryFiles(entryPath);
      if (entry.isFile()) return [entryPath];
      return [];
    }),
  );

  return nested.flat();
};

const entryFileFromUrl = (assetUrl) => {
  const pathname = new URL(assetUrl, 'https://portfolio.invalid').pathname;
  const basePath = '/ben-portfolio/';

  if (!pathname.startsWith(basePath)) {
    throw new Error(`Initial entry uses an unexpected base path: ${assetUrl}`);
  }

  return pathname.slice(basePath.length);
};

const indexHtml = await readFile(path.join(distDirectory, 'index.html'), 'utf8');
const scriptUrls = [...indexHtml.matchAll(/<script\b[^>]*\bsrc="([^"]+\.js)"[^>]*><\/script>/g)].map(
  ([, scriptUrl]) => scriptUrl,
);

if (scriptUrls.length === 0) {
  throw new Error('No initial JavaScript entry scripts were found in dist/index.html.');
}

const entryBudgets = await Promise.all(
  scriptUrls.map(async (scriptUrl) => {
    const entryFile = entryFileFromUrl(scriptUrl);
    const entryPath = path.join(distDirectory, entryFile);
    const source = await readFile(entryPath);
    const gzipBytes = gzipSync(source).byteLength;

    return { entryFile, gzipBytes, source: source.toString('utf8') };
  }),
);
const initialJavaScriptBytes = entryBudgets.reduce((total, entry) => total + entry.gzipBytes, 0);

for (const entry of entryBudgets) {
  console.log(`Initial JavaScript: ${entry.entryFile} ${entry.gzipBytes} bytes gzip`);
}
console.log(`Initial JavaScript gzip total: ${initialJavaScriptBytes} bytes`);

const belowFoldImageDirectory = path.join(distDirectory, 'assets', 'ui');
const runtimeImageNames = new Set(
  entryBudgets.flatMap((entry) =>
    [...entry.source.matchAll(/project-[A-Za-z0-9_-]+\.(?:avif|gif|jpe?g|png|webp)/gi)].map(
      ([imageName]) => imageName,
    ),
  ),
);
const belowFoldImages = (await readDirectoryFiles(belowFoldImageDirectory)).filter((file) => {
  if (!/\.(avif|gif|jpe?g|png|webp)$/i.test(file)) return false;

  return runtimeImageNames.has(path.basename(file));
});
const oversizedImages = [];

for (const imagePath of belowFoldImages) {
  const bytes = (await stat(imagePath)).size;
  const imageFile = path.relative(distDirectory, imagePath);

  console.log(`Below-fold runtime image: ${imageFile} ${bytes} bytes`);
  if (bytes > BELOW_FOLD_IMAGE_BUDGET) oversizedImages.push({ imageFile, bytes });
}

console.log(`Below-fold runtime image total: ${belowFoldImages.length} files checked`);

const failures = [];
if (initialJavaScriptBytes > INITIAL_JAVASCRIPT_BUDGET) {
  failures.push(
    `Initial JavaScript gzip total ${initialJavaScriptBytes} bytes exceeds ${INITIAL_JAVASCRIPT_BUDGET} bytes.`,
  );
}
for (const image of oversizedImages) {
  failures.push(
    `Below-fold runtime image ${image.imageFile} is ${image.bytes} bytes and exceeds ${BELOW_FOLD_IMAGE_BUDGET} bytes.`,
  );
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
}
