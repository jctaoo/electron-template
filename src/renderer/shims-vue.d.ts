/// <reference types="vite/client" />

declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ViteTypeOptions {
}

interface ImportMetaEnv {
  
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}