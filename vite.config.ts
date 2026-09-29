import { defineConfig } from 'vite';

// base relativa: o mesmo build funciona no GitHub Pages (subpasta) e em qualquer hospedagem estática.
export default defineConfig({
  base: './',
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 2000,
  },
});
