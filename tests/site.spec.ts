import { test, expect } from "@playwright/test";

test("home navigation scrolls in place and opening CTAs stay simple", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./");
  const hero = page.locator(".home-hero");
  await expect(
    hero.getByRole("link", { name: "Explore Our Services" }),
  ).toBeVisible();
  await expect(
    hero.getByRole("link", { name: "About Us", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Schedule a Consultation/i }),
  ).toHaveCount(0);
  await hero.getByRole("link", { name: "About Us", exact: true }).click();
  await expect(page).toHaveURL(/#\/#about$/);
  await expect(page.locator("#about")).toBeInViewport();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await page.locator(".audiences-dropdown > summary").click();
  await page
    .locator(".audiences-dropdown")
    .getByRole("link", { name: "Explore who we serve" })
    .click();
  await expect(page.locator("#who-we-serve")).toBeInViewport();
  await expect(hero).toBeAttached();
  expect(errors).toEqual([]);
});

test("services dropdown selects one inline detail and passes the choice to contact", async ({
  page,
}) => {
  await page.goto("./");
  const summary = page.locator(".services-dropdown > summary");
  await summary.click();
  await expect(page.locator(".services-dropdown")).toHaveAttribute("open", "");
  await page
    .locator(".services-menu")
    .getByRole("link", { name: /Fractional Fiscal Director Services/ })
    .click();
  await expect(page).toHaveURL(/#\/#service-5$/);
  await expect(page.locator(".inline-service-detail")).toHaveCount(1);
  await expect(page.locator(".inline-service-detail")).toBeInViewport();
  await expect(page.locator("#selected-service-title")).toHaveText(
    "Fractional Fiscal Director Services",
  );
  await expect(page.locator(".services-dropdown")).not.toHaveAttribute(
    "open",
    "",
  );
  await page
    .locator(".inline-service-detail")
    .getByRole("link", { name: "Discuss your needs" })
    .click();
  await expect(page).toHaveURL(/#\/#contact$/);
  await expect(page.locator('select[name="assistance"]')).toHaveValue(
    "Fractional Fiscal Director Services",
  );
  await expect(page.locator(".contact-form")).toHaveCount(1);
  await page.getByLabel("Organization name").fill("Saved organization");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "About Us", exact: true })
    .click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Contact", exact: true })
    .click();
  await expect(page.getByLabel("Organization name")).toHaveValue(
    "Saved organization",
  );
});

test("service rail moves horizontally and closes expanded details", async ({
  page,
}) => {
  await page.goto("./#/#services");
  const rail = page.locator("#service-rail");
  await expect(rail.locator(".service-card")).toHaveCount(7);
  await page.getByRole("button", { name: "Next services" }).click();
  await expect
    .poll(() => rail.evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(100);
  await expect(page.locator(".rail-motion")).toHaveCount(0);
  const card = rail.locator(".service-card").nth(3);
  await card.click();
  await expect(page.locator(".inline-service-detail")).toBeInViewport();
  await expect(page.locator("#selected-service-title")).toHaveText(
    "Fiscal Compliance & Internal Controls",
  );
  await page.getByRole("link", { name: "Close service details" }).click();
  await expect(page.locator(".inline-service-detail")).toHaveCount(0);
  await expect(page.locator("#services")).toBeInViewport();
});

test("resources expand inline, filter, and open unique articles with working deep links", async ({
  page,
}) => {
  await page.goto("./#/#resources");
  await expect(page.locator(".resource-card")).toHaveCount(3);
  await page.getByRole("button", { name: "Explore more resources" }).click();
  await expect(page.locator(".resource-card")).toHaveCount(6);
  await page.getByRole("searchbox").fill("budget");
  await expect(page.locator(".resource-card")).toHaveCount(1);
  await page.getByRole("searchbox").fill("");
  await page.getByLabel("Browse by topic").selectOption("Audit readiness");
  await expect(page.locator(".resource-card")).toHaveCount(1);
  await page
    .getByRole("link", { name: /Preparing for a Government Grant/ })
    .click();
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Financial Review",
  );
  await page
    .getByRole("link", { name: "← Back to the resource center" })
    .click();
  await expect(page).toHaveURL(/#\/#resources$/);
  await expect(page.locator("#resources")).toBeInViewport();
});

test("legacy page URLs redirect to sections and service deep links survive refresh", async ({
  page,
}) => {
  for (const section of [
    "about",
    "services",
    "who-we-serve",
    "resources",
    "contact",
  ]) {
    await page.goto(`./#/${section}`);
    await expect(page).toHaveURL(new RegExp(`#/#${section}$`));
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Every Grant",
    );
  }
  await page.goto("./#/services#6");
  await expect(page).toHaveURL(/#\/#service-6$/);
  await page.reload();
  await expect(page.locator("#selected-service-title")).toHaveText(
    "Grant Financial Process Improvement",
  );
  await page.goto("./#/missing");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "back on course",
  );
});

test("contact validates and never sends demo entries", async ({ page }) => {
  await page.goto("./#/#contact");
  await page.getByRole("button", { name: "Preview inquiry" }).click();
  await expect(page.locator("input:invalid").first()).toBeVisible();
  await page.getByLabel("Organization name").fill("Community Example");
  await page.getByLabel("Contact person").fill("Test Person");
  await page.getByLabel("Email address").fill("test@example.org");
  await page
    .getByLabel("Organization type")
    .selectOption("Nonprofits & Community Organizations");
  await page.getByLabel("General assistance").selectOption("Not sure yet");
  await page
    .getByLabel("How can we help")
    .fill("Looking for budget reporting support.");
  const posts: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") posts.push(request.url());
  });
  await page.getByRole("button", { name: "Preview inquiry" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Nothing was sent or saved",
  );
  expect(posts).toEqual([]);
});

test("mobile menu and services disclosure support touch, keyboard, and Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.locator(".services-dropdown > summary").click();
  await page
    .locator(".services-menu")
    .getByRole("link", { name: /Financial Reporting/ })
    .click();
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#selected-service-title")).toHaveText(
    "Financial Reporting",
  );
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.locator(".services-dropdown > summary").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".services-dropdown")).toHaveAttribute("open", "");
  await page.keyboard.press("Escape");
  await expect(page.locator(".services-dropdown")).not.toHaveAttribute(
    "open",
    "",
  );
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toHaveAttribute("aria-expanded", "false");
});

test("inline about and industry details keep information in one place", async ({
  page,
}) => {
  await page.goto("./#/#about");
  await page.getByText("Explore more about us", { exact: true }).click();
  await expect(page.locator(".about-disclosure")).toHaveAttribute("open", "");
  await expect(page.locator(".about-disclosure")).toContainText(
    "Integrity, accountability",
  );
  await page.locator("#industry-0 summary").click();
  await expect(page.locator("#industry-0 details")).toHaveAttribute("open", "");
  await expect(page.locator("#industry-0")).toContainText("Service units");
  await expect(page).toHaveURL(/#\/#about$/);
});

test("manual service navigation respects reduced motion without playback controls", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./#/#services");
  await expect(page.locator(".rail-motion")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: /play|pause|resume/i }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Next services" }).click();
  await expect
    .poll(() =>
      page.locator("#service-rail").evaluate((element) => element.scrollLeft),
    )
    .toBeGreaterThan(100);
});

test("responsive layouts retain readable text without page overflow", async ({
  page,
}) => {
  for (const width of [
    320, 360, 390, 480, 700, 760, 768, 950, 1024, 1050, 1100, 1280, 1440, 1920,
  ]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ["", "/#service-6", "/resources/after-the-award"]) {
      await page.goto(`./#${route || "/"}`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const problems = await page.evaluate(() => {
        const found: string[] = [];
        if (document.documentElement.scrollWidth > innerWidth)
          found.push("page overflow");
        for (const element of document.querySelectorAll(
          "h1,h2,h3,.button,.contact-form",
        )) {
          // Cards intentionally extend beyond the clipped, horizontally scrollable rail.
          if (element.closest(".service-rail")) continue;
          const rect = element.getBoundingClientRect();
          if (rect.width && (rect.left < -1 || rect.right > innerWidth + 1))
            found.push(`${element.tagName} beyond viewport`);
        }
        const logo = document.querySelector("header .logo")!,
          nav = document.querySelector("nav")!;
        if (
          innerWidth > 1050 &&
          getComputedStyle(nav).display !== "none" &&
          logo.getBoundingClientRect().right > nav.getBoundingClientRect().left
        )
          found.push("header collision");
        return found;
      });
      expect(problems, `${width}px ${route}`).toEqual([]);
    }
  }
});

test("keyboard skip link moves focus into main content", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test("Who We Serve dropdown reveals the chosen audience and closes other menus", async ({
  page,
}) => {
  await page.goto("./");
  await page.locator(".services-dropdown > summary").click();
  await page.locator(".audiences-dropdown > summary").click();
  await expect(page.locator(".services-dropdown")).not.toHaveAttribute(
    "open",
    "",
  );
  await page
    .locator(".audiences-dropdown")
    .getByRole("link", { name: /Housing & Community Development/ })
    .click();
  await expect(page).toHaveURL(/#\/#industry-2$/);
  await expect(page.locator("#industry-2 details")).toHaveAttribute("open", "");
  await expect(page.locator("#industry-2")).toBeInViewport();
  await expect(page.locator(".audiences-dropdown")).not.toHaveAttribute(
    "open",
    "",
  );
  await page.locator(".audiences-dropdown > summary").click();
  await page.keyboard.press("Escape");
  await expect(page.locator(".audiences-dropdown > summary")).toBeFocused();
  await expect(page.locator(".audiences-dropdown")).not.toHaveAttribute(
    "open",
    "",
  );
});

test("About Us tells the community story through a Fiscal Director perspective", async ({
  page,
}) => {
  await page.goto("./#/#about");
  const about = page.locator("#about");
  await expect(about).toContainText("Public funding begins with a promise");
  await expect(about).toContainText(
    "expertise and perspective of a Fiscal Director",
  );
  await expect(about.locator(".industry-card")).toHaveCount(0);
  for (const audience of [
    "Aging Services Organizations",
    "Human Services Providers",
    "Housing & Community Development",
    "Nonprofits & Community Organizations",
  ])
    await expect(about).not.toContainText(audience);
  await expect(page.locator(".community-visual img")).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator(".community-visual img")
        .evaluate((image) => (image as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(1000);
});

test("mobile Who We Serve dropdown selects without opening a new page", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.locator(".audiences-dropdown > summary").click();
  await page
    .locator(".audiences-dropdown")
    .getByRole("link", { name: /Aging Services Organizations/ })
    .click();
  await expect(page).toHaveURL(/#\/#industry-0$/);
  await expect(page.locator("#industry-0 details")).toHaveAttribute("open", "");
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toHaveAttribute("aria-expanded", "false");
});

test("Resources dropdown filters the existing section and shares menu behavior", async ({
  page,
}) => {
  await page.goto("./");
  await page.locator(".services-dropdown > summary").click();
  await page.locator(".resources-dropdown > summary").click();
  await expect(page.locator(".services-dropdown")).not.toHaveAttribute(
    "open",
    "",
  );
  await page
    .locator(".resources-dropdown")
    .getByRole("link", { name: /Financial controls/ })
    .click();
  await expect(page).toHaveURL(/#\/#resources-financial-controls$/);
  await expect(page.getByLabel("Browse by topic")).toHaveValue(
    "Financial controls",
  );
  await expect(page.locator(".resource-card")).toHaveCount(1);
  await expect(page.locator(".resource-card")).toContainText(
    "Why Strong Internal Controls Matter",
  );
  await expect(page.locator("#resources")).toBeInViewport();
  await expect(page.locator(".resources-dropdown")).not.toHaveAttribute(
    "open",
    "",
  );
  await page.locator(".resources-dropdown > summary").click();
  await page
    .locator(".resources-dropdown")
    .getByRole("link", { name: "Explore all resources" })
    .click();
  await expect(page.locator(".resource-card")).toHaveCount(6);
  await page.locator(".resources-dropdown > summary").click();
  await page.keyboard.press("Escape");
  await expect(page.locator(".resources-dropdown > summary")).toBeFocused();
  await expect(page.locator(".resources-dropdown")).not.toHaveAttribute(
    "open",
    "",
  );
});

test("Resources dropdown works on small phones without menu overflow", async ({
  page,
}) => {
  for (const width of [320, 375, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("./");
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.locator(".resources-dropdown > summary").click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page
      .locator(".resources-dropdown")
      .getByRole("link", { name: /Getting started/ })
      .click();
    await expect(page.getByLabel("Browse by topic")).toHaveValue(
      "Getting started",
    );
    await expect(page.locator(".resource-card")).toHaveCount(1);
    await expect(
      page.getByRole("button", { name: "Open navigation" }),
    ).toHaveAttribute("aria-expanded", "false");
  }
});

test("key reading text stays large on desktop and mobile with reduced motion available", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("./");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const small = await page
      .locator(
        ".hero-copy > p:not(.eyebrow), .service-card > p, .industry-card > p, .resource-card > p:not(.eyebrow)",
      )
      .evaluateAll((elements) =>
        elements
          .filter(
            (element) => parseFloat(getComputedStyle(element).fontSize) < 18,
          )
          .map((element) => element.textContent),
      );
    expect(small, `${width}px reading text`).toEqual([]);
    expect(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).scrollBehavior,
      ),
    ).toBe("auto");
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document
              .getAnimations()
              .filter((animation) => animation.playState === "running").length,
        ),
      )
      .toBe(0);
  }
  await page.emulateMedia({ reducedMotion: "no-preference" });
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("smooth");
});
