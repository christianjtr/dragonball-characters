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
      "@hooks": resolve(__dirname, "./src/hooks"),
      "@pages": resolve(__dirname, "./src/pages"),
      "@app-types": resolve(__dirname, "./src/types"),
      "@components": resolve(__dirname, "./src/components"),
    },
  },
})
