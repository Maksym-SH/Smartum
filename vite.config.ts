import path from "node:path";
import { defineConfig } from "vite";

import Vue from "@vitejs/plugin-vue";

export default defineConfig({
  server: {
    port: 8080,
  },
  plugins: [Vue()],
  resolve: {
    alias: {
      "@/": `${path.resolve(__dirname, "src")}/`,
      "package.json": `${path.resolve(__dirname, "package.json")}/`,
    },
  },
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/assets/scss/variables.scss";
          @import "@/assets/scss/mixins.scss";
        `,
      },
    },
  },
});
