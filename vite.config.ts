import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  // base: "/ssyc-cam/",
  build: {
    outDir: "docs",
    assetsDir: "./",
  },
  plugins: [react()],
});
