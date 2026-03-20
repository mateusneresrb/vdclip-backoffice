import path from 'node:path'
import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vitest/config'

const needsPolling = process.platform === 'win32' || __dirname.startsWith('/mnt/')

export default defineConfig({
  server: {
    port: 5174,
    watch: {
      usePolling: needsPolling,
      ...(needsPolling && { interval: 1000, binaryInterval: 3000 }),
    },
  },
  plugins: [
    tanstackRouter({
      quoteStyle: 'single',
      autoCodeSplitting: true,
    }),
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      '@tanstack/react-router',
      '@tanstack/react-query',
      'zustand',
      'react-i18next',
      'i18next',
      'react-hook-form',
      '@hookform/resolvers/zod',
      'zod',
      'clsx',
      'tailwind-merge',
      'sonner',
      'date-fns',
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-charts': ['apexcharts', 'react-apexcharts'],
          'vendor-day-picker': ['react-day-picker'],
        },
      },
    },
  },
})
