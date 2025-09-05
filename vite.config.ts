import { resolve } from "path";

import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import Icons from "unplugin-icons/vite";

// loader helpers
import { FileSystemIconLoader  } from 'unplugin-icons/loaders'

const projectPath = resolve(__dirname, "./");
const rendererPath = resolve(__dirname, "./src/renderer");
const outDirRenderer = resolve(__dirname, "./app/renderer");
const nodeModulesPath = resolve(__dirname, "./node_modules");

// https://vitejs.dev/config/
export default defineConfig({
  envDir: projectPath,
  plugins: [
    vue(),
    tailwindcss(),
    Icons({
      customCollections: {
        // "lobe-icons": FileSystemIconLoader(lobeIconsPath, (svg) =>
        //   svg.replace(/^<svg /, '<svg fill="currentColor" '),
        // ),
      },
    }),
  ],
  base: "./",
  root: rendererPath,
  build: {
    outDir: outDirRenderer,
    emptyOutDir: true,
  },
  worker: {
    format: "es",
  },
  resolve: {
    alias: [
      { find: /^@common/, replacement: resolve(rendererPath, "../common") },
      { find: /^@renderer/, replacement: resolve(rendererPath, "../renderer") },
      { find: "@", replacement: rendererPath },
    ],
  },
});
