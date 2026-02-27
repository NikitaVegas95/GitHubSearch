import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) {
            return undefined;
          }

          if (id.includes('react-router-dom')) {
            return 'vendor-router';
          }

          if (id.includes('@reduxjs/toolkit') || id.includes('react-redux')) {
            return 'vendor-redux';
          }

          if (id.includes('/react/') || id.includes('/react-dom/')) {
            return 'vendor-react';
          }

          return undefined;
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
      '@app': new URL('./src/app', import.meta.url).pathname,
      '@pages': new URL('./src/pages', import.meta.url).pathname,
      '@widgets': new URL('./src/widgets', import.meta.url).pathname,
      '@features': new URL('./src/features', import.meta.url).pathname,
      '@entities': new URL('./src/entities', import.meta.url).pathname,
      '@shared': new URL('./src/shared', import.meta.url).pathname
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        silenceDeprecations: ['legacy-js-api']
      }
    }
  }
});
