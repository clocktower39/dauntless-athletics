import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const require = createRequire(import.meta.url);
const vitePrerender = require("vite-plugin-prerender");
const rootDir = dirname(fileURLToPath(import.meta.url));
const prerenderRoutes = [
  "/",
  "/camps",
  "/college-combine",
  "/peak-performance-camp",
  "/class-schedule",
  "/services",
  "/staff",
  "/facility",
  "/contact-us",
];
const PuppeteerRenderer = vitePrerender.PuppeteerRenderer;

export default defineConfig({
  plugins: [
    react(),
    vitePrerender({
      staticDir: resolve(rootDir, "dist"),
      routes: prerenderRoutes,
      renderer: new PuppeteerRenderer({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        renderAfterTime: 1200,
        navigationOptions: {
          waitUntil: "load",
          timeout: 30000,
        },
      }),
    }),
  ],
  server: {
    proxy: {
      "/api": "http://localhost:8089",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes("node_modules")) return;
          if (id.includes("react-player") || id.includes("youtube-video-element")) return "player";
          if (id.includes("@mui") || id.includes("@emotion")) return "mui";
          if (id.includes("react-router")) return "router";
          if (id.includes("dayjs")) return "dayjs";
          return "vendor";
        },
      },
    },
    chunkSizeWarningLimit: 2400,
  },
});
