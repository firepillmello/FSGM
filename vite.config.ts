import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import site from "./site.config.json";
const base = process.env.BASE_PATH || new URL(site.url).pathname;
export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "site-logo-favicon",
      transformIndexHtml() {
        return [
          {
            tag: "link",
            attrs: { rel: "icon", href: `${base}${site.logo.src}` },
            injectTo: "head" as const,
          },
        ];
      },
    },
  ],
});
