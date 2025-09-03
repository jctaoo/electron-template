import { contextBridge, ipcRenderer } from 'electron'
import { isAuthPage, WINDOW_PATH } from '@common/path.js';

// see: https://www.electronjs.org/docs/latest/tutorial/tutorial-preload#augmenting-the-renderer-with-a-preload-script
contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
})

contextBridge.exposeInMainWorld("electronAPI", {
  storeLoginToken: async (token: string) => {
    await ipcRenderer.invoke("store-login-token", token);
  },
  clearSession: async () => {
    await ipcRenderer.invoke("clear-session");
  },
  setWindowTheme: async (theme: "light" | "dark" | "system") => {
    await ipcRenderer.invoke("set-window-theme", theme);
  },
});

window.addEventListener('DOMContentLoaded', () => {
  const windowPath = window.location.hash;

  if (!isAuthPage(windowPath.slice(1))) {
    // Title bar implementation
    // new Titlebar({ });
  }
});