import path, { join } from "path";
import { pathToFileURL } from "url";
import log from "electron-log/main.js";

import { app, BrowserWindow, ipcMain } from "electron";
import { clearUserSession, retrieveUserSession, storeUserSession } from "./services/userSession.js";
import { WINDOW_PATH } from "@common/path.js";
import { isLoginWindow } from "./utils/windowUtils.js";
import { buildWindowConfig } from "./windowConfig.js";
import dotenv from "dotenv";
import { consoleLogFormat, rotateLogFile } from "./utils/log.js";
import { windowStateManager } from "./services/windowStateManager.js";
import { setupDevTools } from "./utils/setupDevTools.js";
import { notificationService } from "./services/notificationService.js";
import { updateWindowTheme } from "./services/themeService.js";
import { setupDevtoolsFont } from "./utils/devtoolsFont.js";

// initilize log before import any other modules
const isDevelopment = process.env.NODE_ENV === "development";
const isPackaged = app.isPackaged;

// dotenv
dotenv.config();

log.initialize();

log.transports.console.format = consoleLogFormat;
log.transports.console.level = isDevelopment ? "debug" : "info";
log.transports.console.useStyles = false;

log.transports.file.format = `{level}: [{processType}] {y}-{m}-{d} {h}:{i}:{s}.{ms}{z}{scope} {text}`;
log.transports.file.archiveLogFn = rotateLogFile;

log.transports.ipc.level = false;

log.info(`App Started: ${isDevelopment ? "Development" : "Production"}`);

if (isPackaged && process.platform === "win32") {
  app.setAppUserModelId("com.jctaoo.live_assistant");
  log.info("setAppUserModelId: com.jctaoo.live_assistant");
} else if (!isPackaged && process.platform === "win32") {
  app.setAppUserModelId(process.execPath);
  log.info("setAppUserModelId: " + process.execPath);
}

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
  }).once("ready-to-show", () => {
    win.show();
  });
  
  setupDevtoolsFont(win);

  win.setMenu(null);

  // Register window with state manager
  const [unregisterWindow, setupDevToolsWindow] = windowStateManager.registerWindow(win, opts.path);

  // Handle window close event
  win.on("close", async (event) => {
    event.preventDefault();
    unregisterWindow();
    win.destroy();
  });

  if (isDevelopment) {
    win.loadURL("http://localhost:5173" + hashUrlPath);

    // Uncomment the following line to open the DevTools.
    setupDevToolsWindow();
  } else {
    win.loadURL(pathToFileURL(join(import.meta.dirname, "./renderer/index.html")).toString() + hashUrlPath);
  }

  return win;
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
  ipcMain.handle("set-window-theme", async (event, theme: "light" | "dark" | "system") => {
    await updateWindowTheme(theme);
  });
};

// prettier-ignore
app
  .whenReady()
  .then(notificationService.initializeService.bind(notificationService))
  .then(setupDevTools)
  .then(defineHandlers)
  .then(createWindowBySession)
  
app.on("window-all-closed", async () => {
  log.info("window-all-closed");

  const session = retrieveUserSession();
  if (!session) {
    return app.quit();
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", async (e) => {
  log.info("before-quit");
  e.preventDefault();
  app.exit(0);
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindowBySession();
  }
});
