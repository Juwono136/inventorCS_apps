import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      // ngrok
      "/api/user": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false,
        ws: true,
        // headers: {
        //   "ngrok-skip-browser-warning": "69420"
        // }
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