import { access, readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const routes = ['index.html','sborka-pk-krasnodar.html','igrovye-kompyutery-krasnodar.html','apgreyd-i-obsluzhivanie-pk-krasnodar.html','privacy-policy.html','pdn-consent.html'];
const errors = [];
for (const route of routes) {
  const file = path.join('dist', route);
  try {
    const html = await readFile(file, 'utf8');
    if (!html.includes('<title>')) errors.push(`${route}: no title`);
    if (!html.includes('rel="canonical"')) errors.push(`${route}: no canonical`);
  } catch { errors.push(`${route}: missing output`); }
}
for (const file of ['dist/robots.txt','dist/sitemap.xml']) {
  try { await access(file); } catch { errors.push(`${file}: missing`); }
}

async function walk(dir) {
  const out=[];
  for (const name of await readdir(dir)) {
    const file=path.join(dir,name); const s=await stat(file);
    if(s.isDirectory()) out.push(...await walk(file)); else out.push([file,s.size]);
  }
  return out;
}
const files=await walk('dist');
const heavy=files.filter(([f,size])=>/\.(png|jpe?g|webp|avif)$/i.test(f)&&size>550_000);
if(heavy.length) errors.push(...heavy.map(([f,s])=>`Heavy built image: ${f} (${s})`));
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log(JSON.stringify({routes:routes.length,files:files.length,bytes:files.reduce((n,[,s])=>n+s,0)}));
