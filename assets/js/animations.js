/* ═══════════════════════════════════════════════════════════
   OZMO ELEVATE — animations.js
   Particle canvas, IntersectionObserver, CountUp, Parallax
═══════════════════════════════════════════════════════════ */

/* ══════════════════════════════
   PARTICLE CANVAS
══════════════════════════════ */
function initParticleCanvas() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const particles = [];
  const PARTICLE_COUNT = 80;

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.8 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      const colors = [
        "rgba(124,58,237,",
        "rgba(6,182,212,",
        "rgba(236,72,153,",
        "rgba(167,139,250,",
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (
        this.x < 0 ||
        this.x > canvas.width ||
        this.y < 0 ||
        this.y > canvas.height
      ) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(124,58,237,${0.08 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ══════════════════════════════
   SCROLL ANIMATIONS (IntersectionObserver)
══════════════════════════════ */
function initScrollAnimations() {
  const targets = document.querySelectorAll(
    ".fade-in-up, .fade-in, .fade-left, .fade-right, .scale-in, .reveal-up"
  );
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.01,
      rootMargin: "100px 0px 100px 0px",
    }
  );

  targets.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
      el.classList.add("visible");
    }
    observer.observe(el);
  });
}

/* ══════════════════════════════
   COUNT UP
══════════════════════════════ */
function initCountUp() {
  const counters = document.querySelectorAll(".counter");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const duration = 2000;
          const start = performance.now();

          function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target;
          }
          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.2 }
  );

  counters.forEach((el) => observer.observe(el));
}

/* ══════════════════════════════
   NAVBAR SCROLL
══════════════════════════════ */
function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const handler = () => {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handler, { passive: true });
  handler();
}

/* ══════════════════════════════
   SCROLL PROGRESS BAR
══════════════════════════════ */
function initScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;
  window.addEventListener(
    "scroll",
    () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        bar.style.width = (window.scrollY / total) * 100 + "%";
      }
    },
    { passive: true }
  );
}

/* ══════════════════════════════
   INIT ALL
══════════════════════════════ */
function runAllAnimations() {
  initParticleCanvas();
  initScrollAnimations();
  initCountUp();
  initNavbarScroll();
  initScrollProgress();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runAllAnimations);
} else {
  runAllAnimations();
}
