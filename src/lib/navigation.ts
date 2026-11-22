const desktopNavigation = `<ul class="nav-menu">
<li><a href="/#catalog">Модели ПК</a></li>
<li><a href="/sborka-pk-krasnodar.html">Сборка на заказ</a></li>
<li><a href="/apgreyd-i-obsluzhivanie-pk-krasnodar.html">Апгрейд</a></li>
<li><a href="/vykup-videokart-i-komplektuyushchih-krasnodar.html">Выкуп и Trade-in</a></li>
<li><a href="/#reviews">Отзывы</a></li>
</ul>`;

const mobileNavigation = `<a class="mobile-overlay-link" href="/#catalog"><span>Модели ПК</span><span class="arrow">→</span></a>
<a class="mobile-overlay-link" href="/sborka-pk-krasnodar.html"><span>Сборка на заказ</span><span class="arrow">→</span></a>
<a class="mobile-overlay-link" href="/apgreyd-i-obsluzhivanie-pk-krasnodar.html"><span>Апгрейд и обслуживание</span><span class="arrow">→</span></a>
<a class="mobile-overlay-link" href="/vykup-videokart-i-komplektuyushchih-krasnodar.html"><span>Выкуп и Trade-in</span><span class="arrow">→</span></a>
<a class="mobile-overlay-link" href="/#reviews"><span>Отзывы</span><span class="arrow">→</span></a>
<a class="mobile-overlay-link" href="tel:+79531171331"><span>+7 953 117-13-31</span><span class="arrow">→</span></a>`;

const footerNavigation = `<div class="footer-links">
<a href="/#catalog">Модели ПК</a>
<a href="/sborka-pk-krasnodar.html">Сборка на заказ</a>
<a href="/apgreyd-i-obsluzhivanie-pk-krasnodar.html">Апгрейд</a>
<a href="/vykup-videokart-i-komplektuyushchih-krasnodar.html">Выкуп и Trade-in</a>
<a href="/#reviews">Отзывы</a>
<a href="/#location">Контакты</a>
<a href="tel:+79531171331">+7 953 117-13-31</a>
</div>`;

const modelShortcuts = `<nav class="model-shortcuts" aria-label="Страницы моделей ScoutPC">
<span>Выберите серию:</span>
<a href="/scout-start.html">Scout Start</a>
<a href="/scout-gamer.html">Scout Gamer</a>
<a href="/scout-pro.html">Scout Pro</a>
<a href="/scout-elite.html">Scout Elite</a>
</nav>`;

const productUrls = [
  '/scout-start.html',
  '/scout-gamer.html',
  '/scout-pro.html',
  '/scout-elite.html',
  '/scout-start.html',
  '/scout-gamer.html',
  '/scout-pro.html',
  '/scout-elite.html',
];

function linkProductButtons(content: string): string {
  let index = 0;
  return content.replace(
    /<span class="consult-dropdown pc-consult-dropdown">\s*<button class="btn btn-outline consult-trigger" type="button">Подробнее о сборке<\/button>[\s\S]*?<\/span>\s*<\/span>/g,
    () => {
      const url = productUrls[index++];
      return url
        ? `<a class="btn btn-outline pc-model-link" href="${url}">Страница модели →</a>`
        : '';
    },
  );
}

export function enhanceNavigation(content: string): string {
  const enhanced = content
    .replace(/<ul class="nav-menu">[\s\S]*?<\/ul>/, desktopNavigation)
    .replace(
      /(<div class="mobile-overlay-content">)[\s\S]*?(<div class="mobile-overlay-social">)/,
      `$1\n${mobileNavigation}\n$2`,
    )
    .replace(/<div class="footer-links">[\s\S]*?<\/div>/, footerNavigation)
    .replaceAll('href="index.html"', 'href="/"')
    .replaceAll('href="index.html#', 'href="/#')
    .replaceAll('href="privacy-policy.html"', 'href="/privacy-policy.html"')
    .replaceAll('href="pdn-consent.html"', 'href="/pdn-consent.html"')
    .replaceAll('href="sborka-pk-krasnodar.html"', 'href="/sborka-pk-krasnodar.html"')
    .replaceAll('href="igrovye-kompyutery-krasnodar.html"', 'href="/igrovye-kompyutery-krasnodar.html"')
    .replaceAll('href="apgreyd-i-obsluzhivanie-pk-krasnodar.html"', 'href="/apgreyd-i-obsluzhivanie-pk-krasnodar.html"')
    .replace(
      '<section class="section" id="catalog">',
      `<section class="section" id="catalog">\n${modelShortcuts}`,
    )
    .replace(
      'Перед визитом уточните наличие нужной сборки в',
      'Перед визитом уточните наличие по телефону <a href="tel:+79531171331">+7 953 117-13-31</a> или в',
    )
    .replace(
      /(<(?:div|span) class="consult-menu"[^>]*>)/g,
      '$1\n<a class="consult-phone-link" href="tel:+79531171331"><span class="consult-menu-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.84.56 2.8.69A2 2 0 0 1 22 16.92z"/></svg></span> +7 953 117-13-31</a>',
    );

  return linkProductButtons([
    ['🎮 Scout Start', '/scout-start.html'],
    ['⚔ Scout Gamer', '/scout-gamer.html'],
    ['🔥 Scout Pro', '/scout-pro.html'],
    ['👑 Scout Elite', '/scout-elite.html'],
  ].reduce(
    (html, [label, url]) => html.replaceAll(
      `<h3 class="pc-card-title">${label}</h3>`,
      `<h3 class="pc-card-title"><a href="${url}" style="color: inherit; text-decoration: none;">${label}</a></h3>`,
    ),
    enhanced,
  ));
}
