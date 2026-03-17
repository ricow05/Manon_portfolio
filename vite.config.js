import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative base path keeps asset URLs working on GitHub Pages project sites.
  base: "./",
});
