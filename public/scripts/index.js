
        (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {
                if (document.scripts[j].src === r) return;
            }
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);
        })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=112081790', 'ym');

        ym(112081790, 'init', {
            ssr: true,
            webvisor: true,
            clickmap: true,
            ecommerce: 'dataLayer',
            referrer: document.referrer,
            url: location.href,
            accurateTrackBounce: true,
            trackLinks: true
        });
    

        (function() {
            const header = document.getElementById('header');
            function updateHeader() {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
            window.addEventListener('scroll', updateHeader, { passive: true });

            const revealElements = document.querySelectorAll('.reveal');
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
            revealElements.forEach(el => revealObserver.observe(el));

            // ANIMATED STAT COUNTERS
            const statEls = document.querySelectorAll('.hero-stat-value');
            const statObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    const target = parseFloat(el.dataset.count);
                    const decimals = parseInt(el.dataset.decimal || '0', 10);
                    const suffix = el.dataset.suffix || '';
                    const duration = 1400;
                    const startTime = performance.now();
                    function tick(now) {
                        const progress = Math.min((now - startTime) / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const value = target * eased;
                        el.textContent = value.toFixed(decimals) + suffix;
                        if (progress < 1) requestAnimationFrame(tick);
                    }
                    requestAnimationFrame(tick);
                    statObserver.unobserve(el);
                });
            }, { threshold: 0.4 });
            statEls.forEach(el => statObserver.observe(el));

            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        const headerHeight = header.offsetHeight;
                        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
                        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    }
                });
            });

            const orbs = document.querySelectorAll('.bg-orb');
            let mouseX = 0, mouseY = 0, targetMouseX = 0, targetMouseY = 0;
            document.addEventListener('mousemove', function(e) {
                targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
                targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
            });
            function animateOrbs() {
                mouseX += (targetMouseX - mouseX) * 0.03;
                mouseY += (targetMouseY - mouseY) * 0.03;
                if (orbs[0]) orbs[0].style.transform = `translate(${mouseX * 40}px, ${mouseY * 40}px)`;
                if (orbs[1]) orbs[1].style.transform = `translate(${mouseX * -35}px, ${mouseY * -30}px)`;
                if (orbs[2]) orbs[2].style.transform = `translate(${mouseX * 25}px, ${mouseY * -35}px)`;
                if (orbs[3]) orbs[3].style.transform = `translate(${mouseX * -30}px, ${mouseY * 25}px)`;
                if (orbs[4]) orbs[4].style.transform = `translate(${mouseX * 20}px, ${mouseY * -20}px)`;
                requestAnimationFrame(animateOrbs);
            }
            animateOrbs();

            const glassCards = document.querySelectorAll('.glass-card');
            glassCards.forEach(card => {
                card.addEventListener('mousemove', function(e) {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = ((y - centerY) / centerY) * -4;
                    const rotateY = ((x - centerX) / centerX) * 4;
                    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
                });
                card.addEventListener('mouseleave', function() {
                    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
                });
                card.addEventListener('mouseenter', function() {
                    card.style.transition = 'transform 0.15s ease-out';
                });
            });

            document.querySelectorAll('.btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    const ripple = document.createElement('span');
                    ripple.style.cssText = `
                        position: absolute;
                        border-radius: 50%;
                        background: rgba(255,255,255,0.35);
                        transform: scale(0);
                        animation: rippleAnim 0.7s ease-out forwards;
                        pointer-events: none;
                        left: ${e.clientX - btn.getBoundingClientRect().left}px;
                        top: ${e.clientY - btn.getBoundingClientRect().top}px;
                        width: 20px;
                        height: 20px;
                        margin-left: -10px;
                        margin-top: -10px;
                    `;
                    btn.appendChild(ripple);
                    ripple.addEventListener('animationend', () => ripple.remove());
                });
            });
            const rippleStyle = document.createElement('style');
            rippleStyle.textContent = `@keyframes rippleAnim { to { transform: scale(30); opacity: 0; } }`;
            document.head.appendChild(rippleStyle);

            // PORTFOLIO SLIDER (УНИВЕРСАЛЬНЫЙ)
const slides = document.querySelectorAll('#sliderViewport img');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');
const dotsContainer = document.querySelector('.slider-dots');
let currentIndex = 0;
let autoPlayInterval;

function initDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
}

function goToSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    const activeDots = document.querySelectorAll('.slider-dot');
    activeDots.forEach(d => d.classList.remove('active'));
    
    slides[index].classList.add('active');
    if (activeDots[index]) activeDots[index].classList.add('active');
    
    currentIndex = index;
}

function nextSlide() {
    let next = (currentIndex + 1) % slides.length;
    goToSlide(next);
}

function prevSlide() {
    let prev = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(prev);
}

if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });

function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000);
}

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
}

initDots();
if (slides.length > 0) goToSlide(0);
startAutoPlay();


            // CATALOG TABS
            const tabBtns = document.querySelectorAll('.tab-btn');
            const intelGroup = document.getElementById('intel-group');
            const amdGroup = document.getElementById('amd-group');
            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    tabBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const tab = btn.dataset.tab;
                    if (tab === 'intel') {
                        intelGroup.classList.remove('hidden');
                        amdGroup.classList.add('hidden');
                    } else {
                        amdGroup.classList.remove('hidden');
                        intelGroup.classList.add('hidden');
                    }
                });
            });

            // BUDGET FILTER
            const budgetBtns = document.querySelectorAll('.budget-btn');
            const allPcCards = document.querySelectorAll('.pc-card');
            function applyBudgetFilter(value) {
                budgetBtns.forEach(b => b.classList.toggle('active', b.dataset.budget === value));
                allPcCards.forEach(card => {
                    const matches = value === 'all' || card.dataset.budget === value;
                    card.classList.toggle('budget-hidden', !matches);
                });
            }
            budgetBtns.forEach(btn => {
                btn.addEventListener('click', () => applyBudgetFilter(btn.dataset.budget));
            });

            // TASK PICKER CARDS -> jump to catalog with matching budget filter
            document.querySelectorAll('.task-card').forEach(card => {
                card.addEventListener('click', () => {
                    applyBudgetFilter(card.dataset.gotoBudget);
                    const catalogSection = document.getElementById('catalog');
                    const headerHeight = header.offsetHeight;
                    const targetPosition = catalogSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                });
            });

            // PC BUILDER WIZARD
            (function() {
                const TELEGRAM_USERNAME = 'Scout_PC';
                const steps = Array.from(document.querySelectorAll('.builder-step'));
                const progressItems = Array.from(document.querySelectorAll('.builder-progress-item'));
                const backBtn = document.getElementById('builderBack');
                const nextBtn = document.getElementById('builderNext');
                const submitRow = document.getElementById('builderSubmitRow');
                const copyBtn = document.getElementById('builderCopyBtn');
                const summaryBox = document.getElementById('builderSummary');
                if (!steps.length || !nextBtn) return;

                let currentStep = 1;
                const totalSteps = steps.length;
                const answers = { platform: '', budget: '', goal: '', rgb: '' };

                document.querySelectorAll('.choice-grid').forEach(grid => {
                    const group = grid.dataset.group;
                    grid.querySelectorAll('.choice-btn').forEach(btn => {
                        btn.addEventListener('click', () => {
                            grid.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
                            btn.classList.add('selected');
                            answers[group] = btn.dataset.value;
                        });
                    });
                });

                function updateProgress() {
                    progressItems.forEach(item => {
                        const step = parseInt(item.dataset.step, 10);
                        item.classList.remove('active', 'done');
                        if (step === currentStep) item.classList.add('active');
                        else if (step < currentStep) item.classList.add('done');
                    });
                }

                function buildSummary() {
                    const comment = document.getElementById('builderComment').value.trim();
                    let html = '';
                    if (answers.platform) html += `<strong>Платформа:</strong> ${answers.platform}<br>`;
                    if (answers.budget) html += `<strong>Бюджет:</strong> ${answers.budget}<br>`;
                    if (answers.goal) html += `<strong>Задача:</strong> ${answers.goal}<br>`;
                    if (answers.rgb) html += `<strong>Подсветка:</strong> ${answers.rgb}<br>`;
                    if (comment) html += `<strong>Пожелания:</strong> ${comment}`;
                    summaryBox.innerHTML = html || 'Пока ничего не выбрано';
                }

                function showStep(step) {
                    steps.forEach(s => s.classList.toggle('active', parseInt(s.dataset.step, 10) === step));
                    updateProgress();
                    backBtn.style.visibility = step === 1 ? 'hidden' : 'visible';
                    if (step === totalSteps) {
                        buildSummary();
                        nextBtn.textContent = window.innerWidth <= 480 ? 'В Telegram →' : 'Отправить в Telegram';
                        submitRow.style.display = 'flex';
                    } else {
                        nextBtn.textContent = 'Далее';
                        submitRow.style.display = 'none';
                    }
                }

                function validateStep(step) {
                    if (step >= 1 && step <= 4) {
                        const groupMap = { 1: 'platform', 2: 'budget', 3: 'goal', 4: 'rgb' };
                        const group = groupMap[step];
                        if (group === 'rgb') return true; // style step is optional
                        if (!answers[group]) {
                            const grid = document.querySelector(`.choice-grid[data-group="${group}"]`);
                            if (grid) {
                                grid.style.animation = 'none';
                                requestAnimationFrame(() => { grid.style.animation = 'shakeInvalid 0.4s'; });
                            }
                            return false;
                        }
                    }
                    return true;
                }

                function buildRequestText() {
                    const comment = document.getElementById('builderComment').value.trim();
                    let text = 'Заявка на сборку ПК с сайта ScoutPC\n\n';
                    text += `Платформа: ${answers.platform || '—'}\n`;
                    text += `Бюджет: ${answers.budget || '—'}\n`;
                    text += `Задача: ${answers.goal || '—'}\n`;
                    text += `Подсветка: ${answers.rgb || '—'}\n`;
                    if (comment) text += `Пожелания: ${comment}\n`;
                    return text;
                }

                function sendToTelegram() {
                    const text = buildRequestText();
                    if (!text) return;
                    const url = `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(text)}`;
                    window.open(url, '_blank');
                }

                function copyRequestText() {
                    const text = buildRequestText();
                    if (!text) return;
                    const showCopied = () => {
                        const original = copyBtn.textContent;
                        copyBtn.textContent = 'Скопировано ✓';
                        setTimeout(() => { copyBtn.textContent = original; }, 2000);
                    };
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(text).then(showCopied).catch(() => {
                            fallbackCopy(text, showCopied);
                        });
                    } else {
                        fallbackCopy(text, showCopied);
                    }
                }

                function fallbackCopy(text, onSuccess) {
                    const textarea = document.createElement('textarea');
                    textarea.value = text;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.select();
                    try { document.execCommand('copy'); onSuccess(); } catch (e) {}
                    document.body.removeChild(textarea);
                }

                nextBtn.addEventListener('click', () => {
                    if (currentStep === totalSteps) {
                        sendToTelegram();
                        return;
                    }
                    if (!validateStep(currentStep)) return;
                    currentStep = Math.min(currentStep + 1, totalSteps);
                    showStep(currentStep);
                });

                copyBtn.addEventListener('click', copyRequestText);

                backBtn.addEventListener('click', () => {
                    currentStep = Math.max(currentStep - 1, 1);
                    showStep(currentStep);
                });

                showStep(currentStep);
            })();

            // CONSULTATION DROPDOWNS (Telegram / MAX choice)
            document.querySelectorAll('.consult-trigger').forEach(trigger => {
                trigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const dropdown = trigger.closest('.consult-dropdown');
                    const isOpen = dropdown.classList.contains('open');
                    document.querySelectorAll('.consult-dropdown.open').forEach(d => d.classList.remove('open'));
                    if (!isOpen) {
                        dropdown.classList.add('open');
                        const overlay = dropdown.closest('#mobileMenuOverlay');
                        if (overlay) {
                            setTimeout(() => {
                                const menu = dropdown.querySelector('.consult-menu');
                                if (menu) menu.scrollIntoView({ behavior: 'smooth', block: 'end' });
                            }, 60);
                        }
                    }
                });
            });
            document.addEventListener('click', () => {
                document.querySelectorAll('.consult-dropdown.open').forEach(d => d.classList.remove('open'));
            });

            // MOBILE FULL-SCREEN MENU
            const hamburger = document.getElementById('hamburger');
            const mobileOverlay = document.getElementById('mobileMenuOverlay');
            const mobileClose = document.getElementById('mobileMenuClose');
            function openMobileMenu() {
                hamburger.classList.add('active');
                mobileOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
            function closeMobileMenu() {
                hamburger.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
            if (hamburger) {
                hamburger.addEventListener('click', () => {
                    if (mobileOverlay.classList.contains('active')) closeMobileMenu();
                    else openMobileMenu();
                });
            }
            if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
            mobileOverlay.querySelectorAll('.mobile-overlay-link').forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });

            // FPS INFO POPOVERS
            function closeAllFpsPopovers() {
                document.querySelectorAll('.fps-info-wrap.open').forEach(w => {
                    w.classList.remove('open');
                    const pop = w.querySelector('.fps-popover');
                    if (pop) {
                        pop.style.marginLeft = '';
                        pop.style.transform = '';
                        pop.classList.remove('below');
                    }
                });
            }
            document.querySelectorAll('.fps-info').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const wrap = btn.closest('.fps-info-wrap');
                    const isOpen = wrap.classList.contains('open');
                    closeAllFpsPopovers();
                    if (!isOpen) {
                        wrap.classList.add('open');
                        const popover = wrap.querySelector('.fps-popover');
                        requestAnimationFrame(() => {
                            const margin = 12;
                            let rect = popover.getBoundingClientRect();
                            if (rect.top < margin) {
                                popover.classList.add('below');
                                rect = popover.getBoundingClientRect();
                            }
                            const viewportWidth = document.documentElement.clientWidth;
                            // Clamp against the card's own edges first so the popover
                            // never spills into a neighbouring catalog card, then also
                            // clamp against the viewport as a fallback.
                            const card = btn.closest('.pc-card');
                            const cardRect = card ? card.getBoundingClientRect() : null;
                            const leftBound = Math.max(margin, cardRect ? cardRect.left + margin : margin);
                            const rightBound = Math.min(viewportWidth - margin, cardRect ? cardRect.right - margin : viewportWidth - margin);
                            let shiftX = 0;
                            if (rect.right > rightBound) {
                                shiftX = rightBound - rect.right;
                            } else if (rect.left < leftBound) {
                                shiftX = leftBound - rect.left;
                            }
                            if (shiftX !== 0) {
                                popover.style.marginLeft = (-115 + shiftX) + 'px';
                            }
                            rect = popover.getBoundingClientRect();
                            const viewportHeight = document.documentElement.clientHeight;
                            let shiftY = 0;
                            if (rect.bottom > viewportHeight - margin) {
                                shiftY = (viewportHeight - margin) - rect.bottom;
                            } else if (rect.top < margin) {
                                shiftY = margin - rect.top;
                            }
                            if (shiftY !== 0) {
                                popover.style.transform = `translateY(${shiftY}px)`;
                            }
                        });
                    }
                });
            });
            document.addEventListener('click', closeAllFpsPopovers);

            // REVIEWS SLIDER
            (function() {
                const grid = document.getElementById('reviewsGrid');
                const prev = document.getElementById('reviewsPrev');
                const next = document.getElementById('reviewsNext');
                if (!grid || !prev || !next) return;
                function scrollByCard(dir) {
                    const card = grid.querySelector('.review-card');
                    const gap = 24;
                    const amount = card ? (card.getBoundingClientRect().width + gap) : 340;
                    grid.scrollBy({ left: dir * amount, behavior: 'smooth' });
                }
                prev.addEventListener('click', () => scrollByCard(-1));
                next.addEventListener('click', () => scrollByCard(1));
            })();

            // FAQ ACCORDION
            document.querySelectorAll('.faq-item').forEach(item => {
                const question = item.querySelector('.faq-question');
                question.addEventListener('click', () => {
                    const wasOpen = item.classList.contains('open');
                    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
                    if (!wasOpen) item.classList.add('open');
                });
            });

            updateHeader();
            console.log('🖥️ ScoutPC — финальная версия');
        })();
    