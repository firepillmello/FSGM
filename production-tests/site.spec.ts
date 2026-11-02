import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
const configuredSite = JSON.parse(readFileSync("site.config.json", "utf8"));

test("custom-domain build has root assets, branded metadata, and provided address", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Every Grant",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://fsgmadvisory.com/",
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "https://fsgmadvisory.com/",
  );
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
    "href",
    `/${configuredSite.logo.src}`,
  );
  await expect(page.locator("header .logo img")).toBeVisible();
  const organization = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent()) ||
      "{}",
  );
  expect(organization.address).toMatchObject({
    streetAddress: "2123 West Main Street",
    addressLocality: "Norristown",
    addressRegion: "PA",
    postalCode: "19403",
    addressCountry: "US",
  });
  expect(organization.url).toBe("https://fsgmadvisory.com/");
  expect(readFileSync("dist/CNAME", "utf8").trim()).toBe("fsgmadvisory.com");
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain("https://fsgmadvisory.com/sitemap.xml");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain(
    "<loc>https://fsgmadvisory.com/</loc>",
  );
  await page.locator("img").evaluateAll(async (images) => {
    for (const image of images) image.loading = "eager";
    await Promise.all(images.map((image) => image.decode()));
  });
  expect(errors).toEqual([]);
  expect(
    await page
      .locator('script[src],link[rel="stylesheet"]')
      .evaluateAll((elements) =>
        elements.map(
          (element) =>
            element.getAttribute("src") || element.getAttribute("href"),
        ),
      ),
  ).not.toContainEqual(expect.stringContaining("/FSGM/"));
});

test("production logo, menus, and address fit phones and desktops", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("./");
    await expect(page.locator("header .supplied-logo")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page.goto("./#/#contact");
    await expect(page.locator("#contact .business-address")).toContainText(
      "Norristown, PA 19403",
    );
    if (configuredSite.email)
      await expect(page.locator("#contact form")).toBeVisible();
    else
      await expect(page.locator(".contact-unavailable")).toContainText(
        "Email contact coming soon",
      );
    await expect(page.locator("footer .business-address")).toContainText(
      "2123 West Main Street",
    );
  }
});
