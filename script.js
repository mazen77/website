(() => {
  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Theme (persist + prefers-color-scheme fallback)
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  const getPreferredTheme = () => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  };

  const setTheme = (t) => {
    root.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
  };

  setTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const cur = root.getAttribute('data-theme') || 'dark';
      setTheme(cur === 'dark' ? 'light' : 'dark');
    });
  }

  // Mobile nav
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Lottie mount (safe)
  const mountLotties = () => {
    if (!window.lottie) return;
    document.querySelectorAll('[data-lottie]').forEach((el) => {
      const path = el.getAttribute('data-lottie');
      if (!path) return;
      if (el.__lottieInited) return;
      el.__lottieInited = true;
      window.lottie.loadAnimation({
        container: el,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountLotties);
  } else {
    mountLotties();
  }
})();