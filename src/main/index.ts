import { join } from "path";
import { pathToFileURL } from "url";

import { app, BrowserWindow } from "electron";

const isDevelopment = process.env.NODE_ENV === "development";

type CreateWindowOptions = { path: string };
const defaultCreateWindowOptions: CreateWindowOptions = { path: "/" };

function createWindow(opts: CreateWindowOptions) {
  const hashUrlPath = `#${opts.path}`;
  console.log(`create window: ${hashUrlPath}`);

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: false,
  });
  win.show(); // TODO: ready-to-show not work

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
app.whenReady().then(defaultCreateWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    defaultCreateWindow();
  }
});
