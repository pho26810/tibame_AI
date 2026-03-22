/* ============================================================
   AI PRO LANDING PAGE — script.js  (v3)
   ============================================================ */

// ── Particle Canvas ──────────────────────────
(function () {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W,
    H,
    particles = [];
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.4 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.45 + 0.1;
      this.hue = Math.random() > 0.55 ? "0,212,255" : "91,91,214";
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
  }

  const COUNT = Math.min(110, Math.floor((W * H) / 13000));
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  document.addEventListener(
    "mousemove",
    (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    },
    { passive: true },
  );

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => p.update());

    // Lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.hypot(dx, dy);
        if (d < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,212,255,${(1 - d / 130) * 0.13})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
      // Mouse highlight
      const md = Math.hypot(particles[i].x - mouse.x, particles[i].y - mouse.y);
      if (md < 90) {
        ctx.beginPath();
        ctx.arc(
          particles[i].x,
          particles[i].y,
          particles[i].r * 2.8,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = `rgba(0,212,255,${(1 - md / 90) * 0.65})`;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(particles[i].x, particles[i].y, particles[i].r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${particles[i].hue},${particles[i].alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── Nav scroll class ─────────────────────────
(function () {
  const nav = document.getElementById("nav");
  if (!nav) return;
  window.addEventListener(
    "scroll",
    () => {
      nav.classList.toggle("nav--scrolled", window.scrollY > 20);
    },
    { passive: true },
  );
})();

// ── Scroll Reveal ────────────────────────────
(function () {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -36px 0px" },
  );
  document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
})();

// ── Scroll Top button ────────────────────────
(function () {
  const btn = document.getElementById("scrollTop");
  const banner = document.getElementById("banner");
  if (!btn) return;
  const obs = new IntersectionObserver(
    ([e]) => {
      btn.classList.toggle("is-visible", !e.isIntersecting);
    },
    { threshold: 0.05 },
  );
  if (banner) obs.observe(banner);
  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
})();
