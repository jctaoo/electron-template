import path, { join } from "path";
import { pathToFileURL } from "url";
import log from 'electron-log/main.js';

import { app, BrowserWindow, ipcMain } from "electron";
import {
  clearUserSession,
  retrieveUserSession,
  storeUserSession,
} from "./services/userSession.js";
import { WINDOW_PATH } from "@common/path.js";
import { isLoginWindow } from "./utils/windowUtils.js";
import { setupTitlebar, attachTitlebarToWindow } from "custom-electron-titlebar/main";
import { buildWindowConfig } from "./windowConfig.js";

const isDevelopment = process.env.NODE_ENV === "development";

log.transports.console.format = "[{processType}] {h}:{i}:{s} [{level}]: {text}";
log.transports.console.useStyles = true;

log.info(`App Started: ${isDevelopment ? "Development" : "Production"}`);

type CreateWindowOptions = { path: keyof typeof WINDOW_PATH };
const defaultCreateWindowOptions: CreateWindowOptions = { path: "homePage" };

function createWindow(opts: CreateWindowOptions) {
  const hashUrlPath = `#${WINDOW_PATH[opts.path]}`;
  log.info(`create window: ${hashUrlPath}`);

  const win = new BrowserWindow({
    ...buildWindowConfig(opts.path),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(import.meta.dirname, "preload.cjs"),
    },
    show: false,
    autoHideMenuBar: true,
    // options to setup custom titlebar, if don't want to use, remove these options
    titleBarStyle: "hidden",
  }).once("ready-to-show", () => {
    win.show();
  });

  win.setMenu(null);
  attachTitlebarToWindow(win);

  if (isDevelopment) {
    win.loadURL("http://localhost:3000" + hashUrlPath);

    // Uncomment the following line to open the DevTools.
    win.webContents.toggleDevTools();

  } else {
    win.loadURL(
      pathToFileURL(join(import.meta.dirname, "./renderer/index.html")).toString() +
        hashUrlPath
    );
  }
}

const defaultCreateWindow = () => createWindow(defaultCreateWindowOptions);
const createWindowWithPath = (path: keyof typeof WINDOW_PATH) => createWindow({ path });
const createWindowBySession = () => {
  const session = retrieveUserSession();
  if (session) {
    createWindowWithPath("homePage");
  } else {
    createWindowWithPath("loginPage");
  }
};

const defineHandlers = () => {
  ipcMain.handle("store-login-token", async (event, token: string) => {
    await storeUserSession(token);

    if (isLoginWindow(event.sender)) {
      event.sender.close();
      createWindowBySession();
    }
  });
  ipcMain.handle("clear-session", async (event) => {
    await clearUserSession();

    if (!isLoginWindow(event.sender)) {
      event.sender.close();
      createWindowWithPath("loginPage");
    }
  });
};

app.whenReady().then(() => log.initialize()).then(setupTitlebar).then(defineHandlers).then(createWindowBySession);

app.on("window-all-closed", () => {
  const session = retrieveUserSession();
  if (!session) {
    return app.quit();
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindowBySession();
  }
});
