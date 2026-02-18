// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
// https://astro.build/config

export default defineConfig({
  site: "https://credodigital.hu/",
  output: "server", // Required for API routes, but pages can be prerendered
  integrations: [robotsTxt(), sitemap()],
  adapter: cloudflare(),
  server: {
    port: 4322,
  },
});
