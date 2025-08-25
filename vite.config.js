import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // 👈 Vercel needs this as output folder
  },
  server: {
    port: 5173,
    open: true,
  }
});
