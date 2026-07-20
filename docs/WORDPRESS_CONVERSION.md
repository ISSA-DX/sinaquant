# Sinaquant — Static → WordPress Conversion Plan

A complete, ordered guide to porting the static Sinaquant
preview to a production WordPress install. Read this
top-to-bottom once before starting. Total work:
~3-5 days for an experienced WP developer, ~7-10 days
for someone new to the WP theming layer.

---

## 0. What you have, what you're making

**Today (static):** 14 HTML pages, 1 CSS file, 1 JS file,
shared header/footer partials loaded via `fetch()`.

**Goal (WordPress):** A custom theme where:
- `header.html` → `header.php` (renders on every page)
- `footer.html` → `footer.php` (renders on every page)
- `index.html` → `front-page.php` (homepage)
- `news.html` → `home.php` (post archive)
- `story.html` → `single.php` (single post)
- `category.html` → `category.php` (filtered archive)
- `author.html` → `author.php` (author archive)
- `tools.html` → `archive-tool.php` (custom post type)
- `search.html` → `search.php`
- `404.html` → `404.php`
- All other pages → `page-{slug}.php` or `page.php`
- `js/includes.js` → **deleted** (no more fetch)
- `js/main.js` → `enqueued` in `functions.php`

The design (CSS, colours, typography, layout) is preserved
exactly. The HTML markup of every partial becomes PHP with
the same class names — `style.css` does not need to change.

---

## 1. Hosting setup (day 0)

You said you have managed WordPress hosting. The minimum
requirements for the Sinaquant theme are:

- **PHP 8.1+** (WP 6.4+ requires it; 8.2 recommended)
- **MySQL 8.0+** or **MariaDB 10.6+**
- **HTTPS** with a valid cert (Let's Encrypt is fine)
- **mod_rewrite** (Apache) or equivalent (nginx)
- **SSH + WP-CLI** (optional but saves hours)
- **Staging environment** — every managed host gives you
  one. Use it. Never run untested code on production.

Recommended hosts (all include staging, daily backups,
free SSL, server-level caching):

| Host | Why |
|---|---|
| **WP Engine** | Best support, fast, newsroom-friendly |
| **Cloudways (Vultr HF)** | Cheapest good option, ~$14/mo |
| **Kinsta** | Premium, Google Cloud, excellent caching |
| **Pressable** | Owned by Automattic, good for content sites |

Skip: Bluehost, Hostinger, GoDaddy WordPress. They're
cheap but their stacks are slow and oversold.

---

## 2. WordPress install + hardening (day 0, 2-3 hours)

1. Spin up a fresh WP install on the staging environment.
   Don't install the Hello World post or sample pages.
2. **Set the site URL** to your real domain. Update
   `Settings → General`.
3. **Permalinks**: `Settings → Permalinks → Post name`.
   This produces `/news/your-article-slug/` URLs which
   are SEO-friendly and match the static design intent.
4. **Disable comments** site-wide if you're a news
   portal that doesn't run a comments section:
   `Settings → Discussion → uncheck "Allow people to
   submit comments on new posts"`.
5. **Create the admin user** with a unique email + a
   20+ character password. Store the password in a
   password manager, never email.
6. **Enable 2FA** on the admin account. Use the
   "Two Factor" plugin (by George Stephanis) or
   WP Engine's built-in 2FA.
7. **Delete** the default "Hello World" post, "Sample
   Page", and the "Mr WordPress" comment.

---

## 3. Theme scaffold (day 1, 4-6 hours)

Inside your WP install:

```
wp-content/themes/sinaquant/
├── style.css                  ← THE theme metadata + the design system
├── functions.php              ← enqueue scripts, register CPTs, theme setup
├── header.php                 ← from assets/includes/header.html
├── footer.php                 ← from assets/includes/footer.html
├── front-page.php             ← from index.html
├── home.php                   ← from news.html
├── single.php                 ← from story.html
├── page.php                   ← default page template
├── page-contact.php           ← from contact.html
├── page-pricing.php           ← from pricing.html
├── page-checkout.php          ← from checkout.html
├── page-navigation.php        ← from navigation.html (megamenu)
├── page-dashboard.php         ← from dashboard.html (gated)
├── archive.php                ← generic archive fallback
├── archive-tool.php           ← from tools.html (CPT archive)
├── category.php               ← from category.html
├── author.php                 ← from author.html
├── search.php                 ← from search.html
├── 404.php                    ← from 404.html
├── single-tool.php            ← single tool page
├── sidebar.php                ← optional
├── inc/
│   ├── custom-post-types.php  ← registers 'article', 'tool', 'research'
│   ├── custom-taxonomies.php  ← registers 'category', 'topic', 'sector'
│   ├── enqueue.php            ← CSS/JS loading
│   ├── acf-fields.php         ← custom field groups
│   ├── security-headers.php   ← emits CSP/HSTS via .htaccess
│   └── template-tags.php      ← reusable markup helpers
├── assets/
│   ├── css/style.css          ← moved from css/style.css
│   ├── js/main.js             ← moved from js/main.js
│   ├── js/includes.js         ← DELETE (no longer needed)
│   ├── js/admin.js            ← optional WP admin enhancements
│   └── includes/              ← DELETE (header.html/footer.html now PHP)
└── screenshot.png             ← 1200×900 theme preview for WP admin
```

### 3.1 style.css (the theme header)

`style.css` is the file WP scans to detect a theme. The
first ~30 lines must be a comment block:

```css
/*
Theme Name: Sinaquant Intelligence
Theme URI: https://sinaquant.ai
Author: Sinaquant Team
Author URI: https://sinaquant.ai
Description: Custom theme for the Sinaquant news portal.
Version: 1.0.0
Requires at least: 6.4
Tested up to: 6.6
Requires PHP: 8.1
License: Proprietary
Text Domain: sinaquant
Tags: news, magazine, dark
*/
```

The actual styles come AFTER the comment block. Move
the entire `css/style.css` from the static repo
underneath.

### 3.2 functions.php

```php
<?php
/**
 * Sinaquant theme functions.
 */

// 1. Theme setup
add_action( 'after_setup_theme', function () {
    load_theme_textdomain( 'sinaquant', get_template_directory() . '/languages' );
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'html5', [ 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ] );
    add_theme_support( 'custom-logo' );
    add_theme_support( 'responsive-embeds' );
    add_theme_support( 'align-wide' );

    // Image sizes matching the design
    add_image_size( 'sinaquant-card',    800,  600, true );
    add_image_size( 'sinaquant-feature', 1200, 675, true );
    add_image_size( 'sinaquant-hero',    1920, 1080, true );
});

// 2. Enqueue assets
require_once get_template_directory() . '/inc/enqueue.php';

// 3. Custom post types
require_once get_template_directory() . '/inc/custom-post-types.php';

// 4. Custom taxonomies
require_once get_template_directory() . '/inc/custom-taxonomies.php';

// 5. ACF fields
require_once get_template_directory() . '/inc/acf-fields.php';

// 6. Template tags (helpers)
require_once get_template_directory() . '/inc/template-tags.php';

// 7. Security: disable file edit
define( 'DISALLOW_FILE_EDIT', true );
```

### 3.3 inc/custom-post-types.php

The static site has 3 content shapes that don't fit
WP's default "post":

```php
<?php
add_action( 'init', function () {
    // Articles — long-form Sinaquant reports (story.html)
    register_post_type( 'article', [
        'labels' => [
            'name'          => __( 'Articles',  'sinaquant' ),
            'singular_name' => __( 'Article',   'sinaquant' ),
            'add_new_item'  => __( 'Add New Article', 'sinaquant' ),
        ],
        'public'       => true,
        'has_archive'  => true,
        'menu_icon'    => 'dashicons-media-document',
        'supports'     => [ 'title', 'editor', 'thumbnail', 'excerpt', 'author', 'comments' => false ],
        'rewrite'      => [ 'slug' => 'story' ],   // /story/your-slug/
        'show_in_rest' => true,                     // Gutenberg editor
        'taxonomies'   => [ 'category', 'post_tag' ],
    ] );

    // Tools — AI tools directory (tools.html)
    register_post_type( 'tool', [
        'labels' => [
            'name'          => __( 'AI Tools', 'sinaquant' ),
            'singular_name' => __( 'Tool',     'sinaquant' ),
        ],
        'public'       => true,
        'has_archive'  => 'tools',                  // /tools/
        'menu_icon'    => 'dashicons-admin-tools',
        'supports'     => [ 'title', 'editor', 'thumbnail', 'excerpt' ],
        'rewrite'      => [ 'slug' => 'tools/%tool_category%', 'with_front' => false ],
        'show_in_rest' => true,
        'taxonomies'   => [ 'tool_category' ],
    ] );

    // Research — long-form research (the research-bento on search.html)
    register_post_type( 'research', [
        'labels' => [
            'name' => __( 'Research', 'sinaquant' ),
        ],
        'public'       => true,
        'has_archive'  => 'research',
        'menu_icon'    => 'dashicons-book',
        'supports'     => [ 'title', 'editor', 'thumbnail', 'excerpt' ],
        'show_in_rest' => true,
    ] );
} );
```

### 3.4 inc/custom-taxonomies.php

```php
<?php
add_action( 'init', function () {
    // Topic — the 5 header category tabs (Agentic AI, Research, etc.)
    register_taxonomy( 'topic', [ 'article' ], [
        'labels' => [
            'name' => __( 'Topics', 'sinaquant' ),
            'singular_name' => __( 'Topic', 'sinaquant' ),
        ],
        'hierarchical' => true,
        'public'       => true,
        'rewrite'      => [ 'slug' => 'topic' ],
        'show_in_rest' => true,
    ] );

    // Tool category — Developer / Research / Agentic / etc.
    register_taxonomy( 'tool_category', [ 'tool' ], [
        'labels' => [
            'name' => __( 'Tool Categories', 'sinaquant' ),
        ],
        'hierarchical' => true,
        'public'       => true,
        'rewrite'      => [ 'slug' => 'tools' ],
        'show_in_rest' => true,
    ] );
} );
```

### 3.5 inc/enqueue.php

```php
<?php
add_action( 'wp_enqueue_scripts', function () {
    // Design system + theme styles. style.css from the theme root
    // is automatically registered by WP — just enqueue it.
    wp_enqueue_style(
        'sinaquant-style',
        get_stylesheet_uri(),   // /wp-content/themes/sinaquant/style.css
        [],
        wp_get_theme()->get( 'Version' )
    );

    // Google Fonts (move to self-hosted eventually)
    wp_enqueue_style(
        'sinaquant-fonts',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&family=Sora:wght@500;600;700&display=swap',
        [],
        null
    );

    // Main JS bundle. The horizontal-scroll lock, category
    // filter, Ctrl+K, bookmarks, back-to-top are all in here.
    wp_enqueue_script(
        'sinaquant-main',
        get_template_directory_uri() . '/assets/js/main.js',
        [],
        wp_get_theme()->get( 'Version' ),
        true   // in footer
    );

    // Localize the script with data it needs (REST endpoint,
    // nonce, theme URL). The contact + checkout forms will
    // POST to /wp-json/sinaquant/v1/* and need a nonce.
    wp_localize_script( 'sinaquant-main', 'sinaquantData', [
        'restUrl'  => esc_url_raw( rest_url() ),
        'nonce'    => wp_create_nonce( 'wp_rest' ),
        'siteUrl'  => esc_url_raw( site_url() ),
    ] );
} );
```

---

## 4. Template conversion (day 1-2, 8-12 hours)

### 4.1 header.php

Copy `assets/includes/header.html` from the static
repo, then transform it:

1. **Replace static hrefs** with WP template tags:
   ```php
   <a href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a>
   <a href="<?php echo esc_url( get_permalink( get_option( 'page_for_posts' ) ) ); ?>">News</a>
   ```

2. **Render the primary nav from a menu**, not hardcoded:
   ```php
   <nav class="primary-nav" aria-label="Primary">
       <?php
       wp_nav_menu( [
           'theme_location' => 'primary',
           'container'      => false,
           'menu_class'     => '',
           'fallback_cb'    => false,
           'depth'          => 1,
       ] );
       ?>
   </nav>
   ```

   Register `primary` and `mobile` locations in
   functions.php:
   ```php
   register_nav_menus( [
       'primary' => __( 'Primary Menu', 'sinaquant' ),
       'mobile'  => __( 'Mobile Drawer', 'sinaquant' ),
       'footer'  => __( 'Footer Menu',   'sinaquant' ),
   ] );
   ```

3. **Render the category tabs from the `topic` taxonomy:**
   ```php
   <nav class="category-tabs" aria-label="Topics">
       <div class="container">
           <a href="<?php echo esc_url( get_permalink( get_option('page_for_posts') ) ); ?>" class="is-active">All</a>
           <?php
           $topics = get_terms( [ 'taxonomy' => 'topic', 'hide_empty' => false ] );
           foreach ( $topics as $topic ) : ?>
               <a href="<?php echo esc_url( get_term_link( $topic ) ); ?>">
                   <?php echo esc_html( $topic->name ); ?>
               </a>
           <?php endforeach; ?>
       </div>
   </nav>
   ```

4. **Replace all `data-include` partials with the new
   `header.php` / `footer.php`. Delete `js/includes.js`.
   Delete `assets/includes/`.**

5. **The mobile icon-nav row is hard-coded** in the
   current header. Make it dynamic so WP admins can
   edit it without touching code:
   ```php
   <nav class="mobile-icon-nav">
       <?php
       $mobile_links = [
           [ 'url' => home_url('/'),         'label' => 'Home',    'icon' => 'home' ],
           [ 'url' => get_permalink( get_option('page_for_posts') ), 'label' => 'News', 'icon' => 'news' ],
           // etc
       ];
       foreach ( $mobile_links as $l ) : ?>
           <a class="icon-btn" href="<?php echo esc_url( $l['url'] ); ?>" aria-label="<?php echo esc_attr( $l['label'] ); ?>">
               <!-- SVG inline -->
           </a>
       <?php endforeach; ?>
       <!-- More button stays as is -->
   </nav>
   ```

### 4.2 footer.php

Same approach: copy the static footer, replace
hard-coded links with `home_url()`, copyright year
becomes `date('Y')`, social links come from the
Customizer.

The `id="buildVersion"` span (added for the cache
debug) — **delete it.** No longer needed.

### 4.3 front-page.php (from index.html)

This is the homepage. The hero slider's 5 slides
should come from a "Hero Slides" Custom Post Type or
an ACF repeater field on the homepage. Don't hardcode.

```php
<?php get_header(); ?>

<main id="main">
    <!-- Hero slider: ACF repeater 'hero_slides' -->
    <?php if ( have_rows( 'hero_slides' ) ) : ?>
        <section class="hero-slider">
            <?php $i = 0; while ( have_rows( 'hero_slides' ) ) : the_row(); ?>
                <div class="hero-slider__slide <?php echo $i === 0 ? 'is-active' : ''; ?>">
                    <!-- ... -->
                </div>
            <?php $i++; endwhile; ?>
        </section>
    <?php endif; ?>

    <!-- Just-in ticker: latest 8 articles in 'topic=ticker' or with a flag -->
    <!-- Trending: top 5 by views (Jetpack Stats or a custom counter) -->
    <!-- Latest briefings: 6 latest 'article' CPT posts -->
    <!-- Featured research: 3 latest 'research' CPT posts -->
    <!-- Newsletter CTA: ACF field for the form shortcode -->
</main>

<?php get_footer(); ?>
```

The same `esc_html()`, `esc_url()`, `esc_attr()` rules
apply to every echoed value. **Never** use `echo $post->post_title`
without escaping.

### 4.4 single.php (from story.html)

The article template. Replace hard-coded content with
the Loop:

```php
<?php get_header(); ?>

<main id="main">
<?php while ( have_posts() ) : the_post(); ?>

    <article class="article">
        <header class="article-header">
            <h1 class="article-title"><?php the_title(); ?></h1>
            <div class="article-meta">
                <span class="article-date"><?php echo esc_html( get_the_date() ); ?></span>
                <span class="article-reading-time"><?php echo esc_html( sinaquant_reading_time() ); ?> min read</span>
            </div>
        </header>

        <?php if ( has_post_thumbnail() ) : ?>
            <figure class="article-hero">
                <?php the_post_thumbnail( 'sinaquant-hero' ); ?>
            </figure>
        <?php endif; ?>

        <div class="article-content">
            <?php
            the_content();
            ?>
        </div>

        <!-- Share rail + bookmark button (rendered in template-tags.php) -->
        <?php sinaquant_share_rail(); ?>

        <!-- JSON-LD structured data for Google News -->
        <script type="application/ld+json">
        <?php echo wp_json_encode( sinaquant_article_schema( get_the_ID() ) ); ?>
        </script>

    </article>

<?php endwhile; ?>
</main>

<?php get_footer(); ?>
```

### 4.5 The category filter on news.html

The current static version uses `?cat=...` query strings
and JS to filter cards. **In WordPress this becomes free
out of the box** because:

- The header category tabs link to `/topic/agentic-ai/`
  (a real taxonomy term archive).
- WordPress auto-filters posts by the current term.
- `category.php` (or `taxonomy-topic.php`) renders only
  matching posts.

You can **delete** `js/main.js` section 18 entirely.
WP handles filtering server-side. URL changes from
`?cat=agentic-ai` to `/topic/agentic-ai/`.

### 4.6 The 13 other templates

For each static HTML file:

1. Copy the body markup into the corresponding PHP
   template
2. Replace every hard-coded value with a WP function
   (the Loop, get_the_title, the_content, get_the_author,
   get_the_post_thumbnail, get_term_link, etc.)
3. Escape every echo: `esc_html`, `esc_url`, `esc_attr`
4. Replace the search form HTML with `get_search_form()`
5. Replace the comment form (if any) with `comment_form()`

---

## 5. Forms → REST endpoints (day 2-3, 6-8 hours)

The static `contact.html` and `checkout.html` use
front-end-only `setTimeout` handlers. In WP these
become real REST endpoints.

### 5.1 Contact form

Add to `inc/enqueue.php` or a new `inc/rest.php`:

```php
add_action( 'rest_api_init', function () {
    register_rest_route( 'sinaquant/v1', '/contact', [
        'methods'             => 'POST',
        'permission_callback' => function () {
            // Anonymous is OK; rate-limit + captcha below
            return true;
        },
        'args' => [
            'name'    => [ 'type' => 'string', 'required' => true,  'sanitize_callback' => 'sanitize_text_field' ],
            'email'   => [ 'type' => 'string', 'required' => true,  'format' => 'email', 'sanitize_callback' => 'sanitize_email' ],
            'company' => [ 'type' => 'string', 'required' => false, 'sanitize_callback' => 'sanitize_text_field' ],
            'message' => [ 'type' => 'string', 'required' => true,  'sanitize_callback' => 'sanitize_textarea_field' ],
        ],
        'callback' => function ( WP_REST_Request $req ) {
            // 1. Verify nonce
            $nonce = $req->get_header( 'x_wp_nonce' );
            if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
                return new WP_Error( 'forbidden', 'Invalid nonce', [ 'status' => 403 ] );
            }

            // 2. Verify captcha (hCaptcha / Turnstile)
            // ... verify $req->get_param('h-captcha-response') ...

            // 3. Sanitize (already done by sanitize_callback in args)
            $data = [
                'name'    => $req->get_param( 'name' ),
                'email'   => $req->get_param( 'email' ),
                'company' => $req->get_param( 'company' ),
                'message' => $req->get_param( 'message' ),
            ];

            // 4. Persist (option A: save as 'contact_submission' CPT)
            $post_id = wp_insert_post( [
                'post_type'    => 'contact_submission',
                'post_status'  => 'private',
                'post_title'   => sprintf( '%s <%s>', $data['name'], $data['email'] ),
                'post_content' => $data['message'],
            ] );

            // 5. Email notification to admin
            wp_mail(
                get_option( 'admin_email' ),
                sprintf( '[Sinaquant] New contact from %s', $data['name'] ),
                sprintf( "Name: %s\nEmail: %s\nCompany: %s\n\n%s",
                    $data['name'], $data['email'], $data['company'], $data['message'] )
            );

            return [ 'ok' => true, 'id' => $post_id ];
        },
    ] );
} );
```

### 5.2 Checkout form

Same shape but `permission_callback` requires
`current_user_can( 'manage_options' )` OR uses a
"Request Access" model where the submission is
emailed to sales@. Wire to your CRM (HubSpot,
Salesforce) via webhook from `wp_mail()`.

### 5.3 Front-end JS update

In `js/main.js` (or split into a `forms.js` file),
replace the `setTimeout` with a real `fetch`:

```js
async function postForm(form, endpoint) {
  const data = Object.fromEntries(new FormData(form));
  const res = await fetch(sinaquantData.restUrl + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': sinaquantData.nonce,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Submit failed');
  return res.json();
}
```

---

## 6. Content migration (day 3-4, 4-6 hours)

The static site has 9 sample articles. Move them to
WP:

**Option A: Manual** — Create 9 'article' posts in
WP admin. Copy the title, body, hero image. Re-upload
images to the Media Library (don't hotlink Unsplash
in production — download and re-upload).

**Option B: WP-CLI + CSV** — Build a CSV of the 9
articles, then:
```bash
wp post create --post_type=article \
  --post_title="The Sovereign Agent" \
  --post_status=publish \
  --post_content="$(cat article-1.html)"
```

**Option C: WP All Import** — Best for ongoing
imports (e.g. from an external API). $99 plugin.

For the 8 sample tools, repeat with `post_type=tool`
and assign `tool_category` terms.

For the 1 sample author: WP has a built-in user system.
Don't create a custom CPT for authors. Use the
default `user` table + `author.php` template.

---

## 7. Security hardening (day 4, 3-4 hours)

The full checklist is in `SECURITY.md` §2. Top
priorities for first deploy:

1. **Force HTTPS** + HSTS preload.
2. **Real HTTP security headers** via `.htaccess`:
   ```apache
   <IfModule mod_headers.c>
       Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
       Header always set X-Content-Type-Options "nosniff"
       Header always set X-Frame-Options "SAMEORIGIN"
       Header always set Referrer-Policy "strict-origin-when-cross-origin"
       Header always set Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=()"
   </IfModule>
   ```
3. **CSP with per-request nonce** — use the
   "CSP-Header" plugin or custom `script_loader_tag`
   filter.
4. **Self-host Google Fonts** — drop the `fonts.googleapis.com`
   / `fonts.gstatic.com` external requests. Download
   the WOFF2 files, put them in
   `assets/fonts/`, register in `functions.php`:
   ```php
   add_action( 'wp_enqueue_scripts', function () {
       wp_enqueue_style( 'sinaquant-fonts',
           get_template_directory_uri() . '/assets/fonts/fonts.css', [], null );
   }, 20 );  // after the theme style
   ```
5. **Captcha on contact form** — hCaptcha or
   Cloudflare Turnstile. Free, no Google tracking.
6. **Rate-limit contact + checkout** — use a transient
   keyed on IP, reject if last submission < 60s ago.
7. **Disable file editing** in `wp-config.php`:
   ```php
   define( 'DISALLOW_FILE_EDIT', true );
   ```
8. **Lock `/wp-admin/`** — IP allowlist + 2FA + limit
   login attempts (Wordfence or Solid Security plugin).
9. **Disable XML-RPC** unless you need Jetpack:
   ```php
   add_filter( 'xmlrpc_enabled', '__return_false' );
   ```
10. **Daily backups** with off-site storage (your
    host's snapshot + UpdraftPlus to S3).

---

## 8. SEO + performance (day 4-5, 4-6 hours)

1. **Install Yoast SEO or Rank Math** — generates
   `<title>`, meta description, Open Graph, Twitter
   Cards, JSON-LD automatically.
2. **JSON-LD `NewsArticle` schema on every article.**
   Critical for Google News indexing. Sample in
   `inc/template-tags.php`:
   ```php
   function sinaquant_article_schema( $post_id ) {
       $post = get_post( $post_id );
       return [
           '@context'      => 'https://schema.org',
           '@type'         => 'NewsArticle',
           'headline'      => get_the_title( $post ),
           'datePublished' => get_the_date( 'c', $post ),
           'dateModified'  => get_the_modified_date( 'c', $post ),
           'author'        => [
               '@type' => 'Person',
               'name'  => get_the_author_meta( 'display_name', $post->post_author ),
           ],
           'publisher'     => [
               '@type' => 'Organization',
               'name'  => 'Sinaquant',
               'logo'  => [ '@type' => 'ImageObject', 'url' => get_site_icon_url() ],
           ],
           'image'         => get_the_post_thumbnail_url( $post, 'full' ),
           'description'   => wp_strip_all_tags( $post->post_excerpt ),
       ];
   }
   ```
3. **Sitemap** — Yoast generates `/sitemap.xml`.
   Submit to Google Search Console.
4. **Performance**:
   - Install a caching plugin: WP Rocket (paid,
     best) or LiteSpeed Cache (free, on LiteSpeed
     servers) or W3 Total Cache (free, harder to
     configure).
   - Self-host fonts (covered above).
   - Convert hero images to WebP (use the
     "ShortPixel" or "Imagify" plugin).
   - Lazy-load images below the fold (already in
     the static HTML via `loading="lazy"`).
5. **CDN** — Cloudflare free tier is enough. Set
   up at the DNS level.

---

## 9. Recommended plugins (the minimum viable set)

| Plugin | Why | Cost |
|---|---|---|
| **ACF Pro** | Custom fields for hero slides, tool metadata, etc. | $49/yr (one-time per site) |
| **Yoast SEO** or Rank Math | Meta tags, sitemaps, schema | Free / Freemium |
| **WP Rocket** | Page caching, JS/CSS minification | $59/yr |
| **Wordfence** | Firewall, 2FA, malware scan | Free / Premium |
| **UpdraftPlus** | Automated backups to S3/Drive | Free / Premium |
| **hCaptcha** or **Cloudflare Turnstile** | Spam protection on forms | Free |
| **Redirection** | 301 redirects from old static URLs to new WP URLs | Free |
| **Health Check** | Diagnose plugin conflicts during dev | Free |

**Avoid**: Jetpack (bloat), Elementor (overkill if
your theme already has the design baked in),
Wordfence's premium tier if Cloudflare WAF is
configured.

---

## 10. The big gotchas (things that bite everyone)

1. **The `data-include` partials won't load on `file://`**.
   The static preview works around this with a Python
   server. WordPress sidesteps the issue entirely with
   PHP. Delete `js/includes.js` and `assets/includes/`
   on day 1.

2. **The `news.html?cat=...` query strings stop working**.
   The new URLs are `/topic/agentic-ai/`. Set up 301
   redirects in the Redirection plugin so old bookmarks
   don't 404. For the static preview, the 9 cards
   have `data-cat` attributes that the JS filter uses;
   in WP this becomes real server-side filtering.

3. **The featured story card uses inline `grid-column: span 2`**.
   In WP, set this via CSS using `.story-card--featured`
   on the first post in a query, not via inline style.
   Inline styles are an XSS surface in WP if you ever
   let editors paste HTML.

4. **The hero slider's auto-rotate is fragile on iOS
   Safari** if you ever switch from CSS animation to
   JS-driven transforms. Keep the CSS animation.

5. **The mobile drawer uses `body.is-locked`** to
   prevent scroll. Make sure your theme's main
   content also respects `body.is-locked { overflow:
   hidden }`. The static CSS already does.

6. **Custom URLs in `wp-admin`** — go to Settings →
   Permalinks after every theme activation and click
   "Save Changes" to flush rewrite rules. The
   `/story/your-slug/` and `/tools/` slugs won't
   work until you do.

7. **The `data-cat` attributes on the static news
   cards don't transfer to WP** — they were demo
   data. In WP, the filter is done server-side by the
   `topic` taxonomy. The JS in `main.js` section 18
   can be deleted.

8. **Image alt text in the static site is generic**
   (uses the stock photo description). When you
   re-upload images in WP, write proper alt text —
   the screenshot description isn't useful to a
   screen reader or to Google.

---

## 11. Smoke test before launch

On the staging environment, run through this 10-point
checklist:

- [ ] All 14 static pages have a corresponding WP
      template that renders without errors
- [ ] The header, footer, and mobile drawer load on
      every page (not just the homepage)
- [ ] The category tabs in the header link to
      real term archives
- [ ] The hero slider auto-rotates and the
      pause-on-hover works
- [ ] The contact form submits, persists a
      `contact_submission` post, and emails the admin
- [ ] The checkout form's 3 steps navigate and the
      final submit calls the REST endpoint
- [ ] The search overlay opens via the icon AND via
      `Ctrl+K` / `Cmd+K` / `/`
- [ ] The mobile icon-nav bar shows on phone viewports
      and the page does not move horizontally
- [ ] The back-to-top button appears after 600px scroll
- [ ] No console errors on any page
      (Chrome DevTools → Console)

Then:

- [ ] PageSpeed Insights score ≥ 90 on mobile
- [ ] Google Search Console accepts the sitemap
- [ ] SSL Labs A or A+ rating
- [ ] Security Headers.com A or A+ rating
- [ ] Manual: visit every page on iPhone Safari
      AND Google Pixel Chrome

When all 15 are green, push staging → production.

---

## 12. Time / cost summary

| Phase | Effort | When |
|---|---|---|
| Hosting setup + WP install | 2-3 h | Day 0 |
| Theme scaffold (file structure) | 4-6 h | Day 1 |
| Template conversion (14 files) | 8-12 h | Day 1-2 |
| Forms → REST endpoints | 6-8 h | Day 2-3 |
| Content migration (9 articles, 8 tools) | 4-6 h | Day 3-4 |
| Security hardening | 3-4 h | Day 4 |
| SEO + performance | 4-6 h | Day 4-5 |
| **Total** | **31-45 h** | **5 working days** |

If you're a beginner: 7-10 days. If you've shipped a
WP theme before: 3-4 days.

Out-of-pocket costs (rough):

| Item | Cost |
|---|---|
| Managed WP hosting | $15-30/mo |
| Domain renewal | $12/yr |
| ACF Pro | $49/yr (one site) |
| WP Rocket | $59/yr |
| Premium theme? | $0 (custom) |
| **Year 1** | **~$400-500 + your time** |

---

## 13. What's intentionally NOT in this plan

- **Multilingual** — if you want English + Arabic, add
  WPML or Polylang ($79/yr for WPML). Adds 2-3 days.
- **Membership / paywall** — if you want a "Subscribe
  to read" model, add MemberPress or Restrict Content
  Pro. Adds 1-2 days. The pricing page already
  has the UI; the backend is what takes time.
- **Comments** — the static site has no comments. To
  enable: `Settings → Discussion`. To moderate at
  scale: add Akismet ($8/mo).
- **Search improvements** — default WP search is OK.
  For "search by relevance, faceted, with autocomplete",
  add Algolia or SearchWP ($99-$249/yr).
- **Email newsletter** — the static forms submit to
  nowhere. Real newsletter = MailPoet, ConvertKit,
  or Mailchimp integration. Out of scope here.

---

## 14. Where to go from here

1. **Today**: pick a host, set up a staging environment,
   do a fresh WP install.
2. **Day 1**: copy the static CSS + JS into the theme
   scaffold (don't touch the markup yet), prove the
   design renders inside WP.
3. **Day 2-3**: convert the templates one at a time.
   Start with the simplest (404.php, page.php), end
   with the most complex (single.php, front-page.php).
4. **Day 4**: cut over the forms to real REST endpoints.
5. **Day 5**: security + SEO + performance pass.
6. **Day 6**: push to production, submit sitemap to
   Google, monitor for 7 days.

When you're done, retire the GitHub Pages static preview
(or keep it as a "design system reference" linking to
the live WP site).
