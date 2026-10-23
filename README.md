# FSGM Advisory

A responsive, static React + TypeScript advisory website, built with Vite, Tailwind CSS, Lucide, and React Router. Uses one organized home-page journey, six unique educational articles, resource search/category filtering, and a validated preview contact form.

## Develop

Use Node.js 22.12+ (Node 24 also works).

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Default local project path: `/FSGM/`. Navigation uses hash routes, so article links and browser refreshes work on GitHub Pages without a server rewrite. No database or credentials are required. Fonts are self-hosted through Fontsource packages under their included open font licenses, with system fallbacks. Architectural and document illustrations are original CSS; favicon is original SVG. No third-party photography is embedded.

## Edit

- `src/content.ts`: verified business information, contact channels, scheduling URL, navigation, services, industries, and articles. Blank contact values remain hidden. Do not invent credentials, biographies, or contact details.
- `src/main.tsx`: home sections, navigation, inline disclosures, article routes, form behavior, and metadata.
- `src/ServicesRail.tsx`: horizontal service rail, pause/play and arrow controls, selected service details, and contact handoff.
- `src/styles.css`: base layout and component styles.
- `src/premium.css`: glass surfaces, fine texture, refined typography and spacing, responsive refinements, and reduced-transparency support.
- `src/organization.css`: section navigation, service dropdown, responsive rail, and inline detail layouts.
- `public/brandmark.svg`: original FSGM letter-art mark.
- `public/favicon.svg`: matching high-contrast favicon.

The form defaults to **preview mode**: entries are validated in-browser and are never sent or saved. To activate production inquiries, configure `site.formEndpoint` with a real HTTPS form service accepting multipart POST and JSON responses, confirm its CORS/spam protection and privacy terms, update the privacy copy, and test delivery. Set `site.schedulingUrl` only to a verified scheduling link. Do not request sensitive documents in this public form.

## GitHub Pages

The website is maintained in `firepillmello/FSGM` on `main`.

1. In repository **Settings → Pages → Build and deployment**, select **GitHub Actions**.
2. Open Actions and monitor **Deploy FSGM Advisory to GitHub Pages**. It runs on every push to `main` or manually.
3. Open the URL reported by the successful deployment: the expected project URL is `https://firepillmello.github.io/FSGM/`.

A successful push is not proof that Pages deployment has completed. Check the deployment job before claiming a new version is live.

The workflow derives `BASE_PATH` and `SITE_URL` from the repository identity, so a future repository rename does not require hardcoded deployment changes.

For a manual build targeting an alternative repository name:

```sh
BASE_PATH=/fsgm-advisory-website/ SITE_URL=https://firepillmello.github.io/fsgm-advisory-website/ npm run build
```

For custom domains set `BASE_PATH=/` and `SITE_URL` to the verified domain; configure DNS and Pages separately. Build output is `dist/`. Runtime processes are not needed on GitHub Pages.

## Validation

```sh
npm run build
npx playwright install chromium
npm test
# Or use a preinstalled Chromium:
CHROMIUM_PATH=/usr/bin/chromium npm test
```

Browser tests cover same-page navigation, dropdown selection, inline service details, horizontal scrolling and automatic animation, article deep links, expanded resource filters, legacy redirects, contact validation, preserved form entries, mobile navigation, keyboard access, and reduced-motion support. Responsive checks cover 14 widths from 320px to 1920px. Offscreen service cards are intentionally clipped within their own horizontal rail; the document must not overflow. Tests start a Vite server automatically. No private data is used.

## Navigation and content organization

The primary navigation scrolls to `#top`, `#about`, `#services`, `#who-we-serve`, `#resources`, and `#contact` within the existing home page. With the hash router, a section URL looks like `/FSGM/#/#services`; a selected service looks like `/FSGM/#/#service-0`. Old `/about`, `/services`, `/who-we-serve`, `/resources`, and `/contact` hash routes redirect to those sections, including existing numbered service links.

The opening buttons are **Explore Our Services** and **About Us**. Service summaries open one inline detail panel. About and industry details use native expandable disclosures. Resources initially show three articles; **Explore more resources** reveals the full library and filters. Only full articles have separate reading routes because their content is unique. Inquiry links consistently say **Discuss your needs**, and a selected service is carried into the contact form.

The service rail advances every seven seconds only while visible, with no selected detail and no hover or keyboard focus inside it. Pause/play, previous/next arrows, native horizontal scrolling, keyboard arrows, and touch swiping are available. Manual interaction pauses automatic movement. Reduced-motion preferences disable automatic movement and smooth rail scrolling.


## Search indexing

Each route updates its browser title, description, and Open Graph fields. `scripts/seo.mjs` generates Organization schema, canonical metadata, robots.txt, and a sitemap containing the root HTTP document. Hash routes are reliable on Pages but are not separately indexable documents, and social crawlers typically see the root metadata. For full article-level SEO and social previews, a future prerendered or multi-page implementation is recommended. GitHub project `robots.txt` is provided as an artifact; only a host-root robots file controls all crawling.

No analytics, fake testimonials, fabricated qualifications, or claims of government affiliation are included.
