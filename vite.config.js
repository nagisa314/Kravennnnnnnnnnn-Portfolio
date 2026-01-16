import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // 👇 REQUIRED for GitHub Pages project site
  base: "/Kravennnnnnnnnnn-Portfolio/",

  plugins: [
    laravel({
      input: ["resources/css/app.css", "resources/js/app.jsx"],
      refresh: true,
    }),
    react(),
  ],

  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
});
