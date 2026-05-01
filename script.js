/* ============================================
   Preloader
============================================ */
(() => {
  const pre = document.getElementById('preloader');
  const count = document.getElementById('preloaderCount');
  const bar = document.getElementById('preloaderBar');
  if (!pre) return;

  document.body.style.overflow = 'hidden';
  let v = 0;
  const tick = () => {
    v += Math.random() * 8 + 2;
    if (v >= 100) v = 100;
    count.textContent = Math.floor(v);
    bar.style.width = v + '%';
    if (v < 100) {
      setTimeout(tick, 60);
    } else {
      setTimeout(() => {
        pre.classList.add('is-done');
        document.body.style.overflow = '';
      }, 350);
    }
  };
  window.addEventListener('load', () => setTimeout(tick, 120));
})();

/* ============================================
   Clock (Swiss time)
============================================ */
(() => {
  const el = document.getElementById('clock');
  if (!el) return;
  const update = () => {
    const now = new Date();
    const time = now.toLocaleTimeString('de-CH', {
      hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Zurich'
    });
    el.textContent = `CH ${time}`;
  };
  update();
  setInterval(update, 1000 * 30);
})();

/* ============================================
   Scroll Progress
============================================ */
(() => {
  const bar = document.getElementById('progress');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.width = pct + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ============================================
   Count-up numbers
============================================ */
(() => {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.dataset.count;
      const suffix = raw.replace(/[0-9]/g, '');
      const target = parseInt(raw, 10);
      const dur = 1600;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.4 });
  nums.forEach(n => io.observe(n));
})();

/* ============================================
   Magnetic hover
============================================ */
(() => {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    const inner = el.querySelector('.hero__cta-inner, .contact__mail-inner') || el;
    const strength = 0.25;
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      inner.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('mouseleave', () => {
      inner.style.transform = '';
    });
  });
})();


/* ============================================
   Services Mega — Dim / Highlight on Hover
============================================ */
(() => {
  const mega = document.getElementById('servicesMega');
  if (!mega || window.matchMedia('(hover: none)').matches) return;

  const items = mega.querySelectorAll('.services__mega-item');

  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      mega.classList.add('is-hovering');
      item.classList.add('is-active');
    });
    item.addEventListener('mouseleave', () => {
      item.classList.remove('is-active');
    });
  });

  mega.addEventListener('mouseleave', () => {
    mega.classList.remove('is-hovering');
  });
})();

/* ============================================
   Related Projects Slideshow (Project Pages)
============================================ */
(() => {
  const section = document.getElementById('proj-related');
  if (!section || !window.PROJECTS) return;

  const track = section.querySelector('.proj-related__track');
  if (!track) return;

  const currentId = document.body.dataset.projectId;
  const others = window.PROJECTS.filter(p => p.id !== currentId);

  others.forEach(p => {
    let media;
    if (p.thumbType === 'video') {
      media = `<video src="${p.thumb}" muted autoplay loop playsinline></video>`;
    } else if (p.thumbType === 'img') {
      media = `<img src="${p.thumb}" alt="${p.title}" loading="lazy">`;
    } else {
      media = `<div style="width:100%;height:100%;background:${p.gradient || '#1a1a1a'}"></div>`;
    }
    const card = document.createElement('a');
    card.href = p.href;
    card.className = 'proj-related__card';
    card.innerHTML = `
      <div class="proj-related__thumb">${media}</div>
      <div class="proj-related__meta">${p.year} — ${p.cat}</div>
      <div class="proj-related__name">${p.title}</div>`;
    track.appendChild(card);
  });

  const btnPrev = section.querySelector('.proj-related__btn--prev');
  const btnNext = section.querySelector('.proj-related__btn--next');
  const CARD_W = 300 + 24;
  let idx = 0;

  function visible() {
    return Math.max(1, Math.floor(track.parentElement.offsetWidth / CARD_W));
  }
  function maxIdx() {
    return Math.max(0, others.length - visible());
  }
  function update() {
    track.style.transform = `translateX(-${idx * CARD_W}px)`;
    if (btnPrev) btnPrev.disabled = idx === 0;
    if (btnNext) btnNext.disabled = idx >= maxIdx();
  }

  if (btnPrev) btnPrev.addEventListener('click', () => { if (idx > 0) { idx--; update(); } });
  if (btnNext) btnNext.addEventListener('click', () => { if (idx < maxIdx()) { idx++; update(); } });

  update();
  window.addEventListener('resize', update);
})();

/* ============================================
   Theme Toggle
============================================ */
(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const stored = localStorage.getItem('theme');
  if (stored) root.setAttribute('data-theme', stored);

  toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();

/* ============================================
   Custom Cursor
============================================ */
(() => {
  const cursor = document.getElementById('cursor');
  if (!cursor || window.matchMedia('(hover: none)').matches) return;

  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const render = () => {
    curX += (mouseX - curX) * 0.18;
    curY += (mouseY - curY) * 0.18;
    cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
    requestAnimationFrame(render);
  };
  render();

  // Hover state on projects
  document.querySelectorAll('[data-cursor="hover"]').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });

  document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
  document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
})();

/* ============================================
   Intersection Observer - Scroll Reveal
============================================ */
(() => {
  const targets = document.querySelectorAll(
    '.section-head, .project, .about__lead, .about__text, .about__facts, .contact__sub, .contact__mail, .about__title'
  );
  targets.forEach(el => el.classList.add('io-fade'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => io.observe(el));
})();

/* ============================================
   Header - subtle shadow on scroll
============================================ */
(() => {
  const header = document.getElementById('header');
  let last = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 10 && last <= 10) header.style.borderBottomColor = 'var(--line-strong)';
    if (y <= 10 && last > 10) header.style.borderBottomColor = '';
    last = y;
  }, { passive: true });
})();

/* ============================================
   Mobile Menu
============================================ */
(() => {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mobileNav');
  const label = toggle?.querySelector('.menu-toggle__text');
  if (!toggle || !nav) return;

  const open = () => {
    nav.classList.add('is-open');
    nav.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    if (label) label.textContent = 'Close';
    document.body.classList.add('menu-open');
  };

  const close = () => {
    nav.classList.remove('is-open');
    nav.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    if (label) label.textContent = 'Menu';
    document.body.classList.remove('menu-open');
  };

  toggle.addEventListener('click', () => {
    nav.classList.contains('is-open') ? close() : open();
  });

  nav.querySelectorAll('.mobile-nav__item').forEach(link => {
    link.addEventListener('click', close);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) close();
  });
})();
