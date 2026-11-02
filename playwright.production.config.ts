import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./production-tests",
  use: {
    baseURL: "http://127.0.0.1:4176/",
    browserName: "chromium",
    launchOptions: { executablePath: process.env.CHROMIUM_PATH || undefined },
  },
  webServer: {
    command: "npm run preview -- --port 4176 --strictPort",
    url: "http://127.0.0.1:4176/",
    reuseExistingServer: !process.env.CI,
  },
});
