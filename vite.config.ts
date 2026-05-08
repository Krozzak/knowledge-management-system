import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Serve _graph.json and notes/ as static files in dev
    fs: {
      allow: ['..'],
    },
  },
})
