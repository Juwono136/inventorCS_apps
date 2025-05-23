import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    server: {
      proxy: {
        "/api": {
          target: mode === "development"
            ? "http://localhost:5000"
            : "https://csbi-users.csbihub.id",
          changeOrigin: true,
          secure: mode !== "development",
          ws: true,
        },
        "/service": {
          target: mode === "development"
            ? "http://localhost:5001"
            : "https://inventorcs-server.csbihub.id",
          changeOrigin: true,
          secure: mode !== "development",
          ws: true,
        },
      },
    },
    build: {
      outDir: "dist",
    },
    plugins: [react()],
  }
})
