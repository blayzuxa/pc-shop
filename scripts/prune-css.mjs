import { mkdir, readFile, writeFile } from 'node:fs/promises';

const pages = [
  'index',
  'sborka-pk-krasnodar',
  'igrovye-kompyutery-krasnodar',
  'apgreyd-i-obsluzhivanie-pk-krasnodar',
  'privacy-policy',
  'pdn-consent',
];

await mkdir('src/styles', { recursive: true });
for (const page of pages) {
  const raw = await readFile(`src/styles-raw/${page}.css`, 'utf8');
  // Preserve the existing layout rules exactly. Aggressive selector pruning is
  // unsafe here because several sections acquire their classes dynamically.
  await writeFile(`src/styles/${page}.css`, raw);
}
