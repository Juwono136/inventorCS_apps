import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      // ngrok
      "/api": {
        target: "https://78cb-103-94-10-238.ngrok-free.app",
        changeOrigin: true,
        secure: false,
        ws: true,
        headers: {
          "ngrok-skip-browser-warning": "69420"
        }
      },
      "/service": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  plugins: [react()],
})