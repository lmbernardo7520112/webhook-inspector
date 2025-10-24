// packages/web/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- IMPORTE O PLUGIN

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()], // <-- ADICIONE O PLUGIN AQUI
})