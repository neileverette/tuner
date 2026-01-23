import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Use automatic JSX runtime for smaller bundle
      jsxRuntime: 'automatic',
    }),
    visualizer({
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate React into its own chunk (vendors)
          'vendor-react': ['react', 'react-dom'],
          // Separate adapters into their own chunk (lazy-loadable in future)
          'adapters': [
            './src/adapters/SomaFMAdapter.ts',
            './src/adapters/RadioParadiseAdapter.ts',
            './src/adapters/NTSAdapter.ts',
            './src/adapters/KEXPAdapter.ts',
          ],
        },
      },
    },
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 150,
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
