// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // Disable React Refresh in development to prevent rendering issues
      fastRefresh: false
    })
  ],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    },
    // Disable HMR to prevent caching issues
    hmr: false
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
