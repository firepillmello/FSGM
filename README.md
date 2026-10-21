# FSGM Advisory

A responsive, static React + TypeScript advisory website, built with Vite, Tailwind CSS, Lucide, and React Router. Includes six main pages, six educational articles, resource search/category filtering, and a validated preview contact form.

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
- `src/main.tsx`: reusable components, pages, form behavior, route metadata.
- `src/styles.css`: responsive design, palette, typography, reduced-motion behavior.
- `public/favicon.svg`: original brand mark.

The form defaults to **preview mode**: entries are validated in-browser and are never sent or saved. To activate production inquiries, configure `site.formEndpoint` with a real HTTPS form service accepting multipart POST and JSON responses, confirm its CORS/spam protection and privacy terms, update the privacy copy, and test delivery. Set `site.schedulingUrl` only to a verified scheduling link. Do not request sensitive documents in this public form.

## GitHub Pages

The supplied checkout remote is `firepillmello/FSGM`. The requested new repository name is `fsgm-advisory-website`; this project does not rename or create remote repositories automatically.

1. Push the project to `main` in the chosen GitHub repository.
   If using the requested new repository, create `firepillmello/fsgm-advisory-website` in GitHub first, then run from this checkout:

   ```sh
   git remote add advisory https://github.com/firepillmello/fsgm-advisory-website.git
   git push advisory main
   ```

2. In repository **Settings → Pages → Build and deployment**, select **GitHub Actions**.
3. Open Actions and monitor **Deploy FSGM Advisory to GitHub Pages**. It runs on every push to `main` or manually.
4. Open the URL reported by the successful deployment.

The workflow derives both `BASE_PATH` and `SITE_URL` from the repository identity. It therefore supports either:

- Current repository: `https://firepillmello.github.io/FSGM/`
- Requested name, if created/renamed under the same owner: `https://firepillmello.github.io/fsgm-advisory-website/`

These are expected URLs, not claims of a live deployment. For a manual build targeting the requested name:

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

Browser tests cover navigation, resource filtering, article deep links and refresh, form validation and transparent demo confirmation, mobile menu, overflow, and missing pages. Tests start a Vite server automatically. No private data is used.

## Search indexing

Each route updates its browser title, description, and Open Graph fields. `scripts/seo.mjs` generates Organization schema, canonical metadata, robots.txt, and a sitemap containing the root HTTP document. Hash routes are reliable on Pages but are not separately indexable documents, and social crawlers typically see the root metadata. For full article-level SEO and social previews, a future prerendered or multi-page implementation is recommended. GitHub project `robots.txt` is provided as an artifact; only a host-root robots file controls all crawling.

No analytics, fake testimonials, fabricated qualifications, or claims of government affiliation are included.
