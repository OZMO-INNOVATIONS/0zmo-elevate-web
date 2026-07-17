/* ═══════════════════════════════════════════════════════════
   OZMO ELEVATE — Premium JS Interactions
   main.js
═══════════════════════════════════════════════════════════ */

/* ── Custom Cursor ── */
function initCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
    requestAnimationFrame(renderRing);
  }
  renderRing();

  // Hover states
  const interactables = document.querySelectorAll('a, button, .magnetic, [data-tilt]');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}

/* ── Magnetic Elements ── */
function initMagnetic() {
  const magnets = document.querySelectorAll('.magnetic');
  if (window.matchMedia('(pointer: coarse)').matches) return;

  magnets.forEach(magnet => {
    magnet.addEventListener('mousemove', (e) => {
      const bound = magnet.getBoundingClientRect();
      const strength = magnet.getAttribute('data-strength') || 20;
      const x = (e.clientX - bound.left - bound.width / 2) / bound.width;
      const y = (e.clientY - bound.top - bound.height / 2) / bound.height;
      magnet.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
    magnet.addEventListener('mouseleave', () => {
      magnet.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* ── 3D Card Tilt ── */
function initTilt() {
  const cards = document.querySelectorAll('[data-tilt]');
  if (window.matchMedia('(pointer: coarse)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const bound = card.getBoundingClientRect();
      const x = (e.clientX - bound.left - bound.width / 2) / bound.width;
      const y = (e.clientY - bound.top - bound.height / 2) / bound.height;
      card.style.transform = `perspective(1000px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ── Scroll Reveals ── */
function initScrollReveals() {
  const elements = document.querySelectorAll('.fade-in-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ── CountUp ── */
function initCountUp() {
  const counters = document.querySelectorAll('.counter');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 2000;
        let start = null;

        function step(timestamp) {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          // easeOutExpo
          const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          el.innerText = Math.floor(ease * target);
          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            el.innerText = target;
          }
        }
        window.requestAnimationFrame(step);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ── Navbar Scroll ── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }, { passive: true });
}

/* ── Mobile Menu ── */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  const links = document.querySelectorAll('.mob-link');

  if (!hamburger || !menu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    if (isOpen) {
      menu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    } else {
      menu.classList.add('open');
      hamburger.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── Custom Select ── */
function initCustomSelect() {
  const wrapper = document.querySelector('.custom-select-wrapper');
  if (!wrapper) return;

  const select = wrapper.querySelector('select');
  const customSelect = wrapper.querySelector('.custom-select');
  const text = wrapper.querySelector('.custom-select-text');
  const options = wrapper.querySelectorAll('.custom-option');

  wrapper.addEventListener('click', (e) => {
    if (e.target.classList.contains('custom-option')) return;
    wrapper.classList.toggle('open');
    customSelect.classList.toggle('open');
  });

  options.forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      const value = option.getAttribute('data-value');
      const label = option.innerText;
      select.value = value;
      text.innerText = label;
      customSelect.classList.add('has-value');
      options.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      wrapper.classList.remove('open');
      customSelect.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) {
      wrapper.classList.remove('open');
      customSelect.classList.remove('open');
    }
  });
}

/* ── Form Handling ── */
function initForm() {
  const form = document.getElementById('applyForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const text = btn.querySelector('.btn-text');
    
    btn.style.pointerEvents = 'none';
    text.innerText = 'Transmitting...';
    
    setTimeout(() => {
      text.innerText = 'Application Received';
      btn.style.borderColor = 'var(--accent-emerald)';
      form.reset();
      
      // Reset custom select
      const customText = form.querySelector('.custom-select-text');
      const customSelect = form.querySelector('.custom-select');
      const customOptions = form.querySelectorAll('.custom-option');
      if(customText && customSelect) {
        customText.innerText = 'Select Academy Program';
        customSelect.classList.remove('has-value');
        customOptions.forEach(opt => opt.classList.remove('selected'));
      }
      
      setTimeout(() => {
        text.innerText = 'Submit Application &rarr;';
        btn.style.borderColor = '';
        btn.style.pointerEvents = 'all';
      }, 3000);
    }, 1500);
  });
}

/* ── Smooth Scroll for Anchor Links ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = document.getElementById('navbar').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initMagnetic();
  initTilt();
  initScrollReveals();
  initCountUp();
  initNavbar();
  initMobileMenu();
  initCustomSelect();
  initForm();
  initSmoothScroll();
});
