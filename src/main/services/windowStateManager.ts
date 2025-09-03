import { BrowserWindow, screen, WebContents } from "electron";
import Store from "electron-store";
import log from "electron-log";
import { WINDOW_PATH } from "@common/path.js";

export type WindowState = {
  x?: number;
  y?: number;
  width: number;
  height: number;
  isMaximized: boolean;
  isFullScreen: boolean;
};

type WindowStateStoreType = {
  /** store window-id to window-state */
  [key: string]: WindowState;
};

const logScope = log.scope("WindowStateManager");

class WindowStateManager {
  // electron-store
  private readonly store: Store<WindowStateStoreType>;
  private webContentsIdToWindowId: Map<WebContents["id"], string> = new Map();

  constructor() {
    this.store = new Store<WindowStateStoreType>({
      name: "window-state",
      defaults: {},
    });
  }

  /**
   * register window to window state manager
   * @param window
   * @returns a function to unregister window and a function to setup dev tools window
   */
  registerWindow(window: BrowserWindow, path: keyof typeof WINDOW_PATH): [() => void, () => void] {
    const windowId = this.generateWindowId(window, path);
    this.webContentsIdToWindowId.set(window.webContents.id, windowId);

    logScope.debug(`Registering window ${windowId}`);

    // 恢复窗口状态
    const savedState = this.getWindowStateFromStore(windowId);
    if (savedState) {
      logScope.debug(`Restoring saved state for window ${windowId}`);
      this.applyWindowStateToWindow(window, savedState);
    }

    const unRegister = this.setupWindowListeners(window, (windowId, state) =>
      this.saveWindowStateToStore(windowId, state),
    );
    logScope.info(`Registered window ${windowId}`);

    return [unRegister, this.buildSetupDevToolsWindow(window, savedState)];
  }

  private buildSetupDevToolsWindow(window: BrowserWindow, currentState?: WindowState): () => void {
    let devToolsWindow: BrowserWindow | null = null;

    return () => {
      // check window is unregistered or not
      const windowId = this.webContentsIdToWindowId.get(window.webContents.id);
      if (!windowId) {
        logScope.warn(`Window ${window.webContents.id} not found in webContentsIdToWindowId when building setup dev tools window`);
        return;
      }

      const devToolsWindowId = `${windowId}_devTools`;
      const devToolsWindowState = this.getWindowStateFromStore(devToolsWindowId);

      devToolsWindow = new BrowserWindow();
      devToolsWindow.setMenu(null);
      this.webContentsIdToWindowId.set(devToolsWindow.webContents.id, devToolsWindowId);

      if (window.webContents.isDevToolsOpened()) {
        logScope.warn(`Dev tools window is already opened for window ${windowId} when building setup dev tools window`);
        return;
      }

      window.webContents.setDevToolsWebContents(devToolsWindow.webContents);
      window.webContents.openDevTools({ mode: "detach" });

      // on devtools loaded, change title
      devToolsWindow.once("ready-to-show", () => {
        devToolsWindow?.setTitle(`DevTools for ${windowId}`);
      });

      // listen close dev tools window
      window.webContents.once("devtools-closed", () => {
        if (!devToolsWindow?.isDestroyed()) {
          devToolsWindow?.close();
        }
      });

      window.once("closed", () => {
        if (!devToolsWindow?.isDestroyed()) {
          devToolsWindow?.close();
        }
      });

      if (devToolsWindowState) {
        // restore dev tools window state
        logScope.debug(`Restoring dev tools window state for window ${windowId}:`, JSON.stringify(devToolsWindowState));
        this.applyWindowStateToWindow(devToolsWindow, devToolsWindowState);
      }

      const unregisterDevTools = this.setupWindowListeners(devToolsWindow, (windowId, state) => {
        this.saveWindowStateToStore(windowId, state);
      });

      devToolsWindow.once("close", () => {
        logScope.debug(`Dev tools window (${devToolsWindowId}) closed for window ${windowId}`);
        unregisterDevTools();
        devToolsWindow = null;
      });
    };
  }

  /**
   * setup window listeners
   * @param window the window to setup listeners
   * @returns a function to unregister window
   */
  private setupWindowListeners(
    window: BrowserWindow,
    storeFn: (windowId: string, state: WindowState) => void,
  ): () => void {
    // 保存当前窗口状态
    const saveCurrentState = () => {
      if (window.isDestroyed()) return;

      const bounds = window.getBounds();
      const isMaximized = window.isMaximized();
      const isFullScreen = window.isFullScreen();

      const currentState: WindowState = {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
        isMaximized,
        isFullScreen,
      };

      const windowId = this.webContentsIdToWindowId.get(window.webContents.id);
      if (windowId) {
        storeFn(windowId, currentState);
      } else {
        logScope.warn(`Window ${window.webContents.id} not found in webContentsIdToWindowId`);
      }
    };

    // 防抖保存函数，用户停止操作后延迟保存
    let saveTimeout: NodeJS.Timeout | null = null;
    const debouncedSave = () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
      saveTimeout = setTimeout(saveCurrentState, 250);
    };

    // 监听窗口事件
    const onResize = () => debouncedSave();
    const onMove = () => debouncedSave();
    const onMaximize = () => saveCurrentState();
    const onUnmaximize = () => saveCurrentState();
    const onEnterFullScreen = () => saveCurrentState();
    const onLeaveFullScreen = () => saveCurrentState();
    const onClosed = () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
      saveCurrentState();
    };

    // 注册事件监听器
    window.on("resize", onResize);
    window.on("move", onMove);
    window.on("maximize", onMaximize);
    window.on("unmaximize", onUnmaximize);
    window.on("enter-full-screen", onEnterFullScreen);
    window.on("leave-full-screen", onLeaveFullScreen);
    window.on("closed", onClosed);

    // 返回注销函数
    const unRegister = () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }

      // 移除事件监听器
      if (!window.isDestroyed()) {
        window.removeListener("resize", onResize);
        window.removeListener("move", onMove);
        window.removeListener("maximize", onMaximize);
        window.removeListener("unmaximize", onUnmaximize);
        window.removeListener("enter-full-screen", onEnterFullScreen);
        window.removeListener("leave-full-screen", onLeaveFullScreen);
        window.removeListener("closed", onClosed);
      }

      const windowId = this.webContentsIdToWindowId.get(window.webContents.id);
      if (windowId) {
        this.webContentsIdToWindowId.delete(window.webContents.id);
      }
      logScope.info(`Unregistered window ${windowId}`);
    };

    return unRegister;
  }

  generateWindowId(window: BrowserWindow, path: keyof typeof WINDOW_PATH): string {
    return `window_${path}`;
  }

  private getWindowStateFromStore(windowId: string): WindowState | undefined {
    return this.store.get(windowId);
  }

  private validateWindowState(windowState: WindowState): WindowState {
    const displays = screen.getAllDisplays();
    const primaryDisplay = screen.getPrimaryDisplay();

    // 验证最小尺寸
    const minWidth = 400;
    const minHeight = 300;

    let validatedState = { ...windowState };

    // 验证并修正宽高
    validatedState.width = Math.max(minWidth, windowState.width);
    validatedState.height = Math.max(minHeight, windowState.height);

    // 验证位置是否在任何显示器范围内
    if (windowState.x !== undefined && windowState.y !== undefined) {
      let isInValidDisplay = false;

      for (const display of displays) {
        const { x, y, width, height } = display.bounds;
        const windowRight = windowState.x + validatedState.width;
        const windowBottom = windowState.y + validatedState.height;
        const displayRight = x + width;
        const displayBottom = y + height;

        // 检查窗口是否至少部分在显示器内
        if (windowState.x < displayRight && windowRight > x && windowState.y < displayBottom && windowBottom > y) {
          isInValidDisplay = true;
          break;
        }
      }

      // 如果不在任何显示器内，重置到主显示器中心
      if (!isInValidDisplay) {
        const { x, y, width, height } = primaryDisplay.bounds;
        validatedState.x = x + Math.floor((width - validatedState.width) / 2);
        validatedState.y = y + Math.floor((height - validatedState.height) / 2);
        logScope.warn("Window position out of bounds, resetting to primary display center");
      }
    } else {
      // 如果没有位置信息，使用主显示器中心
      const { x, y, width, height } = primaryDisplay.bounds;
      validatedState.x = x + Math.floor((width - validatedState.width) / 2);
      validatedState.y = y + Math.floor((height - validatedState.height) / 2);
    }

    return validatedState;
  }

  private saveWindowStateToStore(windowId: string, windowState: WindowState): void {
    try {
      this.store.set(windowId, windowState);
      logScope.info(`Saved window state for ${windowId}:`, JSON.stringify(windowState));
    } catch (error) {
      logScope.error(`Failed to save window state for ${windowId}:`, error);
    }
  }

  private applyWindowStateToWindow(window: BrowserWindow, windowState: WindowState): void {
    try {
      const validatedState = this.validateWindowState(windowState);

      // 首先设置窗口大小和位置（在非最大化/全屏状态下）
      if (!validatedState.isMaximized && !validatedState.isFullScreen) {
        if (validatedState.x !== undefined && validatedState.y !== undefined) {
          window.setBounds({
            x: validatedState.x,
            y: validatedState.y,
            width: validatedState.width,
            height: validatedState.height,
          });
        } else {
          window.setSize(validatedState.width, validatedState.height);
        }
      } else {
        // 如果窗口是最大化或全屏状态，先设置正常大小（用于恢复时）
        window.setSize(validatedState.width, validatedState.height);
        if (validatedState.x !== undefined && validatedState.y !== undefined) {
          window.setPosition(validatedState.x, validatedState.y);
        }
      }

      // 然后应用特殊状态
      if (validatedState.isFullScreen) {
        window.setFullScreen(true);
      } else if (validatedState.isMaximized) {
        window.maximize();
      }

      logScope.info(`Applied window state:`, validatedState);
    } catch (error) {
      logScope.error("Failed to apply window state:", error);
    }
  }
}

export const windowStateManager = new WindowStateManager();
