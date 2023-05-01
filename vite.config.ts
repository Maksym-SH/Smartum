import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  server: {
    port: 8080
  },
  plugins: [
    Vue()
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      },
      { 
        find: 'package.json', 
        replacement: path.resolve(__dirname, 'package.json')
      }
    ]
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/assets/scss/variables.scss";
          @import "@/assets/scss/mixins.scss";
          @import "@/assets/scss/theme.scss";
        `
      }
    }
  }
})