/* =========================================================
   Sinaquant — main.js
   ------------------------------------------------------------
   Vanilla JavaScript for global behaviour shared across
   every page. There is no build step and no framework —
   we ship plain ES2017 so the file runs unmodified in
   every modern browser.

   Architecture
   ------------
   Everything is wrapped in a single function called
   `sinaquantInit()` which is exposed on `window` as
   `__sinaquant_rebind`. The reason it is exposed is that
   the shared header + footer are loaded by `includes.js`
   AFTER this file's first DOMContentLoaded pass, so any
   handler that needs the header DOM (drawer, search,
   theme toggle) must be re-bound after the partials land.
   `includes.js` calls `__sinaquant_rebind()` for us at
   the end of the partials promise chain.

   When the page already has the header in the DOM (e.g.
   when developing the static files directly), this file
   also auto-runs once on DOMContentLoaded so dev preview
   still works without a server.

   Each numbered section below covers a single behaviour.
   Sections are self-contained — removing one does not
   break any other.

   WordPress conversion
   --------------------
   When this file is converted to a WordPress theme, the
   static partials (header.php / footer.php) ship in
   initial HTML, so the rebind step becomes unnecessary
   and can be deleted. The handlers themselves stay
   unchanged.
   ========================================================= */

function sinaquantInit() { 'use strict';

  /* ----------------------------------------------------
     1. Sticky header — shrink after ~100px scroll
     ----------------------------------------------------
     Adds `is-scrolled` to the sticky header once the user
     has scrolled past 80px. The CSS shrinks the brand,
     tightens padding, and shifts the category tabs up to
     fill the gap. `requestAnimationFrame` + the
     `ticking` flag avoids re-running this on every
     scroll event (60Hz max).
     ---------------------------------------------------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const SCROLL_THRESHOLD = 80;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------
     1b. Toast / inline-notice helper
     ----------------------------------------------------
     Replaces the native alert() calls. alert() blocks
     the JS thread, freezes the UI, and (in some
     browsers) reveals the page origin in the dialog
     title — minor but real fingerprinting. This helper
     renders a non-blocking toast in the corner with a
     success / error / info variant. Stack is bounded
     to 4 visible toasts; older ones auto-dismiss.

     Usage:
       toast('Saved.', 'success');
       toast('Something went wrong.', 'error');
     ---------------------------------------------------- */
  const toast = (msg, kind) => {
    // Re-use a single container so we never leak
    // toast nodes into the DOM.
    let host = document.getElementById('toastHost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'toastHost';
      host.setAttribute('role', 'status');
      host.setAttribute('aria-live', 'polite');
      host.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:9999;display:flex;flex-direction:column;gap:8px;max-width:360px';
      document.body.appendChild(host);
    }
    // Cap visible toasts.
    while (host.children.length >= 4) host.firstElementChild.remove();

    const n = document.createElement('div');
    n.className = 'toast toast--' + (kind || 'info');
    // textContent (not innerHTML) so the message can
    // safely come from anywhere.
    n.textContent = String(msg).slice(0, 280);
    host.appendChild(n);
    // CSS handles the slide-in via @keyframes toastIn.
    setTimeout(() => { n.classList.add('is-leaving'); }, 3400);
    setTimeout(() => { n.remove(); }, 3900);
  };

  /* ----------------------------------------------------
     2. Mobile drawer (open / close, focus trap, Esc)
     ----------------------------------------------------
     Slide-in panel from the right. Implements three a11y
     behaviours: (a) Esc closes it, (b) Tab is trapped
     inside it (cycle between first/last focusable), and
     (c) focus is restored to the trigger element on
     close. `body.is-locked` (toggled here) prevents
     background scroll on iOS.
     ---------------------------------------------------- */
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const openBtn = document.getElementById('menuOpen');
  const closeBtn = document.getElementById('menuClose');

  if (drawer && backdrop) {
    let lastFocused = null;

    const focusableSel = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

    const openDrawer = () => {
      lastFocused = document.activeElement;
      drawer.classList.add('is-open');
      backdrop.classList.add('is-open');
      document.body.classList.add('is-locked');
      if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
      // focus first focusable inside drawer
      const first = drawer.querySelector(focusableSel);
      if (first) first.focus();
    };

    const closeDrawer = () => {
      drawer.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
      if (lastFocused) lastFocused.focus();
    };

    if (openBtn) openBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);

    // Close drawer when any internal link is clicked (so
    // the user actually lands on the destination page,
    // not the open drawer).
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

    // ESC closes drawer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });

    // Focus trap
    drawer.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusables = drawer.querySelectorAll(focusableSel);
      if (!focusables.length) return;
      const first = focusables[0];
      const last  = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });
  }

  /* ----------------------------------------------------
     3. Search overlay
     ----------------------------------------------------
     Top-of-page overlay that slides down when the search
     icon is clicked. The 100ms focus delay lets the
     translateY transition finish so the user sees the
     input arrive, not a flicker.
     ---------------------------------------------------- */
  const searchTrigger = document.getElementById('searchTrigger');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchClose   = document.getElementById('searchClose');
  const searchInput   = document.getElementById('searchInput');

  if (searchOverlay) {
    const openSearch = () => {
      searchOverlay.classList.add('is-open');
      document.body.classList.add('is-locked');
      if (searchTrigger) searchTrigger.setAttribute('aria-expanded', 'true');
      if (searchInput) setTimeout(() => searchInput.focus(), 100);
    };
    const closeSearch = () => {
      searchOverlay.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      if (searchTrigger) searchTrigger.setAttribute('aria-expanded', 'false');
    };
    if (searchTrigger) searchTrigger.addEventListener('click', openSearch);
    if (searchClose)   searchClose.addEventListener('click', closeSearch);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchOverlay.classList.contains('is-open')) closeSearch();
    });
  }

  /* ----------------------------------------------------
     4. Dark / light mode toggle
     ----------------------------------------------------
     Toggles `.light-mode` on <html>. The CSS override
     block flips only the semantic tokens (bg, surface,
     text, border) so the brand accents stay the same.
     The icon swap is done inline so we don't need to
     maintain two SVG assets in the header include.

     In WordPress, this section should be extended to
     persist the choice in `localStorage` and apply it
     before first paint (to prevent flash). A small
     inline <script> in header.php is the standard
     pattern for that.
     ---------------------------------------------------- */
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('light-mode');
      const icon = themeBtn.querySelector('svg');
      if (icon) {
        // Swap icon: sun ↔ moon
        icon.innerHTML = isLight
          ? '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
          : '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
      }
    });
  }

  /* ----------------------------------------------------
     5. Hero slider
     ----------------------------------------------------
     Cross-fade auto-advance. Supports:
     • Intro video slide (autoplay, pauses when hidden)
     • 5 full-bleed image slides
     • Prev / next buttons
     • Dot pagination
     • Touch swipe (50px threshold)
     • Pause on hover or touch
     The intro video slide gets a longer first interval so
     the brand film can finish before the carousel starts.
     ---------------------------------------------------- */
  const slider = document.querySelector('.hero-slider');
  if (slider) {
    const slides = slider.querySelectorAll('.hero-slider__slide');
    const dots   = slider.querySelectorAll('.hero-slider__dots button');
    const prev   = slider.querySelector('[data-slider-prev]');
    const next   = slider.querySelector('[data-slider-next]');
    const video  = slider.querySelector('#heroIntroVideo');
    let active = 0;
    let timer = null;
    const INTERVAL = 5000;
    const INTRO_INTERVAL = 7000;   // allow the 7s intro video to play

    const manageVideo = () => {
      if (!video) return;
      const isVideoSlide = slides[active].dataset.slideType === 'video';
      if (isVideoSlide) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    const goTo = (i) => {
      active = (i + slides.length) % slides.length;
      slides.forEach((s, idx) => {
        s.classList.toggle('is-active', idx === active);
        // Restart the CSS zoom animation on image slides.
        if (idx === active && s.dataset.slideType === 'image') {
          s.style.animation = 'none';
          void s.offsetWidth; // force reflow
          s.style.animation = '';
        }
      });
      dots.forEach((d, idx) => d.classList.toggle('is-active', idx === active));
      manageVideo();
    };

    const scheduleNext = () => {
      const delay = active === 0 ? INTRO_INTERVAL : INTERVAL;
      timer = setTimeout(() => {
        goTo(active + 1);
        scheduleNext();
      }, delay);
    };
    const start = () => { stop(); scheduleNext(); };
    const stop  = () => { if (timer) clearTimeout(timer); };

    if (slides.length) {
      goTo(0);
      if (prev) prev.addEventListener('click', () => { goTo(active - 1); start(); });
      if (next) next.addEventListener('click', () => { goTo(active + 1); start(); });
      dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); start(); }));

      // pause on hover/touch
      slider.addEventListener('mouseenter', stop);
      slider.addEventListener('mouseleave', start);
      slider.addEventListener('touchstart', stop, { passive: true });
      slider.addEventListener('touchend', start);

      // basic swipe support
      let sx = 0;
      slider.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
      slider.addEventListener('touchend',   (e) => {
        const dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 50) { goTo(active + (dx < 0 ? 1 : -1)); start(); }
      });

      start();
    }
  }

  /* ----------------------------------------------------
     6. Reading progress (single story)
     ----------------------------------------------------
     Sets the width of the gradient bar at the top of the
     page to (scrollY / scrollMax * 100)%. The 0.1s CSS
     transition smooths out the value. Falls back to 0
     when the page is not scrollable (e.g. short stories).
     ---------------------------------------------------- */
  const progressBar = document.querySelector('.reading-progress__bar');
  if (progressBar) {
    const update = () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop || document.body.scrollTop);
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (scrolled / max) * 100 : 0;
      progressBar.style.width = pct + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ----------------------------------------------------
     7. Auto Table of Contents (single story)
     ----------------------------------------------------
     Scans .article-content for h2/h3, assigns them ids if
     they don't have one, and builds the TOC list. Then
     runs a scrollspy that highlights the link for the
     section currently nearest the top of the viewport.
     H3 entries are indented (padding-left: 28px) so the
     hierarchy is visible at a glance.
     ---------------------------------------------------- */
  const toc = document.querySelector('.article-toc ul');
  if (toc) {
    const headings = document.querySelectorAll('.article-content h2, .article-content h3');
    headings.forEach((h, i) => {
      h.id = h.id || 'h-' + (i + 1);
      const li = document.createElement('li');
      const a  = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      if (h.tagName === 'H3') a.style.paddingLeft = '28px';
      li.appendChild(a);
      toc.appendChild(li);
    });
    // scrollspy
    const tocLinks = toc.querySelectorAll('a');
    const onSpy = () => {
      let current = '';
      headings.forEach(h => {
        if (h.getBoundingClientRect().top < 180) current = h.id;
      });
      tocLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + current));
    };
    window.addEventListener('scroll', onSpy, { passive: true });
    onSpy();
  }

  /* ----------------------------------------------------
     8. Estimated read time
     ----------------------------------------------------
     Replaces any [data-readtime] placeholder text with
     "N min read" computed from the article word count.
     200 WPM is the conventional adult reading rate.
     Math.max(1, …) guarantees we never show "0 min read"
     on very short stories.
     ---------------------------------------------------- */
  document.querySelectorAll('[data-readtime]').forEach(el => {
    const text = el.textContent || '';
    const wpm = 200;
    const mins = Math.max(1, Math.round(text.split(/\s+/).length / wpm));
    el.textContent = mins + ' min read';
  });

  /* ----------------------------------------------------
     9. Newsletter modal — trigger after 30s OR exit-intent
     ----------------------------------------------------
     Two triggers: a 30s timeout (good for engaged users)
     and a mouseout event where clientY <= 0 (cursor leaves
     the viewport, classic exit-intent). Once dismissed
     (via X, Esc, backdrop click, or submit), the
     `sq_modal_dismissed` session-storage flag prevents
     re-showing for the rest of the session.
     ---------------------------------------------------- */
  const modal = document.getElementById('newsletterModal');
  if (modal) {
    const SESSION_KEY = 'sq_modal_dismissed';
    const dismissed = sessionStorage.getItem(SESSION_KEY) === '1';
    if (!dismissed) {
      const show = () => { modal.classList.add('is-open'); document.body.classList.add('is-locked'); };
      const hide = () => { modal.classList.remove('is-open'); document.body.classList.remove('is-locked'); sessionStorage.setItem(SESSION_KEY, '1'); };
      const timerId = setTimeout(show, 30000);
      // exit-intent
      const onLeave = (e) => {
        if (e.clientY <= 0 && modal.offsetParent === null) {
          clearTimeout(timerId);
          show();
        }
      };
      document.addEventListener('mouseout', onLeave);
      modal.addEventListener('click', (e) => { if (e.target === modal) hide(); });
      modal.querySelectorAll('[data-modal-close]').forEach(b => b.addEventListener('click', hide));
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('is-open')) hide(); });
    }
  }

  /* ----------------------------------------------------
     10. Load-more button (news feed)
     ----------------------------------------------------
     Currently stubs 3 new cards with a static title pool
     so the UX works without a backend. The commented
     `fetch /wp-json/...` line in the source is the WP
     replacement — swap the for-loop for a JSON-driven
     card template and the rest stays the same.
     ---------------------------------------------------- */
  const loadMoreBtn = document.querySelector('[data-load-more]');
  if (loadMoreBtn) {
    let page = 1;
    const grid = document.querySelector('[data-story-grid]');
    loadMoreBtn.addEventListener('click', async () => {
      page++;
      loadMoreBtn.disabled = true;
      loadMoreBtn.textContent = 'Loading…';
      // In WP-conversion, swap this fetch for /wp-json/wp/v2/posts?page=…
      // For now, we append a simple stub card so the UX still works in static mode.
      try {
        await new Promise(r => setTimeout(r, 500));
        if (grid) {
          const titles = [
            'Inside Anthropic’s New Constitutional Alignment Method',
            'Why Every ML Team Is Rewriting Their Eval Pipeline',
            'Hugging Face Acquires Compute-Cluster Startup',
            'OpenAI Confirms GPT-6 Training Cluster Goes Live',
            'Meta Releases Open-Weights Vision-Language Model',
            'Cohere Launches Sovereign-Cloud Deployment Tier',
          ];
          for (let i = 0; i < 3; i++) {
            const t = titles[(page * 3 + i) % titles.length];
            // Build the card with createElement (NOT innerHTML
            // with template literals). `t` is currently a
            // hard-coded array entry, but if it ever comes from
            // a CMS / API we want this code to stay safe.
            const card = document.createElement('article');
            card.className = 'story-card story-card--compact';
            const img = document.createElement('div');
            img.className = 'story-image';
            img.style.background = 'linear-gradient(135deg, #133B5C, #0B1C36)';
            card.appendChild(img);
            const body = document.createElement('div');
            body.className = 'story-body';
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.textContent = 'AI News';
            body.appendChild(tag);
            const h3 = document.createElement('h3');
            h3.className = 'story-title';
            const a = document.createElement('a');
            a.href = '#';
            a.textContent = t;
            h3.appendChild(a);
            body.appendChild(h3);
            const foot = document.createElement('div');
            foot.className = 'story-footer';
            const f1 = document.createElement('span');
            f1.textContent = 'Just now';
            const f2 = document.createElement('span');
            f2.textContent = '4 min read';
            foot.appendChild(f1);
            foot.appendChild(f2);
            body.appendChild(foot);
            card.appendChild(body);
            grid.appendChild(card);
          }
        }
      } finally {
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = 'Load more stories';
      }
    });
  }

  /* ----------------------------------------------------
     11. Tool directory filter
     ----------------------------------------------------
     Toggles .is-active on the filter chips and shows /
     hides `.tool-card` elements based on their
     `data-category` attribute. Match is exact (case
     insensitive). The "All" chip uses `data-filter="all"`
     to reset visibility.
     ---------------------------------------------------- */
  const filters = document.querySelectorAll('.tool-filters button');
  if (filters.length) {
    filters.forEach(b => b.addEventListener('click', () => {
      filters.forEach(x => x.classList.remove('is-active'));
      b.classList.add('is-active');
      const cat = (b.dataset.filter || 'all').toLowerCase();
      document.querySelectorAll('.tool-card').forEach(card => {
        const c = (card.dataset.category || '').toLowerCase();
        card.style.display = (cat === 'all' || c === cat) ? '' : 'none';
      });
    }));
  }

  /* ----------------------------------------------------
     12. Share + copy link
     ----------------------------------------------------
     Maps each `data-share` value to a sharer URL with
     the current page URL and document.title pre-filled.
     `copy` uses the async Clipboard API; on success the
     button's data-label flips to "Copied!" for 1.5s. On
     failure (e.g. older browsers, non-secure contexts)
     we silently do nothing — the link is still
     selectable.
     ---------------------------------------------------- */
  document.querySelectorAll('[data-share]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const kind = btn.dataset.share;
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(document.title);
      const map = {
        x:       `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
        linkedin:`https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        facebook:`https://www.facebook.com/sharer/sharer.php?u=${url}`,
        whatsapp:`https://wa.me/?text=${title}%20${url}`,
      };
      if (kind === 'copy') {
        try {
          await navigator.clipboard.writeText(window.location.href);
          btn.classList.add('is-success');
          const label = btn.dataset.label;
          if (label) btn.dataset.labelOriginal = label;
          btn.dataset.label = 'Copied!';
          setTimeout(() => { btn.classList.remove('is-success'); btn.dataset.label = btn.dataset.labelOriginal || 'Copy link'; }, 1500);
        } catch (e) { /* clipboard not available */ }
        return;
      }
      if (map[kind]) window.open(map[kind], '_blank', 'noopener,width=600,height=520');
    });
  });

  /* ----------------------------------------------------
     13. Contact form (front-end only)
     ----------------------------------------------------
     Lightweight, dependency-free validation. Checks that
     every `[required]` field has a non-empty trimmed
     value. On success, shows a status message in
     `.form-status` and resets the form. When the form is
     wired to a real endpoint, replace the body of the
     handler with a `fetch` to /wp-json/sinaquant/v1/contact
     (or whichever form plugin is in use) and surface the
     server response.
     ---------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = contactForm.querySelector('.form-status');
      // basic required validation
      let valid = true;
      contactForm.querySelectorAll('[required]').forEach(f => {
        if (!f.value.trim()) valid = false;
      });
      if (!valid) {
        if (status) { status.textContent = 'Please fill in all required fields.'; status.className = 'form-status is-visible'; status.style.color = '#ff7a7a'; }
        return;
      }
      if (status) {
        status.textContent = 'Thanks! Your message is queued — we will reply within 1 business day.';
        status.className = 'form-status is-visible form-status--success';
      }
      contactForm.reset();
    });
  }

  /* ----------------------------------------------------
     14. Active nav link highlighting by URL
     ----------------------------------------------------
     Compares each nav link's filename with the current
     page's filename and adds `is-active` to matches. This
     is intentionally a JS fallback — WordPress menus will
     add the active class via wp_nav_menu's
     'menu_class' + 'current-menu-item' but until then
     this lets the static files show the right tab.
     ---------------------------------------------------- */
  const path = window.location.pathname.replace(/\/$/, '').split('/').pop() || 'index.html';
  document.querySelectorAll('.primary-nav a, .category-tabs a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('#')[0].split('/').pop();
    if (href && (href === path || (path === '' && href === 'index.html'))) {
      a.classList.add('is-active');
    }
  });

  /* ----------------------------------------------------
     15. Newsletter mini forms
     ----------------------------------------------------
     Used by the footer mini form and any inline
     `.newsletter form`. Stops the default submit,
     shows a "Subscribed" confirmation in the button, and
     resets the input. Real subscription handling should
     be wired in WP via a plugin (MailPoet, ConvertKit,
     etc.) — this handler just keeps the optimistic UX
     working in the meantime.
     ---------------------------------------------------- */
  document.querySelectorAll('.newsletter form, .footer-mini-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (!input || !input.value) return;
      const btn = form.querySelector('button');
      const orig = btn ? btn.textContent : '';
      if (btn) { btn.textContent = '✓ Subscribed'; btn.disabled = true; }
      input.value = '';
      setTimeout(() => { if (btn) { btn.textContent = orig; btn.disabled = false; } }, 2200);
    });
  });

  /* ----------------------------------------------------
     16. Checkout step navigation
     ----------------------------------------------------
     The enterprise checkout flow is a single form split
     into 3 .step sections. Only the active step is
     pointer-events-enabled; previous steps collapse to
     .step--done and show a check. The progress bar at
     the top fills to (step/3)*100%. Each .step has data-
     step="1|2|3" which keeps the wire-up generic.
     ---------------------------------------------------- */
  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    const progressBar = checkoutForm.parentElement.querySelector('.checkout-progress__bar')
      || document.querySelector('.checkout-progress__bar');
    const steps = checkoutForm.querySelectorAll('.step');
    const goToStep = (target) => {
      steps.forEach(s => {
        const n = parseInt(s.dataset.step, 10);
        s.classList.remove('step--active', 'step--inactive', 'step--done');
        if (n < target) s.classList.add('step--done');
        else if (n === target) s.classList.add('step--active');
        else s.classList.add('step--inactive');
      });
      if (progressBar) progressBar.style.width = ((target / steps.length) * 100) + '%';
      const active = checkoutForm.querySelector('.step--active');
      if (active) active.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    checkoutForm.addEventListener('click', (e) => {
      const next = e.target.closest('[data-next]');
      const prev = e.target.closest('[data-prev]');
      if (next) {
        e.preventDefault();
        goToStep(parseInt(next.dataset.next, 10));
      } else if (prev) {
        e.preventDefault();
        goToStep(parseInt(prev.dataset.prev, 10));
      }
    });
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Required-field guard: only run validation against
      // fields in the currently-active step. Each [required]
      // element that fails gets .field--invalid (red border
      // + inline message) and the first one is focused.
      //
      // We also enforce HTML5 `pattern` and `maxlength`
      // client-side. The browser's :invalid API surfaces
      // both, so we lean on that for a single source of
      // truth rather than re-implementing the regex here.
      const active = checkoutForm.querySelector('.step--active');
      if (active) {
        const bad = [];
        active.querySelectorAll('[required]').forEach(el => {
          let ok = el.type === 'checkbox' ? el.checked : !!el.value.trim();
          // Belt-and-suspenders: also run checkValidity() so
          // we catch pattern/maxlength violations.
          if (ok && typeof el.checkValidity === 'function') {
            ok = el.checkValidity();
          }
          el.classList.toggle('field--invalid', !ok);
          if (!ok) bad.push(el);
        });
        if (bad.length) {
          bad[0].focus();
          toast('Please complete the highlighted fields.', 'error');
          return;
        }
      }
      // Sanitise collected values into a plain-object
      // payload. This is the EXACT shape that would be
      // POSTed to /wp-json/sinaquant/v1/checkout in the
      // WP build. We trim, cap at 256 chars per field,
      // and never carry the raw DOM node across.
      const payload = {};
      checkoutForm.querySelectorAll('input, select, textarea').forEach(el => {
        if (!el.name) return;
        let v = (el.value || '').toString().trim().slice(0, 256);
        // Drop any control characters / null bytes that
        // would confuse downstream JSON parsers or shell
        // pipelines.
        v = v.replace(/[ -]/g, '');
        payload[el.name] = v;
      });
      // In WP this becomes:
      //   fetch('/wp-json/sinaquant/v1/checkout', {
      //     method: 'POST',
      //     credentials: 'same-origin',
      //     headers: { 'X-WP-Nonce': wpApiSettings.nonce, 'Content-Type': 'application/json' },
      //     body: JSON.stringify(payload)
      //   })
      // The server then runs sanitize_text_field() on every
      // string, current_user_can('manage_options') and
      // wp_verify_nonce() before doing anything.
      console.info('[checkout] payload (sanitised, demo only):', payload);

      const btn = checkoutForm.querySelector('button[type="submit"]');
      if (btn) { btn.textContent = 'Processing…'; btn.disabled = true; }
      setTimeout(() => {
        toast('Contract request submitted. An account executive will contact you within 2 hours.', 'success');
        if (btn) { btn.textContent = 'Request Activation'; btn.disabled = false; }
        // Clear any validation styling left behind.
        checkoutForm.querySelectorAll('.field--invalid').forEach(el => el.classList.remove('field--invalid'));
        goToStep(1);
      }, 2000);
    });
    // Clear .field--invalid as the user fixes the field
    checkoutForm.querySelectorAll('[required]').forEach(el => {
      el.addEventListener('input',  () => el.classList.remove('field--invalid'));
      el.addEventListener('change', () => el.classList.remove('field--invalid'));
    });
    // Deployment option radio-style toggle
    checkoutForm.querySelectorAll('.deploy-option').forEach(opt => {
      opt.addEventListener('click', () => {
        checkoutForm.querySelectorAll('.deploy-option').forEach(o => o.classList.remove('deploy-option--active'));
        opt.classList.add('deploy-option--active');
      });
    });
    // Payment option toggle
    checkoutForm.querySelectorAll('.pay-option').forEach(opt => {
      opt.addEventListener('click', () => {
        if (opt.classList.contains('pay-option--disabled')) return;
        checkoutForm.querySelectorAll('.pay-option').forEach(o => o.classList.remove('pay-option--active'));
        opt.classList.add('pay-option--active');
      });
    });
  }

  /* ----------------------------------------------------
     17. Search-result filter chips
     ----------------------------------------------------
     Toggles .is-active on .filter-cat and .filter-chip
     elements within .search-filters. The .searchLayout
     handler is intentionally simple — true full-text
     filtering would be a server-side concern in WP.
     ---------------------------------------------------- */
  document.querySelectorAll('.search-filters .filter-cat').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.parentElement;
      group.querySelectorAll('.filter-cat').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('is-active'));
  });

  /* ----------------------------------------------------
     19. Dashboard intelligence-feed injector
     ----------------------------------------------------
     The pagination component is a static list of <button>s.
     This handler flips the .is-active class to whichever
     page is clicked. No real data fetch — the WP version
     hooks this to a paginate_links() callback.
     ---------------------------------------------------- */
  document.querySelectorAll('.pagination').forEach(pag => {
    pag.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn || btn.querySelector('svg')) return;
      pag.querySelectorAll('button').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });

  /* ----------------------------------------------------
     20. Dashboard intelligence-feed injector
     ----------------------------------------------------
     The terminal dashboard renders a live stream of
     "signals" — synthetic news events. Every 5s we
     prepend a new .signal row to #signalFeed (capped
     at 20 rows so the list doesn't grow unbounded). The
     animation handles the fade-in via the @keyframes
     signalIn CSS rule.

     Security note: we build the new row with
     document.createElement + textContent, NOT with
     template-literal insertAdjacentHTML. The dashboard
     is the only place where data eventually comes from
     an outside source (the Sinaquant signal stream),
     so this is the highest-XSS-risk surface in the
     whole site. The escape function `esc()` below is
     defence-in-depth: even though the arrays `types`,
     `targets`, `verbs` are currently hardcoded, we
     run every interpolated value through `esc()` so
     that if they ever become user-driven, we don't
     have to remember to escape at the call site.
     ---------------------------------------------------- */
  const feed = document.getElementById('signalFeed');
  if (feed) {
    // HTML-entity-encode a string. We escape the 5 chars
    // that matter for breaking out of an HTML attribute
    // or text node. NOT safe for URL contexts (use
    // encodeURIComponent for those) or JS string contexts.
    const esc = (s) => String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    const types = [
      { tag: 'is-compute', label: 'Compute Pulse' },
      { tag: 'is-market',  label: 'Market Signal' },
      { tag: 'is-policy',  label: 'Policy Update' },
      { tag: 'is-model',   label: 'Model Release' }
    ];
    const targets = ['Cluster-12', 'Cluster-47', 'Cluster-89', 'Cluster-23', 'Cluster-66'];
    const verbs = ['indicates a significant deviation in power efficiency',
                   'reports an unusual pattern in token-throughput',
                   'flags an anomaly in long-context reasoning',
                   'detects a 4.2% improvement in inference latency'];

    const addSignal = () => {
      const t = types[Math.floor(Math.random() * types.length)];
      const tgt = targets[Math.floor(Math.random() * targets.length)];
      const v = verbs[Math.floor(Math.random() * verbs.length)];
      const time = esc(new Date().toLocaleTimeString('en-GB', { hour12: false }));
      const id = esc(Math.random().toString(36).substring(2, 7).toUpperCase());

      // Build the row with createElement, not innerHTML.
      // This is XSS-proof regardless of what `t`, `tgt`,
      // `v`, or `id` ever contain.
      const row = document.createElement('div');
      row.className = 'signal';

      const timeEl = document.createElement('div');
      timeEl.className = 'signal__time';
      timeEl.textContent = time;
      row.appendChild(timeEl);

      const body = document.createElement('div');
      body.className = 'signal__body';

      const tags = document.createElement('div');
      tags.className = 'signal__tags';
      const tagSpan = document.createElement('span');
      tagSpan.className = 'signal__tag ' + t.tag;
      tagSpan.textContent = t.label;
      const idSpan = document.createElement('span');
      idSpan.className = 'signal__id';
      idSpan.textContent = 'ID: ' + id + '-SIG';
      tags.appendChild(tagSpan);
      tags.appendChild(idSpan);
      body.appendChild(tags);

      const msg = document.createElement('p');
      msg.className = 'signal__msg';
      // Build the message body with createElement so the
      // surrounding literal text and the <strong> tag
      // are constructed in DOM, not as a string. tgt/v
      // are still escaped via textContent, so the output
      // is XSS-proof even if the literals ever change.
      msg.appendChild(document.createTextNode('Routine automated analysis of '));
      const strong = document.createElement('strong');
      strong.textContent = tgt;
      msg.appendChild(strong);
      msg.appendChild(document.createTextNode(' ' + v + '. Potential hardware optimization identified by the Sinaquant Intelligence Engine.'));
      body.appendChild(msg);

      const footer = document.createElement('div');
      footer.className = 'signal__footer';
      const conf = document.createElement('span');
      conf.textContent = 'Confidence: 87%';
      const ref = document.createElement('a');
      ref.href = '#';
      ref.textContent = 'Source Reference →';
      footer.appendChild(conf);
      footer.appendChild(ref);
      body.appendChild(footer);

      row.appendChild(body);
      feed.insertBefore(row, feed.firstChild);

      while (feed.children.length > 20) feed.lastElementChild.remove();
    };
    // Stagger the first few signals so the page doesn't
    // dump them all at once on load.
    setTimeout(addSignal, 1500);
    setTimeout(addSignal, 3500);
    setInterval(addSignal, 5000);
  }

  /* ----------------------------------------------------
     20. Research-bar IntersectionObserver
     ----------------------------------------------------
     The author profile page has horizontal progress
     bars in the "Top Research Areas" sidebar. We use
     an IntersectionObserver to set the --bar-fill width
     to its data-fill value the first time it scrolls
     into view, producing a one-time fill animation.
     ---------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    const bars = document.querySelectorAll('.research-bar__fill[data-fill]');
    if (bars.length) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            en.target.style.width = en.target.dataset.fill + '%';
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.4 });
      bars.forEach(b => io.observe(b));
    }
  }

  /* ----------------------------------------------------
     21. Tabs (author / search)
     ----------------------------------------------------
     Tabs pattern: a .tab-row of [data-tab] buttons
     and a set of [data-tabpanel] panels. The active
     button gets .is-active; all other panels are
     hidden. Used on the author profile's "Recent /
     Popular" article switcher.
     ---------------------------------------------------- */
  document.querySelectorAll('[data-tabgroup]').forEach(group => {
    const buttons = group.querySelectorAll('[data-tab]');
    const panels = document.querySelectorAll(`[data-tabpanel][data-tabgroup="${group.dataset.tabgroup}"]`);
    group.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-tab]');
      if (!btn) return;
      buttons.forEach(b => b.classList.toggle('is-active', b === btn));
      panels.forEach(p => p.hidden = p.dataset.tabpanel !== btn.dataset.tab);
    });
  });

  /* ----------------------------------------------------
     22. Standalone subscribe-cta forms
     ----------------------------------------------------
     Section 15 binds forms inside .newsletter and
     .footer-mini-form. The author profile's "Vane's
     Weekly Brief" CTA is a third form shape — the
     parent is .subscribe-cta, which is a gradient
     card with white text, so the button color flips
     to match. Same optimistic UX: success message,
     then revert after 2.2s.
     ---------------------------------------------------- */
  document.querySelectorAll('.subscribe-cta form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (!input || !input.value) return;
      const btn = form.querySelector('button');
      const orig = btn ? btn.textContent : '';
      if (btn) { btn.textContent = '✓ Subscribed'; btn.disabled = true; }
      input.value = '';
      setTimeout(() => { if (btn) { btn.textContent = orig; btn.disabled = false; } }, 2200);
    });
  });

  /* ----------------------------------------------------
     23. Author "Follow" toggle
     ----------------------------------------------------
     The author header has a "Follow" button. Tapping
     it flips the label to "Following" and swaps the
     icon to a checkmark. State lives only in the DOM
     — in WP this would POST to /wp-json/sinaquant/v1/
     follow/{user_id} and persist.

     Security: the icon is rebuilt with createElementNS
     + setAttribute, never innerHTML. The two icon
     shapes are fixed SVG path data in source, so this
     is defence-in-depth — the values are not
     user-controlled, but we keep the safe path so
     future edits don't accidentally introduce XSS.
     ---------------------------------------------------- */
  const NS = 'http://www.w3.org/2000/svg';
  const buildCheckIcon = () => {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.classList.add('author-follow__icon');
    const path = document.createElementNS(NS, 'polyline');
    path.setAttribute('points', '20 6 9 17 4 12');
    svg.appendChild(path);
    return svg;
  };
  const buildPlusIcon = () => {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.classList.add('author-follow__icon');
    const a = document.createElementNS(NS, 'line');
    a.setAttribute('x1', '12'); a.setAttribute('y1', '5');
    a.setAttribute('x2', '12'); a.setAttribute('y2', '19');
    const b = document.createElementNS(NS, 'line');
    b.setAttribute('x1', '5'); b.setAttribute('y1', '12');
    b.setAttribute('x2', '19'); b.setAttribute('y2', '12');
    svg.appendChild(a); svg.appendChild(b);
    return svg;
  };
  document.querySelectorAll('.author-follow').forEach(btn => {
    btn.addEventListener('click', () => {
      const following = btn.classList.toggle('is-following');
      const label = btn.querySelector('.author-follow__label');
      const oldIcon = btn.querySelector('.author-follow__icon');
      if (label) label.textContent = following ? 'Following' : 'Follow';
      if (oldIcon) oldIcon.replaceWith(following ? buildCheckIcon() : buildPlusIcon());
      btn.setAttribute('aria-pressed', following ? 'true' : 'false');
    });
  });

  /* ----------------------------------------------------
     24. Category sub-filter chips
     ----------------------------------------------------
     The category-feed page has a row of .sub-filter
     buttons (All / Long-Form / Analysis / Briefs /
     Tools). Tapping one toggles .is-active on the
     chip and filters the visible .story-card rows by
     their data-type attribute. Cards that don't match
     are hidden via [hidden]; the load-more button
     remains visible regardless. With no data-type
     match at all we show an empty-state message.
     ---------------------------------------------------- */
  document.querySelectorAll('.sub-filter').forEach(bar => {
    const grid = document.querySelector(bar.dataset.target || '.story-grid');
    if (!grid) return;
    const empty = document.querySelector(bar.dataset.empty || '.sub-filter-empty');
    const apply = () => {
      const active = bar.querySelector('.is-active');
      const filter = active ? active.dataset.filter : 'all';
      let shown = 0;
      grid.querySelectorAll('.story-card').forEach(card => {
        const type = card.dataset.type || '';
        const match = filter === 'all' || type === filter;
        card.hidden = !match;
        if (match) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
    };
    bar.addEventListener('click', (e) => {
      const chip = e.target.closest('button[data-filter]');
      if (!chip) return;
      bar.querySelectorAll('button').forEach(b => b.classList.remove('is-active'));
      chip.classList.add('is-active');
      apply();
    });
    apply();
  });

  /* ----------------------------------------------------
     25. Search filter — actually filter results
     ----------------------------------------------------
     The sidebar's .filter-cat buttons flip their
     .is-active state (section 17) and the .filter-chip
     toggles too. This section takes those signals and
     hides any .story-card on the right whose data-cat
     doesn't match the active category. The featured
     tool, research bento, and tool mini-cards stay
     visible regardless (they're aggregates, not part
     of the article stream).
     ---------------------------------------------------- */
  const searchFilterCat = document.querySelector('.search-filters .filter-cat.is-active');
  if (searchFilterCat) {
    const apply = () => {
      const active = document.querySelector('.search-filters .filter-cat.is-active');
      if (!active) return;
      const label = active.querySelector('span').textContent.trim();
      const slug = label.toLowerCase().replace(/\s+/g, '-');
      const allCats = label === 'All Categories';
      document.querySelectorAll('.search-results .story-card').forEach(card => {
        const cat = (card.dataset.cat || '').toLowerCase();
        card.hidden = !allCats && cat !== slug;
      });
    };
    document.querySelectorAll('.search-filters .filter-cat').forEach(btn => {
      btn.addEventListener('click', apply);
    });
    apply();
  }

  /* ----------------------------------------------------
     18. Category filter (news.html)
     ----------------------------------------------------
     The header category tabs link to news.html with a
     `?cat=agentic-ai` (or research, funding, policy)
     query string. This section reads the query string
     on page load, marks the active tab in the sticky
     category-tabs nav, and hides any .story-card whose
     data-cat doesn't match. The "AI News" tab (no query)
     shows everything.

     On click of a category tab, we update the URL via
     history.pushState and re-apply — that way the user
     can use the back button to undo a filter, and the
     URL is always shareable.

     The active class on .category-tabs a is set by
     section 14 (path-based fallback) on first load; this
     section overrides it once the query is read.
     ---------------------------------------------------- */
  const grid = document.querySelector('[data-story-grid]');
  if (grid) {
    const cards = grid.querySelectorAll('.story-card');
    const tabs = document.querySelectorAll('.category-tabs a');

    const applyCat = (cat) => {
      let shown = 0;
      cards.forEach(card => {
        const c = (card.dataset.cat || '').toLowerCase();
        const match = !cat || c === cat.toLowerCase();
        card.hidden = !match;
        if (match) shown++;
      });
      // Toggle the active tab indicator. The "AI News" tab
      // (href=news.html without a query) is active when cat
      // is empty.
      tabs.forEach(a => {
        const href = (a.getAttribute('href') || '').toLowerCase();
        const aCat = (href.split('cat=')[1] || '').toLowerCase();
        a.classList.toggle('is-active', (!cat && !aCat) || (cat && aCat === cat.toLowerCase()));
      });
      // Empty-state message. We append a small message if
      // the filter shows nothing. The element is reused on
      // re-filter so it doesn't pile up.
      let empty = grid.parentElement.querySelector('.story-grid-empty');
      if (shown === 0) {
        if (!empty) {
          empty = document.createElement('div');
          empty.className = 'story-grid-empty';
          empty.textContent = 'No stories in this category yet. Check back soon.';
          grid.parentElement.appendChild(empty);
        }
        empty.hidden = false;
      } else if (empty) {
        empty.hidden = true;
      }
    };

    // Read the ?cat= query string on load.
    const params = new URLSearchParams(window.location.search);
    const initialCat = params.get('cat') || '';
    applyCat(initialCat);

    // On tab click, update the URL and re-apply.
    tabs.forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href') || '';
        if (!href.includes('news.html')) return;   // ignore the Tools tab
        e.preventDefault();
        const u = new URL(href, window.location.href);
        const newCat = u.searchParams.get('cat') || '';
        const newUrl = window.location.pathname + (newCat ? '?cat=' + newCat : '');
        history.pushState({ cat: newCat }, '', newUrl);
        applyCat(newCat);
        // Scroll to the top of the grid so the user sees the
        // new filtered result immediately.
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // Handle back/forward navigation between filters.
    window.addEventListener('popstate', () => {
      const c = new URLSearchParams(window.location.search).get('cat') || '';
      applyCat(c);
    });
  }

  /* ----------------------------------------------------
     19. Horizontal scroll lock (mobile)
     ----------------------------------------------------
     Belt-and-suspenders for the CSS-level `overflow-x:
     clip` + `overscroll-behavior-x: none` rules in
     style.css. On some iOS Safari versions, the CSS
     rules alone are not enough to stop the page from
     being panned horizontally during a vertical swipe.

     This handler intercepts touchmove events that try
     to scroll a non-scrollable-X element. It allows
     horizontal scroll only on elements that explicitly
     have horizontal overflow (overflow-x: auto / scroll)
     — the category tabs, sub-filter chips, code blocks,
     and the pricing compare table.

     The check `el.scrollWidth <= el.clientWidth + 1`
     means "this element has no horizontal content
     to scroll", so we prevent the default and the
     page never moves horizontally.
     ---------------------------------------------------- */
  let lastTouchX = 0;
  let lastTouchY = 0;
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      lastTouchX = e.touches[0].clientX;
      lastTouchY = e.touches[0].clientY;
    }
  }, { passive: true });
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - lastTouchX;
    const dy = e.touches[0].clientY - lastTouchY;
    // Only act on near-horizontal gestures (|dx| > 2x |dy|).
    if (Math.abs(dx) <= Math.abs(dy) * 2) return;
    // Walk up from the touch target. If any ancestor
    // can scroll horizontally, allow the gesture. If
    // none can, block it so the page itself doesn't
    // pan.
    let node = e.target;
    while (node && node !== document.body) {
      const cs = getComputedStyle(node);
      if (cs.overflowX === 'auto' || cs.overflowX === 'scroll') {
        if (node.scrollWidth > node.clientWidth + 1) return;
      }
      node = node.parentNode;
    }
    e.preventDefault();
  }, { passive: false });

  /* ----------------------------------------------------
     27. Keyboard shortcut: Ctrl+K / Cmd+K to open search
     ----------------------------------------------------
     Power-user shortcut. When the user presses Ctrl+K
     (Windows/Linux) or Cmd+K (Mac), the search overlay
     opens and the input is focused. Escape closes it.
     The browser's default Ctrl+K behaviour ("focus the
     address bar") is suppressed so the shortcut feels
     native. The "/" key (when not in an input) also
     opens search — same pattern as GitHub.
     ---------------------------------------------------- */
  document.addEventListener('keydown', (e) => {
    // Don't hijack typing inside an input or textarea.
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const isShortcut = (isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'k';
    if (isShortcut || e.key === '/') {
      e.preventDefault();
      const trigger = document.getElementById('searchTrigger');
      const input = document.getElementById('searchInput');
      if (trigger) trigger.click();
      setTimeout(() => { if (input) input.focus(); }, 120);
    }
  });

  /* ----------------------------------------------------
     28. Bookmark articles (localStorage)
     ----------------------------------------------------
     Any element with [data-bookmark] is a "Save" toggle.
     On click, the article's URL + title are stored in
     localStorage under 'sq_bookmarks' (a JSON array).
     The button's label flips to "Saved" and gets a
     checkmark; clicking again removes the bookmark.

     The save-state is read on page load so refreshing
     keeps the button in the right state. Bookmarks are
     namespaced per-domain; the dashboard page can read
     the same list to display the user's saved articles.

     localStorage is a per-origin, per-browser store. It
     has no XSS surface from external sources because we
     only ever read/write our own keys.
     ---------------------------------------------------- */
  const BOOKMARK_KEY = 'sq_bookmarks_v1';
  const readBookmarks = () => {
    try { return JSON.parse(localStorage.getItem(BOOKMARK_KEY) || '[]'); }
    catch (e) { return []; }
  };
  const writeBookmarks = (list) => {
    try { localStorage.setItem(BOOKMARK_KEY, JSON.stringify(list)); }
    catch (e) { /* quota or private mode */ }
  };
  document.querySelectorAll('[data-bookmark]').forEach(btn => {
    const url = btn.dataset.bookmark || window.location.pathname;
    const title = btn.dataset.title || document.title;
    const sync = () => {
      const list = readBookmarks();
      const saved = list.some(b => b.url === url);
      btn.classList.toggle('is-saved', saved);
      const label = btn.querySelector('.bookmark-label');
      if (label) label.textContent = saved ? 'Saved' : 'Save';
    };
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const list = readBookmarks();
      const idx = list.findIndex(b => b.url === url);
      if (idx >= 0) {
        list.splice(idx, 1);
      } else {
        list.unshift({ url, title, savedAt: new Date().toISOString() });
      }
      writeBookmarks(list);
      sync();
      toast(idx >= 0 ? 'Removed from saved articles' : 'Saved for later', 'success');
    });
    sync();
  });

  /* ----------------------------------------------------
     29. Back-to-top button
     ----------------------------------------------------
     A floating button appears after the user has
     scrolled 600px down. Clicking it smooth-scrolls
     back to the top. The button is created on demand
     the first time it's needed (so pages that don't
     need it don't carry the markup). It respects
     prefers-reduced-motion: when set, the smooth
     scroll is replaced with an instant jump.
     ---------------------------------------------------- */
  let btt = null;
  const ensureBtt = () => {
    if (btt) return btt;
    btt = document.createElement('button');
    btt.className = 'back-to-top';
    btt.setAttribute('aria-label', 'Back to top');
    btt.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>';
    btt.addEventListener('click', () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
    document.body.appendChild(btt);
    return btt;
  };
  let bttTicking = false;
  const onScroll = () => {
    if (bttTicking) return;
    bttTicking = true;
    requestAnimationFrame(() => {
      const btn = ensureBtt();
      btn.classList.toggle('is-visible', window.scrollY > 600);
      bttTicking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });

}

// Expose for include loader (see includes.js).
window.__sinaquant_rebind = sinaquantInit;

// Build stamp — visible in the page footer so you can
// confirm the latest JS/CSS is loaded without opening
// DevTools. Also printed to the console with a colored
// badge. If the footer shows "v…" instead of a real
// version string, the page is on cached HTML/JS and
// needs a hard refresh.
window.__sinaquant_version = 'v5-2026-07-14-mobile-only-scroll-lock';
console.log('%c Sinaquant ', 'background:#45EDF6;color:#070B15;font-weight:700;padding:2px 8px;border-radius:4px', window.__sinaquant_version);

function paintBuildVersion() {
  const el = document.getElementById('buildVersion');
  if (el) el.textContent = window.__sinaquant_version;
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', paintBuildVersion);
} else {
  paintBuildVersion();
}
// Re-paint after include load (footer is injected async)
if (window.__sinaquant_rebind) {
  setTimeout(paintBuildVersion, 500);
}

// Auto-run when DOM is ready (only if header is already in DOM, i.e. not loaded via include)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.site-header')) sinaquantInit();
  });
} else {
  if (document.querySelector('.site-header')) sinaquantInit();
}
