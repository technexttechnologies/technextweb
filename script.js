/**
 * TECHNEXT TECHNOLOGIES — script.js  v3.0
 * Premium Corporate Website — Production JavaScript
 * Features: FormSubmit, Touch Ripples, Desktop Cursor,
 *           Hero Canvas, Scroll Reveal, Counters, Nav Indicator
 */
'use strict';

/* ════════════════════════════════════════════
   PAGE LOADER
════════════════════════════════════════════ */
(function initLoader() {
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = `
    <div class="loader-logo">
      <img class="loader-logo-img"
        src="https://res.cloudinary.com/dwzerbhuj/image/upload/q_auto/f_auto/v1776917252/Untitled-2_gx7mta.png"
        alt="TECHNEXT TECHNOLOGIES" />
    </div>
    <div class="loader-track"><div class="loader-bar" id="loaderBar"></div></div>
  `;
  document.body.prepend(loader);
  document.body.classList.add('loading');

  let pct = 0;
  const bar = loader.querySelector('#loaderBar');

  const tick = setInterval(() => {
    pct += Math.random() * 22 + 10;
    if (pct > 92) pct = 92;
    if (bar) bar.style.width = pct + '%';
  }, 130);

  const finish = () => {
    clearInterval(tick);
    if (bar) bar.style.width = '100%';
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
      setTimeout(() => loader.remove(), 700);
    }, 280);
  };

  if (document.readyState === 'complete') {
    finish();
  } else {
    window.addEventListener('load', finish, { once: true });
    // Safety fallback
    setTimeout(finish, 3500);
  }
})();

/* ════════════════════════════════════════════
   DOMContentLoaded init
════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ────────────────────────────────────────
     SMOOTH SCROLL — anchor links
  ──────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('mainNav')?.offsetHeight || 72;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    });
  });

  /* ────────────────────────────────────────
     NAVIGATION — scroll state + active indicator
  ──────────────────────────────────────── */
  const nav       = document.getElementById('mainNav');
  const navLinks  = document.querySelectorAll('.nav-link[data-nav]');
  const sections  = document.querySelectorAll('section[id]');
  const indicator = document.getElementById('navIndicator');

  // Move the active-section indicator pill under the matching link
  const moveIndicator = (linkEl) => {
    if (!indicator || !linkEl) return;
    const navRect  = nav.getBoundingClientRect();
    const linkRect = linkEl.getBoundingClientRect();
    indicator.style.left  = (linkRect.left - navRect.left) + 'px';
    indicator.style.width = linkRect.width + 'px';
  };

  const onScroll = () => {
    const y = window.scrollY;

    // Glassmorphism state
    if (y > 50) nav?.classList.add('scrolled');
    else        nav?.classList.remove('scrolled');

    // Active section detection
    let current = '';
    sections.forEach(s => {
      if (y >= s.offsetTop - 110) current = s.id;
    });

    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', isActive);
      if (isActive) moveIndicator(link);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ────────────────────────────────────────
     MOBILE MENU
  ──────────────────────────────────────── */
  const toggle  = document.getElementById('navToggle');
  const overlay = document.getElementById('mobileOverlay');

  const openMenu = () => {
    toggle?.classList.add('open');
    toggle?.setAttribute('aria-expanded', 'true');
    overlay?.classList.add('open');
    overlay?.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    toggle?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    overlay?.classList.remove('open');
    overlay?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  toggle?.addEventListener('click', () =>
    toggle.classList.contains('open') ? closeMenu() : openMenu()
  );
  document.querySelectorAll('[data-mobile-nav]').forEach(l => l.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ────────────────────────────────────────
     HERO CANVAS — particle network
  ──────────────────────────────────────── */
  const canvas = document.getElementById('heroCanvas');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext('2d');
    const COUNT = window.innerWidth < 768 ? 28 : 52;
    let particles = [], animId;

    const resize = () => {
      canvas.width  = canvas.offsetWidth  || canvas.parentElement.offsetWidth;
      canvas.height = canvas.offsetHeight || canvas.parentElement.offsetHeight;
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas.parentElement);

    class P {
      constructor(init) {
        this.reset(init ?? false);
      }
      reset(initial) {
        this.x  = Math.random() * canvas.width;
        this.y  = initial ? Math.random() * canvas.height : canvas.height + 4;
        this.r  = Math.random() * 1.2 + .35;
        this.vx = (Math.random() - .5) * .25;
        this.vy = -(Math.random() * .25 + .08);
        this.t  = Math.random() * Math.PI * 2;
        this.a  = 0;
      }
      step() {
        this.x += this.vx; this.y += this.vy;
        this.t += .014; this.a = Math.sin(this.t) * .14 + .1;
        if (this.y < -6) this.reset(false);
      }
      draw() {
        ctx.globalAlpha = this.a;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF'; ctx.fill();
      }
    }

    for (let i = 0; i < COUNT; i++) particles.push(new P(true));

    const MAX_DIST = 90;
    const drawLinks = () => {
      for (let i = 0; i < particles.length - 1; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.hypot(dx, dy);
          if (d < MAX_DIST) {
            ctx.globalAlpha = (1 - d / MAX_DIST) * .04;
            ctx.strokeStyle = '#93C5FD'; ctx.lineWidth = .5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawLinks();
      particles.forEach(p => { p.step(); p.draw(); });
      animId = requestAnimationFrame(loop);
    };
    loop();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(animId);
      else loop();
    });
  }

  /* ────────────────────────────────────────
     SCROLL REVEAL — IntersectionObserver
  ──────────────────────────────────────── */
  const revEls = document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
      });
    }, { threshold: .1, rootMargin: '0px 0px -50px 0px' });
    revEls.forEach(el => io.observe(el));
  } else {
    revEls.forEach(el => el.classList.add('revealed'));
  }

  /* ────────────────────────────────────────
     ANIMATED COUNTERS
  ──────────────────────────────────────── */
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  const animCount = (el, target, dur = 1800) => {
    const start = performance.now();
    const tick  = now => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(easeOutCubic(p) * target);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animCount(e.target, parseInt(e.target.dataset.count, 10));
          cio.unobserve(e.target);
        }
      });
    }, { threshold: .6 });
    document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));
  }

  /* ────────────────────────────────────────
     DETECT touch vs pointer device
  ──────────────────────────────────────── */
  const isTouchDevice =
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    window.matchMedia('(hover: none)').matches;

  /* ────────────────────────────────────────
     DESKTOP CURSOR — dot + trailing ring
  ──────────────────────────────────────── */
  if (!isTouchDevice) {
    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (dot && ring) {
      let mx = -120, my = -120, rx = -120, ry = -120;

      document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
      document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0'; ring.style.opacity = '0';
      });
      document.addEventListener('mouseenter', () => {
        dot.style.opacity = '1'; ring.style.opacity = '1';
      });

      const interactables = 'a,button,[role="button"],input,textarea,.service-card,.why-pillar,.why-cta';
      document.querySelectorAll(interactables).forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
      });

      const RAF = () => {
        if (dot)  dot.style.transform  = `translate(${mx - 2.5}px,${my - 2.5}px)`;
        rx += (mx - rx) * .11;
        ry += (my - ry) * .11;
        if (ring) ring.style.transform = `translate(${rx - 17}px,${ry - 17}px)`;
        requestAnimationFrame(RAF);
      };
      RAF();
    }
  } else {
    // Remove cursor elements on touch
    document.getElementById('cursorDot')?.remove();
    document.getElementById('cursorRing')?.remove();
  }

  /* ────────────────────────────────────────
     MOBILE TOUCH RIPPLE
  ──────────────────────────────────────── */
  if (isTouchDevice) {
    const spawnRipple = (x, y, size = 100) => {
      const el = document.createElement('div');
      el.className = 'touch-ripple';
      el.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px`;
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove(), { once: true });
    };

    // Ripple on tap start
    document.addEventListener('touchstart', e => {
      const t = e.touches[0];
      spawnRipple(t.clientX, t.clientY, 80);
    }, { passive: true });

    // Larger ripple on buttons / links
    document.querySelectorAll('.touch-target,.btn-primary,.btn-outline,.btn-ghost,.mobile-cta,.nav-cta').forEach(el => {
      el.addEventListener('touchstart', e => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top  + r.height / 2;
        spawnRipple(cx, cy, Math.max(r.width, r.height) * 1.6);
      }, { passive: true });
    });
  }

  /* ────────────────────────────────────────
     CONTACT FORM — FormSubmit + validation
  ──────────────────────────────────────── */
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('formSubmit');
  const successEl  = document.getElementById('formSuccess');
  const errorEl    = document.getElementById('formError');

  const fName    = document.getElementById('formName');
  const fEmail   = document.getElementById('formEmail');
  const fMessage = document.getElementById('formMessage');
  const errName  = document.getElementById('nameError');
  const errEmail = document.getElementById('emailError');
  const errMsg   = document.getElementById('messageError');

  if (form && submitBtn) {

    const validEmail = s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

    const clearFieldError = (input, errEl) => {
      input?.classList.remove('error');
      if (errEl) errEl.textContent = '';
    };

    const setFieldError = (input, errEl, msg) => {
      input?.classList.add('error');
      if (errEl) errEl.textContent = msg;
    };

    const clearAll = () => {
      [fName, fEmail, fMessage].forEach((f, i) =>
        clearFieldError(f, [errName, errEmail, errMsg][i])
      );
    };

    const validate = () => {
      let ok = true; clearAll();
      if (!fName?.value.trim())                              { setFieldError(fName,    errName,  'Please enter your full name.');         ok = false; }
      if (!fEmail?.value.trim() || !validEmail(fEmail.value)){ setFieldError(fEmail,   errEmail, 'Please enter a valid email address.');  ok = false; }
      if (!fMessage?.value.trim())                           { setFieldError(fMessage, errMsg,   'Please write your message.');           ok = false; }
      return ok;
    };

    // Real-time blur validation
    fName?.addEventListener('blur',    () => { if (fName.value.trim())          clearFieldError(fName, errName);    });
    fEmail?.addEventListener('blur',   () => { if (validEmail(fEmail.value))    clearFieldError(fEmail, errEmail);  });
    fMessage?.addEventListener('blur', () => { if (fMessage.value.trim())       clearFieldError(fMessage, errMsg);  });

    // Track submission state (prevent double-submit)
    let isSubmitting = false;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (isSubmitting) return;
      if (!validate()) { fName.focus(); return; }

      // Loading state
      isSubmitting = true;
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      if (successEl) successEl.hidden = true;
      if (errorEl)   errorEl.hidden   = true;

      try {
        const data     = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body:   data,
          headers: { Accept: 'application/json' }
        });

        if (response.ok) {
          // Success
          form.reset(); clearAll();
          if (successEl) {
            successEl.hidden = false;
            successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            setTimeout(() => { successEl.hidden = true; }, 8000);
          }
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (err) {
        console.error('Form submission error:', err);
        if (errorEl) {
          errorEl.hidden = false;
          errorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } finally {
        isSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
      }
    });
  }

  /* ────────────────────────────────────────
     FOOTER BACK-TO-TOP
  ──────────────────────────────────────── */
  document.querySelector('.footer-totop')?.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ────────────────────────────────────────
     SECTION DIVIDER — staggered line entrance
  ──────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    const dividerIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const line = e.target.querySelector('.divider-line');
          if (line) { line.style.transform = 'scaleX(1)'; line.style.opacity = '1'; }
          dividerIO.unobserve(e.target);
        }
      });
    }, { threshold: .5 });
    document.querySelectorAll('.section-divider').forEach(el => {
      const line = el.querySelector('.divider-line');
      if (line) { line.style.transform = 'scaleX(.3)'; line.style.opacity = '0'; line.style.transition = 'transform .8s var(--ease-out), opacity .8s ease'; }
      dividerIO.observe(el);
    });
  }

}); // end DOMContentLoaded
