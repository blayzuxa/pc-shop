(() => {
  const form = document.getElementById('buyback-form');
  const prepare = document.getElementById('prepare-request');
  const result = document.getElementById('request-result');
  const output = document.getElementById('request-text');
  const telegram = document.getElementById('request-telegram');
  const status = document.getElementById('copy-status');
  if (!form || !prepare || !result || !output || !telegram || !status) return;
  prepare.hidden = false;
  const copyRequest = document.getElementById('copy-request');
  if (copyRequest) copyRequest.hidden = false;
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', () => {
    result.hidden = true;
    output.value = '';
    telegram.href = 'https://t.me/Scout_PC';
    status.textContent = '';
  });
  function prepareMessage() {
    for (const field of form.querySelectorAll('input[required]:not([type=checkbox]),textarea[required]')) {
      field.setCustomValidity(field.value.trim() ? '' : 'Заполните это поле.');
      field.addEventListener('input', () => field.setCustomValidity(''), { once: true });
    }
    if (!form.reportValidity()) return false;
    const values = new FormData(form);
    output.value = ['Заявка на оценку комплектующих ScoutPC',
      `Что продаю: ${values.get('category')}`,
      `Модель: ${String(values.get('model')).trim()}`,
      `Состояние и комплектность: ${String(values.get('condition')).trim()}`,
      `Желаемая цена: ${values.get('price') ? values.get('price') + ' ₽' : 'обсудим'}`,
      `Trade-in: ${values.has('tradein') ? 'интересует' : 'нет'}`,
    ].join('\n');
    telegram.href = 'https://t.me/Scout_PC';
    result.hidden = false;
    return true;
  }
  prepare.addEventListener('click', () => { if (prepareMessage()) output.focus(); });
  telegram.addEventListener('click', async () => {
    if (!output.value && !prepareMessage()) return;
    try {
      await navigator.clipboard.writeText(output.value);
      status.textContent = 'Текст заявки скопирован. Вставьте его в Telegram и приложите фотографии.';
    } catch {
      output.focus();
      output.select();
      status.textContent = 'Текст заявки выделен. Скопируйте его вручную, вставьте в Telegram и приложите фотографии.';
    }
  });
  if (copyRequest) copyRequest.addEventListener('click', async () => {
    if (!prepareMessage()) return;
    try {
      await navigator.clipboard.writeText(output.value);
      copyRequest.textContent = 'Скопировано ✓';
      setTimeout(() => { copyRequest.textContent = 'Скопировать заявку'; }, 2000);
      status.textContent = 'Сообщение скопировано. Откройте MAX или Telegram, вставьте текст и приложите фото.';
    } catch {
      output.focus();
      output.select();
      status.textContent = 'Автоматическое копирование недоступно. Текст выделен — скопируйте его вручную.';
    }
  });
  const visual = document.querySelector('.buyback-parallax');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(pointer: fine)');
  if (visual) {
    const reset = () => {
      visual.style.removeProperty('--parallax-x');
      visual.style.removeProperty('--parallax-y');
    };
    visual.addEventListener('pointermove', event => {
      if (motion.matches || !finePointer.matches) return;
      const rect = visual.getBoundingClientRect();
      visual.style.setProperty('--parallax-x', `${((event.clientX-rect.left)/rect.width-.5)*8}px`);
      visual.style.setProperty('--parallax-y', `${((event.clientY-rect.top)/rect.height-.5)*8}px`);
    });
    visual.addEventListener('pointerleave', reset);
    motion.addEventListener('change', reset);
  }
  const cards = document.querySelectorAll('#categories .buyback-grid > .buyback-card, .steps-grid > .buyback-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', event => {
      if (motion.matches || !finePointer.matches) return;
      const rect = card.getBoundingClientRect();
      const rotateX = ((event.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -4;
      const rotateY = ((event.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 4;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseenter', () => {
      if (!motion.matches && finePointer.matches) card.style.transition = 'transform 0.15s ease-out';
    });
    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('transform');
      card.style.removeProperty('transition');
    });
  });
})();