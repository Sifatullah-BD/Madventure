import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
  server: {
    port: 5173,
    strictPort: false,
    watch: {
      ignored: [
        '**/bangladesh-geojson/**',
        '**/travel-skills/**',
        '**/airbnb-api/**',
        '**/booking-com-api/**',
        '**/hotel-api/**',
        '**/travel-api/**',
        '**/public/data/bd-geojson/*.geojson',
      ],
    },
    hmr: {
      port: 5173,
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});