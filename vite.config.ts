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
const genericSeoPatterns = [
  /<title>Dauntless Athletics<\/title>/i,
  /<meta name="description" content="Dauntless Athletics provides cheerleading, tumbling, and stunting training in the Phoenix metro area\. Camps, clinics, private lessons, and team training for all levels\.">\s*/i,
  /<meta property="og:site_name" content="Dauntless Athletics">\s*/i,
  /<meta property="og:title" content="Dauntless Athletics">\s*/i,
  /<meta property="og:description" content="Dauntless Athletics provides cheerleading, tumbling, and stunting training in the Phoenix metro area\. Camps, clinics, private lessons, and team training for all levels\.">\s*/i,
  /<meta property="og:image" content="\/dauntless_athletics_logo\.png">\s*/i,
  /<meta name="twitter:card" content="summary_large_image">\s*/i,
];
const PuppeteerRenderer = vitePrerender.PuppeteerRenderer;

export default defineConfig({
  plugins: [
    react(),
    vitePrerender({
      staticDir: resolve(rootDir, "dist"),
      routes: prerenderRoutes,
      postProcess(renderedRoute: { html: string }) {
        genericSeoPatterns.forEach((pattern) => {
          renderedRoute.html = renderedRoute.html.replace(pattern, "");
        });
        return renderedRoute;
      },
      renderer: new PuppeteerRenderer({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        renderAfterElementExists: "[data-prerender-ready='true']",
        renderAfterDocumentEvent: "render-event",
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
          if (id.includes("@syncfusion")) return "syncfusion";
          if (id.includes("@mui/x-data-grid")) return "datagrid";
          if (id.includes("@mui") || id.includes("@emotion")) return "mui";
          if (id.includes("@reduxjs/toolkit") || id.includes("react-redux")) return "state";
          if (id.includes("axios")) return "http";
          if (id.includes("react-router")) return "router";
          if (id.includes("dayjs")) return "dayjs";
          return "vendor";
        },
      },
    },
    chunkSizeWarningLimit: 2400,
  },
});
