// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server", // Required for API routes, but pages can be prerendered
  adapter: node({
    mode: "standalone",
  }),
});
