# Sinaquant — Security Audit & Hardening Notes

This file documents the security work that has been done on
the **static** build, plus the checklist that **must be
followed when the project is converted to WordPress**.

The static build is HTML/CSS/JS only — there is no server
to enforce anything, so the runtime attack surface is small.
The real risk lives in the eventual WP conversion. The
goal of this file is to make sure nothing gets lost in
translation.

---

## 1. What was hardened in the static build

### 1.1 HTTP-equivalent security headers (14 pages)
Every HTML file now ships with a meta-tag block immediately
after `<meta name="theme-color">`:

| Header | Value | Purpose |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Block MIME-sniffing |
| `X-Frame-Options` | `DENY` | Clickjacking (no iframe) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limit referrer leakage |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()` | Disable unused APIs |
| `Content-Security-Policy` | see head of any page | Default `'self'`, allow Unsplash images + Google Fonts, `frame-ancestors 'none'` |

**Caveat:** meta-tag CSP is weaker than the HTTP-header
version. The WordPress server MUST re-emit these as real
HTTP headers (Apache `Header always set`, nginx
`add_header`, or a security plugin like
"SF Move Login" / "Headers Security Advanced & HSTS WP").
The meta tags are belt-and-suspenders for the static
preview and a self-documenting spec for the WP build.

### 1.2 XSS sinks — all converted to safe DOM APIs
Every `innerHTML` / `insertAdjacentHTML` sink that mixes
user-influenceable data with markup has been replaced with
`createElement` + `textContent`:

| Sink | File | Status |
|---|---|---|
| `addSignal()` template-literal HTML | `js/main.js` | ✅ rewritten to createElement |
| `msg.innerHTML` mixed literal + esc | `js/main.js` | ✅ rewritten to createTextNode/strong |
| Story-card builder (`card.innerHTML`) | `js/main.js` | ✅ rewritten to createElement |
| Author follow icon swap | `js/main.js` | ✅ rewritten to createElementNS |
| Theme toggle icon swap | `js/main.js` | ⚠️ fixed literals only — OK but consider rewriting on next edit |

Two helper utilities were added:
- `esc(s)` — HTML-entity-encodes a string for the rare
  places we still need it.
- `toast(msg, kind)` — non-blocking replacement for
  `alert()`. Used by checkout submit and other status
  flows. `alert()` was removed from every page.

### 1.3 Form input hardening
**checkout.html** and **contact.html** — every `<input>`,
`<select>`, and `<textarea>` now has:
- `maxlength` cap
- `minlength` (where appropriate)
- `pattern` (regex) for free-text fields
- explicit `autocomplete` value
- `spellcheck="false"` on non-prose fields
- `name` attribute (so the JS can build a proper payload)

The checkout submit handler:
- Trims and caps every value at 256 chars
- Strips ASCII control chars (`0x00-0x08, 0x0B, 0x0C,
  0x0E-0x1F, 0x7F`) — defence against log-injection /
  JSON-parser confusion
- Runs `checkValidity()` so the browser's pattern +
  maxlength engine is the single source of truth
- Builds a sanitised `payload` object ready for `fetch`
- Includes a comment block describing the exact
  WordPress REST call that should replace the demo
  `setTimeout`

### 1.4 Other small wins
- Google Fonts CSS link gets `crossorigin="anonymous"`
  (required for SRI when added later)
- `window.open()` for share buttons uses `noopener` in
  the features string — tab-nabbing blocked
- No `target="_blank"` anchors exist anywhere in the
  codebase, so no `rel="noopener noreferrer"` work was
  needed (added defensively in `docs/links.md` for
  future authors)

---

## 2. WordPress conversion — security checklist

When this site is ported to WordPress, the following
MUST be done before the first deployment to production.
The order matters — start with the runtime, then
templates, then admin hardening.

### 2.1 Server / hosting
- [ ] **Force HTTPS** — Let's Encrypt cert, HSTS preload.
- [ ] **Real HTTP security headers** via `.htaccess`,
      `nginx.conf`, or a plugin (Headers Security
      Advanced / HSTS WP):
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN` (or `DENY` if no
    legitimate iframe embedder is needed)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()`
  - `Content-Security-Policy: default-src 'self'; img-src 'self' https://images.unsplash.com; style-src 'self' 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'nonce-XYZ'; connect-src 'self' https://*.sinaquant.ai; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`
  - **Per-request CSP nonce** — the WP `wp_generate_nonce`
    value should be added to every `<script>` and the
    CSP `script-src` directive. Use a plugin like
    "CSP-Header" or roll your own with `script_loader_tag`.
- [ ] **Self-host Google Fonts** — eliminates the
      `fonts.gstatic.com` / `fonts.googleapis.com` CSP
      whitelisting and the third-party SRI problem.
- [ ] **Disable PHP file editing** in `wp-config.php`:
      ```php
      define('DISALLOW_FILE_EDIT', true);
      ```
- [ ] **Lock down `/wp-admin/`** — IP allowlist where
      possible, 2FA on every admin account, limit login
      attempts.
- [ ] **Disable XML-RPC** (`xmlrpc.php`) unless a hard
      requirement exists.

### 2.2 WordPress core
- [ ] Latest WP, no abandoned plugins. Audit every
      plugin once a quarter.
- [ ] **Disable file execution in `/wp-content/uploads/`**
      via `.htaccess` (defence in depth — prevents a
      compromised upload from running PHP).
- [ ] Move `wp-config.php` one directory above
      `public_html` where the host allows it.

### 2.3 Theme / templates
Every template that echoes post / user / term data MUST
follow WP escaping rules:

| Context | Function |
|---|---|
| HTML body text | `esc_html()` |
| HTML attribute | `esc_attr()` |
| URL (href / src) | `esc_url()` |
| JavaScript string | `esc_js()` or `wp_json_encode()` |
| JSON in `<script>` | `wp_json_encode()` and **never** embed `</script>` substrings. The JSON-LD block in `story.html` is the obvious one. |

Use `wp_kses_post()` for any HTML you DO want to allow
(editor content). NEVER use `echo $post->post_title` —
always `echo esc_html( $post->post_title )`.

### 2.4 Forms (the critical pieces)
- [ ] **Every form submission must verify a nonce**.
      Render a hidden input on the form:
      ```php
      <input type="hidden" name="_sinaquant_nonce" value="<?php echo wp_create_nonce('sinaquant_form'); ?>">
      ```
      Verify on the server:
      ```php
      if ( ! wp_verify_nonce( $_POST['_sinaquant_nonce'], 'sinaquant_form' ) ) {
        wp_send_json_error( 'Invalid nonce', 403 );
      }
      ```
- [ ] **Capability check** for any state-changing
      action. Anonymous users can submit the contact
      form (so gate that one with hCaptcha / Cloudflare
      Turnstile instead). Logged-in actions must use
      `current_user_can()`.
- [ ] **Server-side sanitisation** in addition to the
      client-side validation we already have:
      ```php
      $company = sanitize_text_field( wp_unslash( $_POST['company_name'] ) );
      $email   = sanitize_email( wp_unslash( $_POST['email'] ) );
      ```
- [ ] **Prepared statements** for any database write.
      Use `$wpdb->insert()` or `$wpdb->prepare()`.
      NEVER string-concatenate user input into SQL.
- [ ] **Rate-limit** the contact + checkout endpoints
      (transient-based or via a plugin).

### 2.5 Custom REST / AJAX endpoints
The checkout and contact handlers will move into
`/wp-json/sinaquant/v1/...`. Use
`register_rest_route()` with:
- `permission_callback` returning `current_user_can(...)`
  or a captcha result.
- `args` schema with `type`, `format`, `required` —
  WP will reject anything that doesn't match.
- Inside the callback, call `sanitize_text_field` /
  `absint` / `rest_sanitize_*` on every param.

### 2.6 Admin content
- [ ] **Limit post-revision retention** (config or
      plugin) — old drafts sometimes contain credentials
      in copy.
- [ ] **Never trust the post body** when echoing it
      into a `meta` tag, `og:*` tag, or JSON-LD block.
      The `story.html` JSON-LD has a comment explaining
      the `wp_json_encode` + `wp_kses_post` minimum.
- [ ] For `<img src>`, always run through `esc_url` AND
      validate that the URL starts with `https://` and
      is on an allowlist (Unsplash is already
      whitelisted in CSP).

### 2.7 Secrets
- [ ] **Stripe / Salesforce API keys** go in
      `wp-config.php` constants, never in a plugin
      settings page that is visible to editor users.
- [ ] `.env` files excluded from the repo (`.gitignore`).
- [ ] Any token displayed in admin should be redacted
      on render — never log the full value.

---

## 3. Things to monitor post-launch

| Metric | Why |
|---|---|
| Failed-login spike | Brute force / credential stuffing |
| 4xx surge on `/checkout` or `/contact` | Form abuse, possible recon |
| New `wp_users` rows with `subscriber` role | Spambot registration — disable open registration if not needed |
| Unknown script origins in `script-src` reports | CSP violation — a plugin is loading 3rd-party JS |

If you wire up CSP reporting (`report-uri` / `report-to`),
point it at a Sentry or report-uri.com collector from day
one — silent CSP is almost useless.

---

## 4. Out of scope for the static build (intentional)

These are real risks, but the static build has no
runtime to attack so they don't apply until the WP
conversion:

- SQL injection (no database in the static build)
- SSRF / LFI (no server-side rendering)
- Session fixation / CSRF (no sessions)
- Privilege escalation (no roles)
- Plugin / theme vulnerabilities (no plugins)

The moment WordPress is involved, **all** of the above
become live and the WP checklist in §2 must be completed
before the site opens to the public.
