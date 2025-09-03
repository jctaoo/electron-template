import { nativeTheme } from "electron";
import log from "electron-log";

export function updateWindowTheme(newTheme: "light" | "dark" | "system") {
  log.info(`Updating window theme to: ${newTheme}`);
  if (newTheme === "dark") {
    nativeTheme.themeSource = "dark";
  } else if (newTheme === "light") {
    nativeTheme.themeSource = "light";
  } else {
    nativeTheme.themeSource = "system";
  }
}