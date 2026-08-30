import fs from 'node:fs';

const htmlPath = new URL('../index.html', import.meta.url);
let html = fs.readFileSync(htmlPath, 'utf8');

const dimensions = {
  'pc1.png': [960, 1280], 'pc2.png': [960, 1280], 'pc3.png': [2000, 2666],
  'pc4.png': [960, 1280], 'pc5.png': [960, 1280], 'pc6.png': [960, 1280],
  'pc7.png': [2000, 2666], 'pc8.png': [960, 1280],
  'about1.jpg': [960, 1280], 'about2.jpg': [960, 1280], 'about3.jpg': [960, 1280],
  'about4.jpg': [1280, 960], 'about5.jpg': [1920, 2560], 'about6.jpg': [960, 1280],
  'work1.jpg': [1920, 2560], 'work2.jpg': [1920, 2560], 'work3.jpg': [1920, 2560],
  'work4.jpg': [1920, 2560], 'work5.jpg': [960, 1280], 'work6.jpg': [960, 1280],
  'work7.jpg': [1920, 2560], 'work8.jpg': [960, 1280],
  'review_alexandr_1.jpg': [1440, 1920], 'review_alexey_1.jpg': [1280, 961],
  'review_alexey_2.jpg': [961, 1280], 'review_kirill.jpg': [720, 960],
  'review_ogurchik.jpg': [1280, 960], 'review_vidana_1.jpg': [720, 960],
  'review_yakrut.jpg': [1164, 708]
};

html = html.replace(/<img\b[^>]*\bsrc="images\/(pc\d+\.png|about\d+\.jpg|work\d+\.jpg|review_[^"]+\.jpg)"[^>]*>/g, tag => {
  const file = tag.match(/src="images\/([^"]+)"/)[1];
  const base = file.replace(/\.(png|jpg)$/i, '');
  const [width, height] = dimensions[file];
  const isHero = tag.includes('Кастомная сборка ScoutPC');
  const isWork = base.startsWith('work');
  const isReview = base.startsWith('review_');
  const widths = isWork ? [960, 1600] : [480, 960];
  const sizes = isHero
    ? '(max-width: 768px) calc(100vw - 40px), 520px'
    : isWork
      ? '(max-width: 768px) calc(100vw - 40px), 900px'
      : isReview
        ? '(max-width: 768px) calc(100vw - 48px), 360px'
        : base.startsWith('about')
          ? '(max-width: 768px) calc(50vw - 28px), 300px'
          : '(max-width: 768px) calc(100vw - 48px), 285px';

  const srcset = widths.map(w => `images/optimized/${base}-${w}.webp ${w}w`).join(', ');
  let updated = tag.replace(/src="[^"]+"/, `src="images/optimized/${base}-${widths.at(-1)}.webp"`);
  updated = updated.replace(/\s+loading="[^"]+"/g, '').replace(/\s+decoding="[^"]+"/g, '');
  updated = updated.replace(/>$/, ` srcset="${srcset}" sizes="${sizes}" width="${width}" height="${height}" loading="${isHero ? 'eager' : 'lazy'}" decoding="async"${isHero ? ' fetchpriority="high"' : ''}>`);
  return updated;
});

fs.writeFileSync(htmlPath, html);
