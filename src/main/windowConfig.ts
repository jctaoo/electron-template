import { WINDOW_PATH } from "@common/path.js";
import type { BrowserWindowConstructorOptions } from "electron";

export const WINDOW_CONFIG: Record<keyof typeof WINDOW_PATH, Partial<BrowserWindowConstructorOptions>> = {
  homePage: { width: 1500, height: 900 },
  loginPage: {
    width: 800, height: 600, resizable: false, maximizable: false,
    titleBarOverlay: {
      height: 30
    }
  },
}

export function buildWindowConfig(path: keyof typeof WINDOW_PATH) {
  return WINDOW_CONFIG[path];
}