import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    base: env.VITE_APP_BASE_PATH,
    resolve: {
      alias: {
        "@clients": resolve(__dirname, "./src/clients"),
        "@services": resolve(__dirname, "./src/services"),
        "@hooks": resolve(__dirname, "./src/hooks"),
        "@pages": resolve(__dirname, "./src/pages"),
        "@app-types": resolve(__dirname, "./src/types"),
        "@components": resolve(__dirname, "./src/components"),
        "@assets": resolve(__dirname, "./src/assets"),
        "@utils": resolve(__dirname, "./src/utils"),
        "@config": resolve(__dirname, "./src/config"),
      },
    },
  }
});
