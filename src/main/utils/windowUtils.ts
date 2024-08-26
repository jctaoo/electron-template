import { WINDOW_PATH } from '@common/path.js';
import { BrowserWindow, WebContents } from 'electron';

export function isLoginWindow(win: WebContents) {
    const url = win.getURL();
    return url.endsWith(WINDOW_PATH.loginPage);
}