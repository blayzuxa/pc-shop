(() => {
  const CONSENT_KEY = 'scoutpc_analytics_consent_v1';
  const consentPanel = document.getElementById('privacyConsent');
  const acceptButton = document.getElementById('privacyAccept');
  const declineButton = document.getElementById('privacyDecline');

  const showConsent = () => {
    consentPanel?.classList.add('is-visible');
    consentPanel?.setAttribute('aria-hidden', 'false');
  };

  const hideConsent = () => {
    consentPanel?.classList.remove('is-visible');
    consentPanel?.setAttribute('aria-hidden', 'true');
  };

  const loadMetrika = () => {
    if (window.__scoutpcMetrikaLoaded) return;
    window.__scoutpcMetrikaLoaded = true;
    window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
    window.ym.l = Date.now();
    const script = document.createElement('script');
    script.async = true;
    script.dataset.scoutpcMetrika = 'true';
    script.src = 'https://mc.yandex.ru/metrika/tag.js?id=112081790';
    document.head.appendChild(script);
    window.ym(112081790, 'init', {
      ssr: true,
      webvisor: true,
      clickmap: true,
      ecommerce: 'dataLayer',
      referrer: document.referrer,
      url: location.href,
      accurateTrackBounce: true,
      trackLinks: true,
    });
  };

  const disableMetrika = () => {
    if (window.__scoutpcMetrikaLoaded && typeof window.ym === 'function') {
      try { window.ym(112081790, 'destruct'); } catch (_) { /* counter may still be loading */ }
    }
    document.querySelectorAll('script[data-scoutpc-metrika]').forEach(script => script.remove());
    ['_ym_uid', '_ym_d', '_ym_isad', '_ym_visorc', '_ym_wv2rf'].forEach(name => {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    });
    window.__scoutpcMetrikaLoaded = false;
  };

  const saveConsent = value => {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (_) { /* storage can be unavailable */ }
    hideConsent();
    if (value === 'accepted') loadMetrika();
    else disableMetrika();
  };

  let consent = null;
  try { consent = localStorage.getItem(CONSENT_KEY); } catch (_) { /* storage can be unavailable */ }
  if (consent === 'accepted') {
    hideConsent();
    loadMetrika();
  } else if (consent === 'declined') {
    hideConsent();
  } else {
    showConsent();
  }

  acceptButton?.addEventListener('click', () => saveConsent('accepted'));
  declineButton?.addEventListener('click', () => saveConsent('declined'));


  // Source of a user-initiated request, not an analytics beacon. Never forward
  // raw referrers, URLs, search queries, campaign tags or other URL parameters.
  const LEAD_SOURCE_KEY = 'scoutpc_lead_source_v1';
  const LEAD_SOURCE_TTL_MS = 2 * 60 * 60 * 1000;
  const knownSourceLabels = new Set([
    'Google', 'Google Ads', 'Яндекс', 'Яндекс Директ', 'TikTok',
    'Авито', 'Telegram', 'MAX', 'ВКонтакте', 'Instagram',
    'YouTube', '2ГИС', 'ChatGPT', 'Gemini', 'Facebook',
    'Другой сайт', 'Другая метка'
  ]);
  const utmSourceLabels = {
    google: 'Google', google_ads: 'Google Ads', googleads: 'Google Ads',
    adwords: 'Google Ads', yandex: 'Яндекс', ya: 'Яндекс',
    yandex_direct: 'Яндекс Директ', direct_yandex: 'Яндекс Директ',
    tiktok: 'TikTok', tik_tok: 'TikTok', tt: 'TikTok',
    avito: 'Авито', telegram: 'Telegram', tg: 'Telegram',
    max: 'MAX', vk: 'ВКонтакте', vkontakte: 'ВКонтакте',
    instagram: 'Instagram', insta: 'Instagram',
    youtube: 'YouTube', yt: 'YouTube', '2gis': '2ГИС',
    chatgpt: 'ChatGPT', openai: 'ChatGPT', gemini: 'Gemini',
    facebook: 'Facebook', fb: 'Facebook'
  };
  const hostIs = (host, domain) => host === domain || host.endsWith('.' + domain);
  const sourceFromReferrer = host => {
    if (hostIs(host, 'gemini.google.com')) return 'Gemini';
    if (hostIs(host, 'chatgpt.com') || hostIs(host, 'chat.openai.com')) return 'ChatGPT';
    if (['google.com', 'google.ru', 'google.de', 'google.co.uk', 'google.fr',
      'google.nl', 'google.se', 'google.pl', 'google.kz', 'google.com.tr']
      .some(domain => hostIs(host, domain))) return 'Google';
    if (['yandex.ru', 'yandex.com', 'yandex.by', 'yandex.kz', 'ya.ru']
      .some(domain => hostIs(host, domain))) return 'Яндекс';
    const sources = [
      ['tiktok.com', 'TikTok'], ['avito.ru', 'Авито'],
      ['t.me', 'Telegram'], ['telegram.org', 'Telegram'],
      ['max.ru', 'MAX'], ['vk.com', 'ВКонтакте'],
      ['instagram.com', 'Instagram'], ['youtube.com', 'YouTube'],
      ['youtu.be', 'YouTube'], ['2gis.ru', '2ГИС'],
      ['facebook.com', 'Facebook']
    ];
    return sources.find(([domain]) => hostIs(host, domain))?.[1] || 'Другой сайт';
  };
  const detectLeadSource = () => {
    try {
      const utm = new URLSearchParams(location.search).get('utm_source');
      if (utm && utm.trim()) {
        const source = utmSourceLabels[utm.trim().toLowerCase().replace(/[\s-]+/g, '_')];
        return { label: source || 'Другая метка', via: 'utm' };
      }
      if (!document.referrer) return null;
      const previous = new URL(document.referrer);
      if (previous.protocol !== 'http:' && previous.protocol !== 'https:') return null;
      const host = previous.hostname.toLowerCase().replace(/^www\./, '');
      const ownHost = location.hostname.toLowerCase().replace(/^www\./, '');
      if (host === ownHost) return null;
      return { label: sourceFromReferrer(host), via: 'referrer' };
    } catch (_) {
      return null;
    }
  };
  const analyticsAllowed = () => {
    try { return localStorage.getItem(CONSENT_KEY) === 'accepted'; }
    catch (_) { return false; }
  };
  const readSessionSource = () => {
    if (!analyticsAllowed()) return null;
    try {
      const record = JSON.parse(sessionStorage.getItem(LEAD_SOURCE_KEY) || 'null');
      const age = Date.now() - record?.savedAt;
      if (record && knownSourceLabels.has(record.label) &&
          (record.via === 'utm' || record.via === 'referrer') &&
          age >= 0 && age <= LEAD_SOURCE_TTL_MS) {
        return { label: record.label, via: record.via };
      }
    } catch (_) { /* storage may be blocked */ }
    return null;
  };
  const detectedLeadSource = detectLeadSource();
  const leadSource = detectedLeadSource || readSessionSource();
  const rememberLeadSource = () => {
    if (!analyticsAllowed() || !detectedLeadSource) return;
    try {
      sessionStorage.setItem(LEAD_SOURCE_KEY, JSON.stringify({
        ...detectedLeadSource, savedAt: Date.now()
      }));
    } catch (_) { /* storage may be blocked */ }
  };
  rememberLeadSource();
  acceptButton?.addEventListener('click', rememberLeadSource);
  declineButton?.addEventListener('click', () => {
    try { sessionStorage.removeItem(LEAD_SOURCE_KEY); } catch (_) { /* ignore */ }
  });
  window.scoutpcLeadSource = () => leadSource
    ? leadSource.label + (leadSource.via === 'utm' ? ' (метка ссылки)' : ' (сайт перехода)')
    : 'Не определён';

  // Conversion events are anonymous and strictly consent-gated.
  const goalNames = new Set(['builder_start', 'builder_complete', 'contact_telegram', 'contact_max', 'contact_phone', 'buyback_prepare']);
  const onceGoals = new Set(['builder_start', 'builder_complete', 'buyback_prepare']);
  const sentGoals = new Set();
  window.scoutpcGoal = name => {
    if (!goalNames.has(name) || !window.__scoutpcMetrikaLoaded || typeof window.ym !== 'function') return;
    if (onceGoals.has(name) && sentGoals.has(name)) return;
    try {
      window.ym(112081790, 'reachGoal', name);
      if (onceGoals.has(name)) sentGoals.add(name);
    } catch (_) { /* analytics must never block site interactions */ }
  };
  document.addEventListener('click', event => {
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link) return;
    try {
      const url = new URL(link.href, location.href);
      if (url.protocol === 'tel:') window.scoutpcGoal('contact_phone');
      else if (url.hostname === 't.me' && url.pathname.replace(/\/$/, '').toLowerCase() === '/scout_pc') window.scoutpcGoal('contact_telegram');
      else if (url.hostname === 'max.ru' && url.pathname.startsWith('/u/')) window.scoutpcGoal('contact_max');
    } catch (_) { /* ignore invalid URLs */ }
  });

  // The main page keeps its original, proven interaction bundle intact.
  if (document.body.dataset.page === 'index') return;

  const menuButton = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenuOverlay');
  const closeButton = document.getElementById('mobileMenuClose');
  menuButton?.addEventListener('click', () => {
    const open = mobileMenu?.classList.toggle('open') ?? false;
    menuButton.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  closeButton?.addEventListener('click', () => {
    mobileMenu?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
  mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }));

  document.querySelectorAll('.consult-trigger').forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.stopPropagation();
      const dropdown = trigger.closest('.consult-dropdown');
      document.querySelectorAll('.consult-dropdown.open').forEach(item => {
        if (item !== dropdown) item.classList.remove('open');
      });
      dropdown?.classList.toggle('open');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.consult-dropdown.open').forEach(item => item.classList.remove('open'));
  });

  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible'));
  }, { threshold: .08 }) : null;
  document.querySelectorAll('.reveal').forEach(el => observer ? observer.observe(el) : el.classList.add('visible'));

  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question')?.addEventListener('click', () => item.classList.toggle('open'));
  });

  const slides = [...document.querySelectorAll('#sliderViewport img')];
  let current = 0;
  const show = index => slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
  document.getElementById('nextSlide')?.addEventListener('click', () => show(current = (current + 1) % slides.length));
  document.getElementById('prevSlide')?.addEventListener('click', () => show(current = (current - 1 + slides.length) % slides.length));
  if (slides.length) show(0);
})();
