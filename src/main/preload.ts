import { contextBridge, ipcRenderer } from 'electron'
import { Titlebar } from "custom-electron-titlebar";

// import { injectBrowserAction } from 'electron-chrome-extensions/dist/browser-action'

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
});

window.addEventListener('DOMContentLoaded', () => {
  // Title bar implementation
  new Titlebar({ });
});