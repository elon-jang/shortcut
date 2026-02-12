import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import yamlShortcuts from './plugins/yaml-shortcuts-plugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [yamlShortcuts(), react()],
})
