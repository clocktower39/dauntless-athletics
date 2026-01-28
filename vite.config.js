import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import PrerenderSPAPlugin from "@prerenderer/rollup-plugin";
import PuppeteerRenderer from "@prerenderer/renderer-puppeteer";

export default defineConfig({
  plugins: [
    react(),
    PrerenderSPAPlugin({
      staticDir: "./dist",
      routes: [
        "/",
        "/camps",
        "/college-combine",
        "/class-schedule",
        "/services",
        "/staff",
        "/facility",
        "/contact-us",
      ],
      renderer: new PuppeteerRenderer({
        headless: true,
        renderAfterDocumentEvent: "render-event",
      }),
    }),
  ],
  server: {
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
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
