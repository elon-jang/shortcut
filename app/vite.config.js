import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import yamlShortcuts from './plugins/yaml-shortcuts-plugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [yamlShortcuts(), react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        cheatsheet: resolve(__dirname, 'cheatsheet.html'),
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    execArgv: ['--experimental-require-module'],
  },
})
