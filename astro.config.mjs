// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: "server", // Required for API routes, but pages can be prerendered
  adapter: cloudflare(),
});
