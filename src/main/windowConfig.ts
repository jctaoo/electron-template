import { WINDOW_PATH } from "@common/path.js";
import type { BrowserWindowConstructorOptions } from "electron";

const authPageConfig = {
  width: 800,
  height: 600,
  resizable: false,
  maximizable: false,
  titleBarOverlay: {
    height: 30,
  },
};

export const WINDOW_CONFIG: Record<
  keyof typeof WINDOW_PATH,
  Partial<BrowserWindowConstructorOptions>
> = {
  homePage: {
    width: 1500,
    height: 900,
    titleBarOverlay: {
      height: 50,
      color: "#ffffff",
    },
  },

  loginPage: authPageConfig,
  forgetPage: authPageConfig,
  registerPage: authPageConfig,
  wechatLoginPage: authPageConfig,
};

export function buildWindowConfig(path: keyof typeof WINDOW_PATH) {
  return WINDOW_CONFIG[path];
}
