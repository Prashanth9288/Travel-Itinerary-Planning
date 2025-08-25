import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // 👈 fixes MIME issues with asset loading
  build: {
    outDir: "dist"
  },
  server: {
    port: 5173,
    open: true
  },
  preview: {
    port: 4173
  }
});
