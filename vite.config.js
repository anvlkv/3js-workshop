import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor';
            }
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three';
            }
            return 'vendor'; // all other node_modules
          }
        }
      }
    }
  },
  server: {
    port: 5173,
    open: true,
    cors: {
      origin: '*'
    }
  }
})