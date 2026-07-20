/* =========================================================
   Sinaquant — Neural Network Background
   ------------------------------------------------------------
   A subtle canvas particle network that lives behind the
   entire page. It evokes a living data stream / agentic AI
   mesh without competing with the editorial content.

   Behaviour:
   • Particles drift slowly across the viewport.
   • Nearby particles connect with hairline edges.
   • Cursor creates a soft repulsion field (no click required).
   • Colours come from CSS custom properties so the animation
     automatically adapts to dark / light mode.
   • Respects prefers-reduced-motion and stops the animation.
   • Pauses when the tab is hidden to save battery / CPU.
   ========================================================= */

(function () {
  'use strict';

  const canvas = document.getElementById('sinaquant-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isReduced = prefersReducedMotion.matches;
  let isVisible = true;
  let rafId = null;
  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Read CSS custom properties for theming.
  function getCssVar(name, fallback) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim() || fallback;
  }

  const config = {
    particleCount: () => {
      // Scale density with viewport area, but keep it light on small screens.
      const area = width * height;
      if (area < 500000) return 28;
      if (area < 1200000) return 42;
      return 58;
    },
    connectionDistance: 130,
    mouseRadius: 160,
    baseSpeed: 0.25,
  };

  let particles = [];
  const mouse = { x: -1000, y: -1000, active: false };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticles();
  }

  function initParticles() {
    const count = config.particleCount();
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * config.baseSpeed,
        vy: (Math.random() - 0.5) * config.baseSpeed,
        radius: Math.random() * 1.5 + 1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      });
    }
  }

  function updateColors() {
    const isLight = document.documentElement.classList.contains('light-mode');
    return {
      node: isLight
        ? getCssVar('--steel', '#D5DEEA')
        : getCssVar('--cyan', '#45EDF6'),
      edge: isLight
        ? getCssVar('--border', '#D5DEEA')
        : getCssVar('--electric', '#2D5CE8'),
      glow: isLight
        ? 'rgba(49, 156, 231, 0.15)'
        : 'rgba(69, 237, 246, 0.22)',
    };
  }

  function draw() {
    if (!isVisible || isReduced) return;

    const colors = updateColors();
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles.
    particles.forEach((p, i) => {
      // Mouse repulsion.
      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < config.mouseRadius && dist > 0) {
          const force = (config.mouseRadius - dist) / config.mouseRadius;
          p.vx += (dx / dist) * force * 0.015;
          p.vy += (dy / dist) * force * 0.015;
        }
      }

      // Apply velocity with gentle damping.
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.995;
      p.vy *= 0.995;

      // Keep a minimum drift so the network never fully freezes.
      const drift = 0.04;
      if (Math.abs(p.vx) < drift) p.vx += (Math.random() - 0.5) * 0.01;
      if (Math.abs(p.vy) < drift) p.vy += (Math.random() - 0.5) * 0.01;

      // Wrap around edges.
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      // Pulse opacity.
      p.pulse += p.pulseSpeed;
      const alpha = 0.35 + Math.sin(p.pulse) * 0.15;

      // Draw node glow.
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
      ctx.fillStyle = colors.glow;
      ctx.fill();

      // Draw node core.
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = colors.node;
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Draw connections.
    ctx.strokeStyle = colors.edge;
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < config.connectionDistance) {
          const opacity = (1 - dist / config.connectionDistance) * 0.45;
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    rafId = requestAnimationFrame(draw);
  }

  function start() {
    if (rafId) cancelAnimationFrame(rafId);
    if (!isReduced) rafId = requestAnimationFrame(draw);
  }

  function stop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function handleVisibility() {
    isVisible = document.visibilityState === 'visible';
    if (isVisible && !isReduced) start();
    else stop();
  }

  function handleReducedMotion(e) {
    isReduced = e.matches;
    if (isReduced) {
      stop();
      ctx.clearRect(0, 0, width, height);
    } else {
      start();
    }
  }

  // Event listeners.
  window.addEventListener('resize', () => {
    resize();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  document.addEventListener('visibilitychange', handleVisibility);
  prefersReducedMotion.addEventListener('change', handleReducedMotion);

  // Observe theme changes so colours update live.
  const themeObserver = new MutationObserver(() => {
    // The next draw frame will pick up the new colours automatically.
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });

  // Kick off.
  resize();
  handleVisibility();
})();
