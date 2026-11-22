const desktopNavigation = `<ul class="nav-menu">
<li><a href="/igrovye-kompyutery-krasnodar.html">Готовые ПК</a></li>
<li><a href="/sborka-pk-krasnodar.html">Сборка на заказ</a></li>
<li><a href="/apgreyd-i-obsluzhivanie-pk-krasnodar.html">Апгрейд</a></li>
<li><a href="/vykup-videokart-i-komplektuyushchih-krasnodar.html">Выкуп и Trade-in</a></li>
<li><a href="/#reviews">Отзывы</a></li>
</ul>`;

const mobileNavigation = `<a class="mobile-overlay-link" href="/igrovye-kompyutery-krasnodar.html"><span>Готовые ПК</span><span class="arrow">→</span></a>
<a class="mobile-overlay-link" href="/sborka-pk-krasnodar.html"><span>Сборка на заказ</span><span class="arrow">→</span></a>
<a class="mobile-overlay-link" href="/apgreyd-i-obsluzhivanie-pk-krasnodar.html"><span>Апгрейд и обслуживание</span><span class="arrow">→</span></a>
<a class="mobile-overlay-link" href="/vykup-videokart-i-komplektuyushchih-krasnodar.html"><span>Выкуп и Trade-in</span><span class="arrow">→</span></a>
<a class="mobile-overlay-link" href="/#reviews"><span>Отзывы</span><span class="arrow">→</span></a>`;

const footerNavigation = `<div class="footer-links">
<a href="/igrovye-kompyutery-krasnodar.html">Готовые ПК</a>
<a href="/sborka-pk-krasnodar.html">Сборка на заказ</a>
<a href="/apgreyd-i-obsluzhivanie-pk-krasnodar.html">Апгрейд</a>
<a href="/vykup-videokart-i-komplektuyushchih-krasnodar.html">Выкуп и Trade-in</a>
<a href="/#reviews">Отзывы</a>
<a href="/#location">Контакты</a>
</div>`;

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
    .replaceAll('href="apgreyd-i-obsluzhivanie-pk-krasnodar.html"', 'href="/apgreyd-i-obsluzhivanie-pk-krasnodar.html"');

  return [
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
  );
}
