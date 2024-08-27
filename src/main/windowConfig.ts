import { WINDOW_PATH } from "@common/path.js";

export const WINDOW_INITIAL_SIZE: Record<keyof typeof WINDOW_PATH, { width: number, height: number }> = {
    homePage: { width: 1500, height: 900 },
    loginPage: { width: 800, height: 600 },
}

export function buildWindowSizeConfig(path: keyof typeof WINDOW_PATH) {
    return WINDOW_INITIAL_SIZE[path];
}