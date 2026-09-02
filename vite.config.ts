import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        provider: resolve(import.meta.dirname, 'provider.html'),
        professional: resolve(import.meta.dirname, 'professional.html'),
      },
    },
  },
});
