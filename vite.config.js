import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
  server: {
    port: 5173,
    strictPort: false,
    hmr: {
      port: 5173,
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})