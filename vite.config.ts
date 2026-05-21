import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
  server: {
    // Em dev local: "npm run dev" não roda as Edge Functions.
    // Use "npm run dev:vercel" (vercel dev) para ter /api/claude funcionando.
    // Sem isso, as chamadas /api/claude retornam 404 — insira a chave na sidebar
    // como fallback (o proxy aceita via header x-api-key-override).
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // porta padrão do vercel dev
        changeOrigin: true,
      },
    },
  },
})
