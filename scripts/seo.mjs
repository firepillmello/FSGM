import { writeFileSync, readFileSync } from 'node:fs';
const url = new URL(process.env.SITE_URL || 'https://firepillmello.github.io/FSGM/');
if (!url.pathname.endsWith('/')) url.pathname += '/';
// Hash routes are browser routes, not independently indexable HTTP documents.
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${url.href}</loc></url></urlset>`);
writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${url.href}sitemap.xml\n`);
const schema = { '@context': 'https://schema.org', '@type': 'Organization', name: 'FSGM Advisory', description: 'Federal and state grant fiscal management and advisory services.', url: url.href, areaServed: { '@type': 'AdministrativeArea', name: 'Pennsylvania, United States' } };
const html = readFileSync('dist/index.html', 'utf8').replace('</head>', `<link rel="canonical" href="${url.href}"/><meta property="og:url" content="${url.href}"/><script type="application/ld+json">${JSON.stringify(schema)}</script></head>`);
writeFileSync('dist/index.html', html);
writeFileSync('dist/404.html', html);
