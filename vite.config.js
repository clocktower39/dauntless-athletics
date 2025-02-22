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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "mui-vendor": [
            "@mui/material",
            "@mui/icons-material",
            "@mui/styles",
            "@emotion/react",
            "@emotion/styled",
          ],
          "date-utils": ["dayjs"],
          utils: ["axios", "react-player"],
          "router-vendor": ["react-router", "react-router-dom", "react-router-hash-link", ],
        },
      },
    },
  },
});
