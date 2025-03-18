import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@clients": resolve(__dirname, "./src/clients"),
      "@services": resolve(__dirname, "./src/services"),
    },
  },
})
