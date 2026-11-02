# FSGM Advisory

React, TypeScript, Vite, Tailwind, and Lucide. An organized home page, six educational articles, accessible dropdowns, and locally hosted images/fonts. Published from `firepillmello/FSGM` to **https://fsgmadvisory.com/**.

## Business settings and future logo changes

Edit **`site.config.json`** for the domain, logo paths, address, public email, phone, and optional scheduling URL. These settings are shared by the app and production metadata.

To change the logo later:

1. Add the replacement image to `public/images/`.
2. Set `logo.src` to its path relative to `public/`, for example `images/logo-v2.png`.
3. Build and push. The header, footer, favicon, and Organization logo metadata update from the same setting. A new filename also avoids stale favicon caches. `logo.darkSrc` optionally supplies a separate image for the dark footer; otherwise the main logo is displayed on a white plate.

The current logo is a web-ready monogram adaptation of the user-supplied navy/gold FSGM logo, with the business name typeset alongside it. The logo can be replaced without changing the component.

The provided public address is **2123 West Main Street, Norristown, PA 19403, USA**. It appears in contact, footer, and PostalAddress metadata. Do not invent contact details, qualifications, or government affiliations.

## Email inquiries

The owner selected **email drafts** and deferred the public email address. While `email` is empty, contact shows the address and a clear coming-soon message. There is no demo submission or nonfunctional send button.

When ready, set `email` in `site.config.json` to the real public business email. The contact form then enables automatically:

- Visitors complete and validate the form, then choose **Prepare email draft**.
- **Open email draft** opens their email app with the recipient, subject, and message filled in.
- They review and send from that app. The website itself does not send or store messages and requires no backend, form-service account, or API key.

The browser must have an email application configured. The business email is also shown as a normal email link. No sensitive grant documents should be entered in the public form.

## Local development and validation

Use Node.js 22.12+ or Node 24.

```sh
npm ci
npm run dev
npm run build
npm run preview
npx playwright install chromium
npm test
npm run test:production
```

The default development and production base is **`/`**, matching the custom domain. `npm run build` checks TypeScript, generates `dist/`, and writes canonical/Open Graph/Organization metadata, sitemap, robots, and a 404 fallback. `public/CNAME` is copied to `dist/CNAME`.

With preinstalled Chromium:

```sh
CHROMIUM_PATH=/usr/bin/chromium npm test
CHROMIUM_PATH=/usr/bin/chromium npm run test:production
```

The first suite checks navigation, disclosures, resources, email-draft behavior, keyboard access, reduced motion, reading sizes, and responsive layouts at 14 widths from 320px to 1920px. The production suite serves the built output and checks root asset URLs, logo loading, canonical metadata, CNAME, sitemap/robots, address, and phone/desktop layouts. The email-enabled test uses a browser-only test address; it does not send email or change saved settings.

## Deployment to fsgmadvisory.com

`.github/workflows/deploy.yml` runs on pushes to `main` or manually. It installs locked dependencies and Chromium, builds, runs both test suites, and deploys the `dist` artifact to GitHub Pages only after checks pass.

The repository's Pages custom domain should remain `fsgmadvisory.com` with GitHub Actions as the deployment source. The owner has configured the domain separately. The build uses `site.config.json` for the production URL and root base rather than the old `/FSGM/` project path. Publishing code does not change DNS or issue an HTTPS certificate; GitHub Pages manages those using the configured domain settings.

After pushing, inspect the Actions deployment result and the live domain. A successful local build or push alone does not establish that the deployment or live HTTPS check succeeded.

Optional `BASE_PATH` and `SITE_URL` environment variables can override the build for a separate preview target. Production CI deliberately does not override the configured custom domain.

## Content and design

- `src/content.ts`: services, audiences, articles, navigation, and resource topics; imports shared business settings.
- `src/main.tsx`: home sections, accessible dropdowns, article routes, logo rendering, and email form.
- `src/emailDraft.ts`: validates the configured recipient and safely builds the mailto link.
- `src/ServicesRail.tsx`: manual swipe/arrow browsing and inline service details.
- `src/site.css`: one design system, brochure palette, responsive layouts, larger text, and focus/hover styles.
- `src/PageFlow.tsx`: one-time, transform-only entrances; no text is hidden, and reduced-motion preferences cancel animations.
- `scripts/seo.mjs`: metadata using the shared domain, logo, and address.

The brochure colors are navy `#082C45`, teal `#176276`, deep teal `#0B3E52`, gold `#D6B76D`, and warm white `#FCFBF7`. Primary reading text is at least 18px. About Us explains community purpose and the Fiscal Director perspective; audience categories live in Who We Serve. See `ASSETS.md` for image/font provenance.

## Routes and search indexing

Main navigation scrolls within the home page. Examples: `https://fsgmadvisory.com/#/#services` and `https://fsgmadvisory.com/#/#service-0`. Service and audience selections expand existing sections. Resources topics filter the existing resource center. Only full articles have separate reading routes. Old page hash routes redirect to their corresponding sections. Services have no playback or automatic movement.

Hash routing makes deep links and refreshes reliable on static GitHub Pages. Titles and descriptions update in the browser, but hash routes are not independently indexable HTTP documents, and social crawlers generally see root metadata. The sitemap therefore lists the root HTTP document. Full article-level search/social metadata would require a future prerendered or multi-page approach.

No analytics, marketing trackers, fake testimonials, invented credentials, or claims of government affiliation are included.
