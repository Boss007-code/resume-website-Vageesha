// ==========================================================================
// VAGEESHA PORTFOLIO - VANILLA JAVASCRIPT & LIVING OCEAN AMBIENCE
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Immersive Loader Sequence
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 600);
    });
    // Fallback if load is delayed or already fired
    setTimeout(() => {
      if (!loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
      }
    }, 2200);
  }

  // 2. Dynamic Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 3. Mobile Navigation Menu Toggle
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 4. Scroll Progress Indicator & Active Section Tracking
  const scrollProgress = document.getElementById('scroll-progress');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('header.hero-section, section.section');

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (scrollProgress && height > 0) {
      scrollProgress.style.width = `${(winScroll / height) * 100}%`;
    }

    let activeId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 160;
      if (winScroll >= top) activeId = sec.getAttribute('id');
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${activeId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // 5. Copy Email Interaction with Visual Feedback
  const copyBtn = document.getElementById('copy-email-btn');
  const copyFeedback = document.getElementById('copy-feedback');
  if (copyBtn && copyFeedback) {
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.getAttribute('data-email');
      try {
        await navigator.clipboard.writeText(email);
        copyFeedback.textContent = '✓ Copied ' + email + ' to clipboard!';
        setTimeout(() => { copyFeedback.textContent = ''; }, 3500);
      } catch (err) {
        copyFeedback.textContent = 'Email: ' + email;
      }
    });
  }

  // 6. Interactive Ocean Canvas (Bioluminescent Particles & Light Rays)
  const canvas = document.getElementById('ocean-canvas');
  if (!canvas) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let mouse = { x: null, y: null };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  const particleCount = window.innerWidth < 700 ? 30 : 65;
  const particles = [];

  class BioluminescentParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 15;
      this.radius = Math.random() * 2.2 + 0.8;
      this.baseAlpha = Math.random() * 0.45 + 0.2;
      this.speedY = Math.random() * 0.38 + 0.12;
      this.waveOffset = Math.random() * Math.PI * 2;
      this.waveSpeed = Math.random() * 0.015 + 0.006;
      this.isWarm = Math.random() < 0.14; // Occasional coral bioluminescence
    }

    update() {
      this.y -= this.speedY;
      this.waveOffset += this.waveSpeed;
      this.x += Math.sin(this.waveOffset) * 0.45;

      // Subtle mouse repulsion / interaction on desktop
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          this.x += (dx / dist) * 1.5;
          this.y += (dy / dist) * 1.5;
        }
      }

      if (this.y < -15 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      if (this.isWarm) {
        ctx.fillStyle = `rgba(255, 128, 102, ${this.baseAlpha})`;
        ctx.shadowColor = 'rgba(255, 128, 102, 0.7)';
      } else {
        ctx.fillStyle = `rgba(72, 214, 197, ${this.baseAlpha})`;
        ctx.shadowColor = 'rgba(72, 214, 197, 0.8)';
      }
      ctx.shadowBlur = 10;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new BioluminescentParticle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Dynamic underwater light shaft
    const centerX = mouse.x ? width * 0.5 + (mouse.x - width * 0.5) * 0.1 : width * 0.5;
    const centerY = mouse.y ? height * 0.35 + (mouse.y - height * 0.35) * 0.1 : height * 0.35;

    const ambientLight = ctx.createRadialGradient(
      centerX, centerY, 40,
      centerX, centerY, Math.max(width, height) * 0.85
    );
    ambientLight.addColorStop(0, 'rgba(13, 59, 73, 0.22)');
    ambientLight.addColorStop(0.5, 'rgba(18, 60, 71, 0.1)');
    ambientLight.addColorStop(1, 'rgba(7, 27, 43, 0)');

    ctx.fillStyle = ambientLight;
    ctx.fillRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(render);
  }

  render();
});