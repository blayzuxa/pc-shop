import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const contentDir = 'src/content';
const pages = (await readdir(contentDir)).filter(x => x.endsWith('.html'));
const errors = [];
const imageRefs = new Set();

for (const page of pages) {
  const html = await readFile(path.join(contentDir, page), 'utf8');
  for (const match of html.matchAll(/(?:src|href)=["'](\/images\/[^"']+)["']/g)) imageRefs.add(match[1]);
  for (const match of html.matchAll(/srcset=["']([^"']+)["']/g)) {
    for (const item of match[1].split(',')) imageRefs.add(item.trim().split(/\s+/)[0]);
  }
}

let total = 0;
for (const ref of imageRefs) {
  const file = path.join('public', ref);
  try {
    const info = await stat(file);
    total += info.size;
    if (info.size > 550_000) errors.push(`Heavy in-page image: ${ref} (${info.size} bytes)`);
  } catch {
    errors.push(`Missing image: ${ref}`);
  }
}

const sitemap = await readFile('public/sitemap.xml', 'utf8');
for (const route of ['sborka-pk-krasnodar.html','igrovye-kompyutery-krasnodar.html','apgreyd-i-obsluzhivanie-pk-krasnodar.html']) {
  if (!sitemap.includes(route)) errors.push(`Sitemap misses ${route}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(JSON.stringify({ pages: pages.length, referencedImages: imageRefs.size, totalReferencedImageBytes: total }));
