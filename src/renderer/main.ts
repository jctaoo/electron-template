import { createApp } from "vue";

import App from "./App.vue";
import { router } from "./routes";
import log from 'electron-log/renderer';

import './index.css'

log.info('Renderer Started');

createApp(App).use(router).mount("#app");
