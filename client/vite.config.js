import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://2d91-103-94-10-238.ngrok-free.app",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  plugins: [react()],
})