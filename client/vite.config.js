import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://csbi-users.portproject.my.id",
        changeOrigin: true,
        secure: false,
        ws: true,
        // headers: {
        //   "ngrok-skip-browser-warning": "69420"
        // }
      },
      "/service": {
        target: "https://inventorcs-server.portproject.my.id",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  build: {
    outDir: "dist",
  },
  plugins: [react()],
})