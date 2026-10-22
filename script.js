(() => {
  const config = window.SITE_CONFIG || {};
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menuButton.setAttribute('aria-label', open ? 'Abrir menu' : 'Fechar menu');
    nav.classList.toggle('open', !open);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open'); menuButton?.setAttribute('aria-expanded', 'false'); menuButton?.setAttribute('aria-label', 'Abrir menu');
  }));
  document.querySelector('#year').textContent = new Date().getFullYear();
  const float = document.querySelector('.whatsapp-float');
  const phone = (config.whatsappNumber || '').replace(/\D/g, '');
  if (phone.length >= 12 && phone.length <= 13) {
    const href = `https://wa.me/${phone}?text=${encodeURIComponent(config.whatsappGreeting || '')}`;
    float.href = href; float.target = '_blank'; float.rel = 'noopener noreferrer';
    float.setAttribute('aria-label', 'Fale conosco pelo WhatsApp');
    float.querySelector('.whatsapp-label').textContent = 'WhatsApp';
    float.querySelector('[aria-hidden]').textContent = '◉';
    document.querySelectorAll('a[href="#contato"],a[href="#agendamento"]').forEach(a => {
      if (a.classList.contains('whatsapp-link')) { a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    });
  }
  const form = document.querySelector('#appointment-form');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const status = document.querySelector('#form-status');
    if (!form.reportValidity()) return;
    if (phone.length < 12 || phone.length > 13) {
      status.textContent = 'O canal de WhatsApp ainda está sendo configurado. Por favor, consulte novamente os canais oficiais ou tente mais tarde.';
      status.style.color = '#8a5a35'; return;
    }
    const data = new FormData(form);
    const message = [config.whatsappGreeting || 'Olá, gostaria de solicitar informações sobre atendimento.', '',
      `Nome: ${data.get('nome')}`, `Telefone: ${data.get('telefone')}`,
      data.get('email') ? `E-mail: ${data.get('email')}` : '', `Assunto: ${data.get('assunto')}`,
      `Preferência: ${data.get('preferencia')}`, '', 'Esta é uma solicitação de atendimento, ainda não confirmada.'
    ].filter(Boolean).join('\n');
    status.textContent = 'Abrindo o WhatsApp para você revisar e enviar sua solicitação. O atendimento só será confirmado pelo escritório.';
    status.style.color = '#355d49';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  });

  const revealItems = document.querySelectorAll(
    '.about-grid, .practice-heading, .neutral-panel, .steps-heading, .steps-grid .step, .appointment-copy, .contact-form, .faq-grid > div, .contact-grid > div'
  );
  const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  const sectionLinks = navLinks
    .map(link => ({ link, section: document.querySelector(link.getAttribute('href')) }))
    .filter(item => item.section);

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

    revealItems.forEach((item, index) => {
      item.classList.add('scroll-reveal');
      item.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 75}ms`);
      revealObserver.observe(item);
    });

    const activeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach(({ link, section }) => {
          const active = section === entry.target;
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { threshold: 0, rootMargin: '-25% 0px -65% 0px' });

    sectionLinks.forEach(({ section }) => activeObserver.observe(section));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }
})();

