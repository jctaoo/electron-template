import log from "electron-log";

const isDevelopment = process.env.NODE_ENV === "development";

export async function setupDevTools() {
  if (!isDevelopment) return;
  
  log.info("Setting up devtools...");

  const { installExtension, VUEJS_DEVTOOLS } = await import("electron-devtools-installer");

  const [vue] = await installExtension([VUEJS_DEVTOOLS]);

  log.info(`Vue.js devtools installed: ${vue.name}(${vue.version})`);
}
