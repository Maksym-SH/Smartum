import { defineConfig } from "vite";

import Vue from "@vitejs/plugin-vue";
import path from "node:path";

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
