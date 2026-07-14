# Sinaquant Intelligence — Static Preview

Static HTML/CSS/JS preview of the Sinaquant news portal.
Built from the Stitch designs in `stitch_sinaquant_ai_news_portal/`.

The destination is WordPress; this repo is the static
preview you can host on GitHub Pages for review and
stakeholder demos.

## Pages (14 total)

| URL | Purpose |
|---|---|
| `/` | Homepage — hero, trending, latest briefings, featured research, terminal CTA |
| `/news.html` | News index — the full Sinaquant news archive |
| `/story.html` | Single article — long-form Sinaquant report |
| `/tools.html` | AI tools directory |
| `/about.html` | About Sinaquant |
| `/contact.html` | Contact form |
| `/pricing.html` | Three-tier pricing (Starter / Pro / Enterprise) |
| `/checkout.html` | Multi-step enterprise signup |
| `/dashboard.html` | Terminal dashboard (gated) |
| `/navigation.html` | Megamenu / sitemap |
| `/author.html` | Author profile |
| `/category.html` | Topic feed (Agentic AI) |
| `/search.html` | Search results |
| `/404.html` | Not found |

## Run locally

Open `index.html` in a browser — that's it. No build step.

The only runtime fetch is `assets/includes/header.html` and
`assets/includes/footer.html`, loaded by `js/includes.js`.
If you open the file as `file://`, modern browsers block
`fetch()` on local files, so use a quick static server:

```bash
# Python 3
python -m http.server 8000

# Or Node
npx http-server -p 8000
```

Then visit http://localhost:8000.

## Security

See [`SECURITY.md`](./SECURITY.md) for the threat model,
the static-build hardening that was applied, and the
WordPress conversion checklist.

## Stack

- Plain HTML5, CSS3, vanilla ES2017 JS — no framework, no
  build step, no dependencies.
- Design system uses Void / Navy / Steel / Electric /
  Sky / Cyan / Ice / Slate (see `css/style.css`).
- Single CSS file (`css/style.css`, ~2,460 lines), one JS
  bundle (`js/main.js`, ~960 lines) plus the include loader
  (`js/includes.js`).

## WordPress conversion

When this gets ported, the goal is `header.php` /
`footer.php` shipping the markup directly so the include
loader becomes a no-op. See `SECURITY.md` §2 for the
must-do list.
