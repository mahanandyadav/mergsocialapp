import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  // base: "/",
  plugins: [react()],
  esbuild: {
    target: "esnext",
    sourcemap: true, // Ensure source maps are enabled
  },
});
