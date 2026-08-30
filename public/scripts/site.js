(() => {
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
