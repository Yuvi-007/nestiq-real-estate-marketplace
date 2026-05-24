import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined

          if (id.includes('victory-vendor') || id.includes('d3-') || id.includes('es-toolkit')) return 'charts-vendor'
          if (id.includes('recharts')) return 'charts'
          if (id.includes('leaflet') || id.includes('react-leaflet')) return 'leaflet'
          if (id.includes('framer-motion')) return 'motion'

          return undefined
        },
      },
    },
  },
})
