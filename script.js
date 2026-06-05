/**
 * TECHNEXT TECHNOLOGIES – script.js
 * Premium Corporate Website – Production Ready JavaScript
 */

'use strict';

/* ─────────────────────────────────────────────────────
   PAGE LOADER
───────────────────────────────────────────────────── */
(function initLoader() {
  // Inject loader HTML
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = `
    <div class="loader-logo">TECHNEXT</div>
    <div class="loader-bar-track">
      <div class="loader-bar" id="loaderBar"></div>
    </div>
  `;
  document.body.prepend(loader);
  document.body.classList.add('loading');

  let progress = 0;
  const bar = document.getElementById('loaderBar');

  const advance = () => {
    progress += Math.random() * 25 + 15;
    if (progress > 95) progress = 95;
    if (bar) bar.style.width = progress + '%';
  };

  const ticker = setInterval(advance, 120);

  window.addEventListener('load', () => {
    clearInterval(ticker);
    if (bar) bar.style.width = '100%';

    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
      setTimeout(() => {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 700);
    }, 300);
  });
})();

/* ─────────────────────────────────────────────────────
   SMOOTH SCROLL (anchor links)
───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  // Custom smooth scroll for hash links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const navHeight = document.getElementById('mainNav')?.offsetHeight || 80;
      const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  /* ─────────────────────────────────────────────────
     NAVIGATION – Scroll state & active link
  ───────────────────────────────────────────────── */
  const nav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link[data-nav]');
  const sections = document.querySelectorAll('section[id]');

  const updateNav = () => {
    const scrollY = window.scrollY;

    // Scrolled state
    if (scrollY > 50) {
      nav?.classList.add('scrolled');
    } else {
      nav?.classList.remove('scrolled');
    }

    // Active nav link
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (scrollY >= sectionTop) {
        currentSection = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ─────────────────────────────────────────────────
     MOBILE MENU
  ───────────────────────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileNavLinks = document.querySelectorAll('[data-mobile-nav]');

  const openMobileMenu = () => {
    navToggle?.classList.add('open');
    navToggle?.setAttribute('aria-expanded', 'true');
    mobileOverlay?.classList.add('open');
    mobileOverlay?.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    navToggle?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    mobileOverlay?.classList.remove('open');
    mobileOverlay?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  navToggle?.addEventListener('click', () => {
    const isOpen = navToggle.classList.contains('open');
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  /* ─────────────────────────────────────────────────
     HERO CANVAS – Floating particle field
  ───────────────────────────────────────────────── */
  const canvas = document.getElementById('heroCanvas');
  if (canvas && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    const ctx = canvas.getContext('2d');
    let animId;
    const particles = [];
    const MAX_PARTICLES = 55;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    class Particle {
      constructor() { this.reset(true); }

      reset(initial = false) {
        this.x   = Math.random() * canvas.width;
        this.y   = initial ? Math.random() * canvas.height : canvas.height + 10;
        this.r   = Math.random() * 1.5 + 0.4;
        this.vx  = (Math.random() - 0.5) * 0.3;
        this.vy  = -(Math.random() * 0.3 + 0.1);
        this.alpha = Math.random() * 0.35 + 0.08;
        this.pulse = Math.random() * Math.PI * 2;
      }

      update() {
        this.x     += this.vx;
        this.y     += this.vy;
        this.pulse += 0.015;
        this.alpha  = (Math.sin(this.pulse) * 0.15 + 0.15);
        if (this.y < -10) this.reset();
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < MAX_PARTICLES; i++) {
      particles.push(new Particle());
    }

    const drawConnections = () => {
      const maxDist = 100;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.save();
            ctx.globalAlpha = (1 - dist / maxDist) * 0.05;
            ctx.strokeStyle = '#93C5FD';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawConnections();
      particles.forEach(p => { p.update(); p.draw(); });
      animId = requestAnimationFrame(loop);
    };

    loop();

    // Pause when not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        loop();
      }
    });
  }

  /* ─────────────────────────────────────────────────
     SCROLL REVEAL – IntersectionObserver
  ───────────────────────────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  /* ─────────────────────────────────────────────────
     ANIMATED COUNTERS
  ───────────────────────────────────────────────── */
  const counterEls = document.querySelectorAll('[data-count]');

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el, target, duration = 1800) => {
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOutCubic(progress) * target);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          animateCounter(el, target);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => counterObserver.observe(el));
  }

  /* ─────────────────────────────────────────────────
     CUSTOM CURSOR
  ───────────────────────────────────────────────── */
  const isTouchDevice = () =>
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    window.matchMedia('(hover: none)').matches;

  if (!isTouchDevice()) {
    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');

    let mx = -100, my = -100;
    let rx = -100, ry = -100;
    let rafId;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
    });

    // Hover effect on interactive elements
    const interactiveEls = document.querySelectorAll(
      'a, button, [role="button"], .service-card, .why-pillar, input, textarea'
    );

    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', () => ring?.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring?.classList.remove('hover'));
    });

    const updateCursor = () => {
      // Dot follows instantly
      if (dot) {
        dot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
      }

      // Ring follows with lerp
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;

      if (ring) {
        ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
      }

      rafId = requestAnimationFrame(updateCursor);
    };

    updateCursor();

    // Hide/show on window leave/enter
    document.addEventListener('mouseleave', () => {
      if (dot)  dot.style.opacity = '0';
      if (ring) ring.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      if (dot)  dot.style.opacity = '1';
      if (ring) ring.style.opacity = '1';
    });
  } else {
    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (dot)  dot.remove();
    if (ring) ring.remove();
  }

  /* ─────────────────────────────────────────────────
     CONTACT FORM – Validation & Submit
  ───────────────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const formName    = document.getElementById('formName');
    const formEmail   = document.getElementById('formEmail');
    const formMessage = document.getElementById('formMessage');
    const nameError   = document.getElementById('nameError');
    const emailError  = document.getElementById('emailError');
    const msgError    = document.getElementById('messageError');
    const submitBtn   = document.getElementById('formSubmit');
    const successMsg  = document.getElementById('formSuccess');

    const clearErrors = () => {
      [formName, formEmail, formMessage].forEach(el => el?.classList.remove('error'));
      [nameError, emailError, msgError].forEach(el => { if (el) el.textContent = ''; });
    };

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validate = () => {
      let valid = true;
      clearErrors();

      if (!formName?.value.trim()) {
        formName?.classList.add('error');
        if (nameError) nameError.textContent = 'Please enter your full name.';
        valid = false;
      }

      if (!formEmail?.value.trim() || !validateEmail(formEmail.value)) {
        formEmail?.classList.add('error');
        if (emailError) emailError.textContent = 'Please enter a valid email address.';
        valid = false;
      }

      if (!formMessage?.value.trim()) {
        formMessage?.classList.add('error');
        if (msgError) msgError.textContent = 'Please write your message.';
        valid = false;
      }

      return valid;
    };

    // Inline validation on blur
    formName?.addEventListener('blur', () => {
      if (formName.value.trim()) {
        formName.classList.remove('error');
        if (nameError) nameError.textContent = '';
      }
    });

    formEmail?.addEventListener('blur', () => {
      if (validateEmail(formEmail.value)) {
        formEmail.classList.remove('error');
        if (emailError) emailError.textContent = '';
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validate()) return;

      // Disable button
      if (submitBtn) {
        submitBtn.disabled = true;
        const textEl = submitBtn.querySelector('.submit-text');
        if (textEl) textEl.textContent = 'Sending…';
      }

      // Simulate async submission (replace with actual endpoint)
      setTimeout(() => {
        contactForm.reset();
        clearErrors();

        if (submitBtn) {
          submitBtn.disabled = false;
          const textEl = submitBtn.querySelector('.submit-text');
          if (textEl) textEl.textContent = 'Send Message';
        }

        if (successMsg) {
          successMsg.hidden = false;
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setTimeout(() => { successMsg.hidden = true; }, 6000);
        }
      }, 1000);
    });
  }

  /* ─────────────────────────────────────────────────
     SERVICE CARD – Micro-interaction stagger
  ───────────────────────────────────────────────── */
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card, i) => {
    card.style.setProperty('--delay', `${i * 0.055}s`);
  });

  /* ─────────────────────────────────────────────────
     FOOTER BACK-TO-TOP smooth override
  ───────────────────────────────────────────────── */
  document.querySelector('.footer-back-top')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ─────────────────────────────────────────────────
     NAV LINK – Add new interactive elements to cursor hover
  ───────────────────────────────────────────────── */
  // Already handled above in cursor setup, this is a no-op safety hook.

}); // end DOMContentLoaded
