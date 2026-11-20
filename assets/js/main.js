/* ============================================================
   Portfolio V2 — behaviour (no dependencies)
   ============================================================ */
(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  const themeToggle = $('[data-theme-toggle]');
  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
    try { localStorage.setItem('theme', theme); } catch (e) { /* ignore */ }
  };
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---------- Mobile menu ---------- */
  const menuToggle = $('[data-menu-toggle]');
  const nav = $('#primary-nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open menu');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open menu');
        menuToggle.focus();
      }
    });
  }

  /* ---------- Command palette ---------- */
  const palette = $('[data-palette]');
  const paletteOpen = $('[data-palette-open]');
  const paletteInput = palette ? palette.querySelector('[data-palette-input]') : null;
  const paletteList = palette ? palette.querySelector('[data-palette-list]') : null;
  let paletteActive = 0;

  const openPalette = () => {
    if (!palette) return;
    palette.classList.add('is-open');
    palette.setAttribute('aria-hidden', 'false');
    if (paletteInput) { paletteInput.value = ''; paletteInput.focus(); }
    renderPalette('');
  };
  const closePalette = () => {
    if (!palette) return;
    palette.classList.remove('is-open');
    palette.setAttribute('aria-hidden', 'true');
  };
  if (paletteOpen) paletteOpen.addEventListener('click', openPalette);
  if (palette) {
    palette.addEventListener('click', (e) => {
      if (e.target === palette || e.target.hasAttribute('data-palette-backdrop')) closePalette();
    });
  }
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      palette && palette.classList.contains('is-open') ? closePalette() : openPalette();
    }
    if (e.key === 'Escape' && palette && palette.classList.contains('is-open')) closePalette();
  });

  const paletteItems = [
    { label: 'Home', hint: 'Top of page', href: '#top' },
    { label: 'Selected work', hint: 'Projects', href: '#work' },
    { label: 'About', hint: 'Bio & principles', href: '#about' },
    { label: 'Skills', hint: 'Capabilities', href: '#skills' },
    { label: 'Experience', hint: 'Timeline', href: '#experience' },
    { label: 'Writing', hint: 'Notes', href: '#writing' },
    { label: 'Contact', hint: 'Say hello', href: '#contact' },
    { label: 'Résumé', hint: 'Printable CV', href: 'resume.html' },
    { label: 'Toggle theme', hint: 'Light / dark', action: () => { root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'; try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {} } },
    { label: 'Copy email', hint: 'Clipboard', action: () => copyText('itumelengmosesane22@gmail.com') },
  ];

  function renderPalette(q) {
    if (!paletteList) return;
    const query = q.trim().toLowerCase();
    const filtered = paletteItems.filter((it) => it.label.toLowerCase().includes(query) || (it.hint && it.hint.toLowerCase().includes(query)));
    paletteList.innerHTML = '';
    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'palette-empty';
      empty.textContent = 'No matches';
      paletteList.appendChild(empty);
      return;
    }
    filtered.forEach((it, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'palette-item' + (i === 0 ? ' is-active' : '');
      btn.setAttribute('role', 'option');
      btn.innerHTML = `<span>${escapeHtml(it.label)}</span><span style="margin-left:auto;font-size:0.78rem;color:var(--text-faint)">${escapeHtml(it.hint || '')}</span>`;
      btn.addEventListener('click', () => { runPaletteItem(it); closePalette(); });
      paletteList.appendChild(btn);
    });
    paletteActive = 0;
  }
  if (paletteInput) {
    paletteInput.addEventListener('input', (e) => renderPalette(e.target.value));
    paletteInput.addEventListener('keydown', (e) => {
      const items = paletteList ? paletteList.querySelectorAll('.palette-item') : [];
      if (e.key === 'ArrowDown') { e.preventDefault(); paletteActive = Math.min(paletteActive + 1, items.length - 1); updatePaletteActive(items); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); paletteActive = Math.max(paletteActive - 1, 0); updatePaletteActive(items); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        const active = items[paletteActive];
        if (active) active.click();
      }
    });
  }
  function updatePaletteActive(items) {
    items.forEach((it, i) => it.classList.toggle('is-active', i === paletteActive));
    if (items[paletteActive]) items[paletteActive].scrollIntoView({ block: 'nearest' });
  }
  function runPaletteItem(it) {
    if (it.action) it.action();
    else if (it.href) {
      if (it.href.startsWith('#')) {
        const target = document.querySelector(it.href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = it.href;
      }
    }
  }

  /* ---------- Copy to clipboard ---------- */
  const toast = $('[data-toast]');
  let toastTimer = null;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
  }
  function copyText(text) {
    const done = () => showToast('Copied to clipboard');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(fallback);
    } else fallback();
    function fallback() {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { showToast('Could not copy'); }
      document.body.removeChild(ta);
    }
  }
  $$('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-copy-label') || text;
      copyText(text);
      showToast('Copied ' + label);
    });
  });

  /* ---------- Work filter ---------- */
  const filterButtons = $$('[data-filter]');
  const workCards = $$('[data-category]');
  const filterStatus = $('[data-filter-status]');
  const validFilters = ['all', 'data', 'office', 'frontend'];
  function applyFilter(filter, push = true) {
    const f = validFilters.includes(filter) ? filter : 'all';
    filterButtons.forEach((b) => {
      const active = b.getAttribute('data-filter') === f;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    let shown = 0;
    workCards.forEach((card) => {
      const cat = card.getAttribute('data-category');
      const show = f === 'all' || cat === f;
      card.classList.toggle('is-hidden', !show);
      if (show) shown++;
    });
    if (filterStatus) filterStatus.textContent = `Showing ${shown} of ${workCards.length} projects`;
    if (push) {
      const url = new URL(window.location);
      if (f === 'all') url.searchParams.delete('filter'); else url.searchParams.set('filter', f);
      history.replaceState(null, '', url);
    }
  }
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => applyFilter(btn.getAttribute('data-filter')));
  });
  const initialFilter = new URLSearchParams(window.location.search).get('filter');
  applyFilter(initialFilter || 'all', false);

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Count-up stats ---------- */
  const statValues = $$('[data-count]');
  function countUp(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = target * eased;
      const display = Number.isInteger(target) ? Math.round(val) : val.toFixed(1);
      el.textContent = prefix + display + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window) {
    const sio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          sio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statValues.forEach((el) => sio.observe(el));
  } else {
    statValues.forEach(countUp);
  }

  /* ---------- Scrollspy + reading progress ---------- */
  const navLinks = $$('.nav-list a[href^="#"]');
  const sections = navLinks.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const progressBar = $('[data-scroll-progress]');
  function onScroll() {
    const y = window.scrollY + 120;
    let current = sections[0];
    sections.forEach((sec) => { if (sec && sec.offsetTop <= y) current = sec; });
    navLinks.forEach((a) => {
      a.classList.toggle('is-active', current && a.getAttribute('href') === '#' + current.id);
    });
    if (progressBar) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
      progressBar.style.width = pct + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Contact form ---------- */
  const form = $('[data-contact-form]');
  if (form) {
    const statusEl = $('[data-form-status]');
    const submitBtn = form.querySelector('.form-submit');
    const submitLabel = form.querySelector('[data-submit-label]');
    const fields = {
      name: { el: $('#name'), err: $('[data-error-for="name"]'), validate: (v) => v.trim().length >= 2 ? '' : 'Please enter your name (at least 2 characters).' },
      email: { el: $('#email'), err: $('[data-error-for="email"]'), validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email address.' },
      topic: { el: $('#topic'), err: $('[data-error-for="topic"]'), validate: (v) => v ? '' : 'Please choose what you need.' },
      message: { el: $('#message'), err: $('[data-error-for="message"]'), validate: (v) => v.trim().length >= 20 ? '' : 'Message must be at least 20 characters.' },
    };

    function validateField(key) {
      const f = fields[key];
      if (!f || !f.el) return true;
      const msg = f.validate(f.el.value);
      if (f.err) f.err.textContent = msg;
      f.el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      return !msg;
    }
    Object.keys(fields).forEach((key) => {
      const f = fields[key];
      if (f.el) {
        f.el.addEventListener('blur', () => validateField(key));
        f.el.addEventListener('input', () => { if (f.el.getAttribute('aria-invalid') === 'true') validateField(key); });
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const honeypot = $('#company-url');
      if (honeypot && honeypot.value) return;
      let ok = true;
      Object.keys(fields).forEach((key) => { if (!validateField(key)) ok = false; });
      if (!ok) {
        const firstInvalid = Object.keys(fields).map((k) => fields[k]).find((f) => f.el && f.el.getAttribute('aria-invalid') === 'true');
        if (firstInvalid) firstInvalid.el.focus();
        if (statusEl) statusEl.textContent = 'Please fix the highlighted fields.';
        return;
      }
      if (submitBtn) { submitBtn.disabled = true; submitBtn.setAttribute('aria-busy', 'true'); }
      if (submitLabel) submitLabel.textContent = 'Sending…';
      const data = new FormData(form);
      const subject = encodeURIComponent(`Portfolio enquiry: ${data.get('topic')}`);
      const body = encodeURIComponent(
        `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nTopic: ${data.get('topic')}\n\n${data.get('message')}`
      );
      window.location.href = `mailto:itumelengmosesane22@gmail.com?subject=${subject}&body=${body}`;
      setTimeout(() => {
        if (statusEl) statusEl.textContent = 'Your email client should have opened. If not, email itumelengmosesane22@gmail.com directly.';
        if (submitBtn) { submitBtn.disabled = false; submitBtn.removeAttribute('aria-busy'); }
        if (submitLabel) submitLabel.textContent = 'Send message';
        form.reset();
      }, 600);
    });
  }

  /* ---------- Helpers ---------- */
  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---------- Print button ---------- */
  $$('[data-print]').forEach((btn) => {
    btn.addEventListener('click', () => window.print());
  });

  /* ---------- Back to top ---------- */
  const backToTop = $('[data-back-to-top]');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }
})();