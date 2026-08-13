import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";

export default defineConfig({
  integrations: [preact()],
  vite: {
    css: {
      transformer: "lightningcss",
      lightningcss: {
        targets: {
          chrome: 100,
          safari: 14,
          firefox: 100,
        },
      },
    },
  },
});
