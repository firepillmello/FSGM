import { writeFileSync, readFileSync, existsSync } from "node:fs";
const site = JSON.parse(
  readFileSync(new URL("../site.config.json", import.meta.url), "utf8"),
);
const url = new URL(process.env.SITE_URL || site.url);
if (url.protocol !== "https:") throw new Error("SITE_URL must use HTTPS.");
if (!url.pathname.endsWith("/")) url.pathname += "/";
if (!existsSync(`dist/${site.logo.src}`))
  throw new Error("Configured logo asset is missing.");
// Hash routes are browser routes, not independently indexable HTTP documents.
writeFileSync(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${url.href}</loc></url></urlset>`,
);
writeFileSync(
  "dist/robots.txt",
  `User-agent: *\nAllow: /\nSitemap: ${url.href}sitemap.xml\n`,
);
const { countryName, ...postalAddress } = site.address;
const schema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  description:
    "Federal and state grant fiscal management and advisory services.",
  url: url.href,
  logo: new URL(site.logo.src, url).href,
  address: { "@type": "PostalAddress", ...postalAddress },
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Pennsylvania, United States",
  },
  ...(site.email ? { email: site.email } : {}),
  ...(site.phone ? { telephone: site.phone } : {}),
};
const html = readFileSync("dist/index.html", "utf8").replace(
  "</head>",
  `<link rel="canonical" href="${url.href}"/><meta property="og:url" content="${url.href}"/><meta property="og:image" content="${new URL("images/community-river.webp", url).href}"/><script type="application/ld+json">${JSON.stringify(schema)}</script></head>`,
);
writeFileSync("dist/index.html", html);
writeFileSync("dist/404.html", html);
