(() => {
  const i18n = window.MEMRYA_I18N;
  const localeSelects = [
    ...document.querySelectorAll('.locale-switch select, .locale-switch-control'),
  ];

  const syncLocaleSelects = (code) => {
    localeSelects.forEach((select) => {
      select.value = code;
    });
  };

  if (i18n && localeSelects.length > 0) {
    for (const select of localeSelects) {
      select.replaceChildren(
        ...i18n.locales.map((locale) => {
          const option = document.createElement('option');
          option.value = locale.code;
          option.textContent = locale.name;
          return option;
        }),
      );
    }
    i18n.init();
    syncLocaleSelects(document.documentElement.lang || 'en');
    localeSelects.forEach((select) => {
      select.addEventListener('change', () => {
        i18n.apply(select.value);
        syncLocaleSelects(select.value);
      });
    });
  }
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-links');

  const closeNav = () => {
    if (!navToggle || !nav) return;
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = !nav.classList.contains('open');
      nav.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeNav();
    });
    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && !navToggle.contains(event.target)) closeNav();
    });
  }
  document.addEventListener('memrya:locale-changed', (event) => {
    const code = event.detail?.locale;
    if (code) syncLocaleSelects(code);
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && document.body.classList.contains('home-page')) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => document.body.classList.add('hero-ready'));
    });
  } else {
    document.body.classList.add('hero-ready');
  }
})();
