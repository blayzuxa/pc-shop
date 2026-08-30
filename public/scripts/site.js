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
