import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
// import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VueRouter(),
    vue(),
    // tsconfigPaths()
  ],
  resolve: {
    alias: {
    '@': path.resolve(import.meta.dirname, './src')
    }
  }
})
