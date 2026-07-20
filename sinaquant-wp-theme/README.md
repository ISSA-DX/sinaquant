# Sinaquant WordPress Theme

A minimal, AI-news-ready WordPress theme ported from the static Sinaquant site.

## Features

- Hero slider with the Sinaquant intro video + 5 featured image slides
- Living neural-network canvas background
- Scroll-triggered card reveals and hover interactions (from `assets/js/main.js`)
- Responsive header, mobile drawer, search overlay and newsletter modal
- WordPress nav menu locations: Primary, Category Tabs, Mobile Drawer, Footer Network
- Template parts for story cards, single posts, pages and no-results
- Sticky post support and pagination

## Install locally (no domain required)

1. Install [LocalWP](https://localwp.com) (free) and create a new WordPress site.
2. In LocalWP, open the site folder and navigate to `app/public/wp-content/themes/`.
3. Copy this entire `sinaquant-wp-theme` folder into `wp-content/themes/`.
4. In WordPress admin, go to **Appearance → Themes** and activate **Sinaquant**.
5. Go to **Appearance → Menus** and create menus assigned to the theme locations.
6. Create a few posts with featured images to populate the grids.

## Required shortcode

The header, footer and front page reference a newsletter shortcode:

```
[sinaquant_newsletter_form]
[sinaquant_newsletter_form compact="true"]
```

Install any form plugin (e.g. WPForms, Fluent Forms, Mailchimp for WP) and register this shortcode in a small plugin or the theme's `functions.php`.

## Moving to the client's live WordPress

When the client provides their hosting/domain:

1. Export the local site with a migration plugin (All-in-One WP Migration, Duplicator, etc.).
2. Import into the client's WordPress installation.
3. Reactivate the Sinaquant theme after import.
4. Re-save permalinks (**Settings → Permalinks → Save Changes**).

## Theme structure

- `style.css` — Theme header only; actual CSS is in `assets/css/style.css`.
- `functions.php` — Theme setup, image sizes, nav menus and script enqueues.
- `header.php` / `footer.php` — Site wrapper, nav, canvas background, overlays.
- `front-page.php` — Homepage with video carousel, ticker, featured grid and newsletter.
- `page.php`, `single.php`, `archive.php`, `search.php`, `404.php` — Core templates.
- `template-parts/` — Reusable content partials.
- `inc/` — Template tags and Customizer setup.
- `assets/` — CSS, JS, images, favicon and intro video.
- `screenshot.png` — Theme screenshot (taken from the intro poster).

## Credits

Built by Sinaquant / Claude Code.
