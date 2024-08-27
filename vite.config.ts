import { resolve } from "path";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { fileURLToPath } from "url"

const rendererPath = resolve(__dirname, "./src/renderer");
const outDirRenderer = resolve(__dirname, "./app/renderer");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "./",
  root: rendererPath,
  build: {
    outDir: outDirRenderer,
    emptyOutDir: true,
  },
  resolve: {
    alias: [
      { find: /^@common/, replacement: resolve(rendererPath, "../common") },
      { find: /^@renderer/, replacement: resolve(rendererPath, "../renderer") },
    ],
  },
});
