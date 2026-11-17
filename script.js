// ==========================================================================
// VAGEESHA PORTFOLIO - VANILLA JAVASCRIPT
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Loading screen transition
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 700);
    });
    // Fallback if load event already fired or delayed
    setTimeout(() => {
      if (!loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
      }
    }, 2200);
  }

  // 2. Dynamic Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 3. Mobile Navigation Menu
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 4. Scroll Progress Indicator & Active Nav Link Highlight
  const scrollProgress = document.getElementById('scroll-progress');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('header.section, section.section');

  window.addEventListener('scroll', () => {
    // Scroll progress bar
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (scrollProgress) {
      scrollProgress.style.width = `${scrolled}%`;
    }

    // Active link highlighting
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      if (winScroll >= sectionTop) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // 5. Copy Email to Clipboard Interaction
  const copyBtn = document.getElementById('copy-email-btn');
  const copyFeedback = document.getElementById('copy-feedback');
  if (copyBtn && copyFeedback) {
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.getAttribute('data-email');
      try {
        await navigator.clipboard.writeText(email);
        copyFeedback.textContent = '✓ Copied ' + email + ' to clipboard!';
        setTimeout(() => {
          copyFeedback.textContent = '';
        }, 3500);
      } catch (err) {
        copyFeedback.textContent = 'Email: ' + email;
      }
    });
  }

  // 6. Bioluminescent Ocean Canvas Particles
  const canvas = document.getElementById('ocean-canvas');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  // Mobile optimization: fewer particles
  const particleCount = window.innerWidth < 700 ? 25 : 55;

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.radius = Math.random() * 2.2 + 0.8;
      this.baseAlpha = Math.random() * 0.45 + 0.25;
      this.alpha = this.baseAlpha;
      this.speedY = Math.random() * 0.35 + 0.15;
      this.waveOffset = Math.random() * Math.PI * 2;
      this.waveSpeed = Math.random() * 0.02 + 0.008;
      this.isWarm = Math.random() < 0.12; // occasional coral bioluminescence
    }

    update() {
      this.y -= this.speedY;
      this.waveOffset += this.waveSpeed;
      this.x += Math.sin(this.waveOffset) * 0.35;
      this.alpha = this.baseAlpha + Math.sin(this.waveOffset * 1.5) * 0.15;

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      if (this.isWarm) {
        ctx.fillStyle = `rgba(255, 128, 102, ${Math.max(0, this.alpha)})`;
        ctx.shadowColor = 'rgba(255, 128, 102, 0.6)';
      } else {
        ctx.fillStyle = `rgba(72, 214, 197, ${Math.max(0, this.alpha)})`;
        ctx.shadowColor = 'rgba(72, 214, 197, 0.7)';
      }
      ctx.shadowBlur = 8;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Subtle underwater light gradient
    const gradient = ctx.createRadialGradient(
      width * 0.5, height * 0.3, 50,
      width * 0.5, height * 0.4, Math.max(width, height) * 0.8
    );
    gradient.addColorStop(0, 'rgba(13, 59, 73, 0.18)');
    gradient.addColorStop(1, 'rgba(7, 27, 43, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
});