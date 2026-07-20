/* =========================================================
   Sinaquant — include loader
   ------------------------------------------------------------
   Tiny partial-loader that fetches /assets/includes/<name>.html
   and injects it into any <div data-include="name"> slot on
   the page. Lets us share the header and footer across all
   six static HTML files without a build step or a templating
   engine.

   Why a fetch loader instead of duplicating the markup?
   --------------------------------------------------------
   • One source of truth: edit the header once, every page
     updates automatically.
   • Faster local iteration — no copy-paste drift between
     pages (a "subscribe" link missing from the footer on
     one page is a class of bug we don't have to debug).
   • Drops out cleanly when the site moves to WordPress.
     header.php / footer.php ship in initial HTML, so the
     loader simply doesn't run.

   When does it run?
   -----------------
   As an IIFE on script load. It:
   1. Finds every [data-include] slot in the page.
   2. Fires a parallel fetch for each slot's file.
   3. On success, replaces the placeholder div with the
      fetched markup (outerHTML swap keeps the surrounding
      DOM identical).
   4. After ALL fetches resolve, dispatches a
      'sinaquant:included' event AND calls
      window.__sinaquant_rebind() so main.js can wire up
      handlers (drawer, search, theme toggle, etc.) that
      depend on the header DOM.
   ========================================================= */
(function () {
  const slots = document.querySelectorAll('[data-include]');
  if (!slots.length) return;
  Promise.all(Array.from(slots).map(slot => {
    const name = slot.getAttribute('data-include');
    return fetch('assets/includes/' + name + '.html', { cache: 'no-store' })
      .then(r => r.ok ? r.text() : '')
      .then(html => { if (html) slot.outerHTML = html; });
  })).then(() => {
    // Fire a custom event so main.js can wire up handlers after include.
    document.dispatchEvent(new CustomEvent('sinaquant:included'));
    // Re-bind handlers that depend on the injected DOM.
    if (typeof window.__sinaquant_rebind === 'function') window.__sinaquant_rebind();

    // Load the shared background animation after the header canvas is in place.
    if (!document.getElementById('sinaquant-bg-script')) {
      const bgScript = document.createElement('script');
      bgScript.id = 'sinaquant-bg-script';
      bgScript.src = 'js/background.js';
      bgScript.defer = true;
      document.body.appendChild(bgScript);
    }
  });
})();
