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

const isDevelopment = process.env.NODE_ENV === "development";

log.transports.console.format = "[{processType}] {h}:{i}:{s} [{level}]: {text}";
log.transports.console.useStyles = true;

log.info(`App Started: ${isDevelopment ? "Development" : "Production"}`);

type CreateWindowOptions = { path: string };
const defaultCreateWindowOptions: CreateWindowOptions = { path: "/" };

function createWindow(opts: CreateWindowOptions) {
  const hashUrlPath = `#${opts.path}`;
  log.info(`create window: ${hashUrlPath}`);

  const win = new BrowserWindow({
    width: 1500,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(import.meta.dirname, "preload.js"),
    },
    show: false,
    autoHideMenuBar: true,
  }).once("ready-to-show", () => {
    win.show();
  });

  if (isDevelopment) {
    win.loadURL("http://localhost:3000" + hashUrlPath);
    win.webContents.toggleDevTools();
  } else {
    win.loadURL(
      pathToFileURL(join(__dirname, "./renderer/index.html")).toString() +
        hashUrlPath
    );
  }
}

const defaultCreateWindow = () => createWindow(defaultCreateWindowOptions);
const createWindowWithPath = (path: string) => createWindow({ path });
const createWindowBySession = () => {
  const session = retrieveUserSession();
  if (session) {
    createWindowWithPath(WINDOW_PATH.homePage);
  } else {
    createWindowWithPath(WINDOW_PATH.loginPage);
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
      createWindowWithPath(WINDOW_PATH.loginPage);
    }
  });
};

app.whenReady().then(() => log.initialize()).then(defineHandlers).then(createWindowBySession);

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
