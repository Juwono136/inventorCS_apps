import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/service": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      "/api": {
        target: "https://78cb-103-94-10-238.ngrok-free.app",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  plugins: [react()],
})