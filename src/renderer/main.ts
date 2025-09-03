import { createApp } from "vue";

import App from "./App.vue";
import { router } from "./routes";
import log from 'electron-log/renderer';
import { consoleLogFormat } from "./utils/log";
import './index.css'

const isDev = import.meta.env.DEV;

log.transports.console.format = consoleLogFormat;
log.transports.console.useStyles = false;
log.transports.console.level = isDev ? "debug" : "warn";
log.info("Renderer Started");

createApp(App).use(router).mount("#app");
