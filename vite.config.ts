import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    allowedHosts: [".trycloudflare.com"],
  },
  build: {
    assetsDir: "_assets",
    rollupOptions: {
      input: {
        screen: resolve(__dirname, "screen.html"),
        controller: resolve(__dirname, "controller.html"),
        app: resolve(__dirname, "app.html"),
      },
    },
  },
});
