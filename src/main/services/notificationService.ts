import Store from "electron-store";
import log from "electron-log/main.js";
import { Notification, app, nativeImage } from "electron";
import path from "path";

export type NotificationType = "info" | "success" | "warning" | "error";

export interface NotificationOptions {
  title: string;
  body: string;
  type?: NotificationType;
  silent?: boolean;
  icon?: string;
  tag?: string; // 用于替换相同tag的通知
  actions?: Array<{
    type: "button";
    text: string;
  }>;
  timeoutType?: "default" | "never";
  clickAction?: string;
}

export interface NotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  maxNotifications: number; // 最大显示数量
  autoCloseDelay: number; // 自动关闭延迟（毫秒）
}

type NotificationStoreType = {
  settings: NotificationSettings;
  notificationHistory: Array<{
    id: string;
    title: string;
    body: string;
    type: NotificationType;
    timestamp: number;
    clicked: boolean;
  }>;
};

const defaultSettings: NotificationSettings = {
  enabled: true,
  soundEnabled: true,
  maxNotifications: 5,
  autoCloseDelay: 5000,
};

class NotificationService {
  private readonly store: Store<NotificationStoreType>;
  private activeNotifications: Map<string, Notification> = new Map();
  private notificationQueue: Array<{ id: string; options: NotificationOptions; resolve: (result: boolean) => void }> =
    [];
  private isProcessingQueue = false;

  constructor() {
    this.store = new Store<NotificationStoreType>({
      name: "notifications",
      defaults: {
        settings: defaultSettings,
        notificationHistory: [],
      },
    });
  }

  initializeService(): void {
    log.info("[NotificationService] Initializing notification service");

    // 检查通知权限
    if (!Notification.isSupported()) {
      log.warn("[NotificationService] System notifications are not supported");
      return;
    }

    // 清理过期的通知历史（保留最近100条）
    this.cleanupNotificationHistory();
  }

  private cleanupNotificationHistory(): void {
    const history = this.store.get("notificationHistory", []);
    if (history.length > 100) {
      const recentHistory = history.slice(-100);
      this.store.set("notificationHistory", recentHistory);
      log.info("[NotificationService] Cleaned up notification history");
    }
  }

  private generateNotificationId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async processNotificationQueue(): Promise<void> {
    if (this.isProcessingQueue || this.notificationQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.notificationQueue.length > 0) {
      const item = this.notificationQueue.shift();
      if (!item) continue;

      try {
        const result = await this.showNotificationInternal(item.id, item.options);
        item.resolve(result);
      } catch (error) {
        log.error("[NotificationService] Error processing notification:", error);
        item.resolve(false);
      }

      // 防止通知过于频繁，添加小延迟
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    this.isProcessingQueue = false;
  }

  private async showNotificationInternal(id: string, options: NotificationOptions): Promise<boolean> {
    const settings = this.store.get("settings");

    if (!settings.enabled) {
      log.info("[NotificationService] Notifications are disabled");
      return false;
    }

    try {
      // 如果有相同tag的通知，先关闭它
      if (options.tag && this.activeNotifications.has(options.tag)) {
        const existingNotification = this.activeNotifications.get(options.tag);
        existingNotification?.close();
        this.activeNotifications.delete(options.tag);
      }

      // 检查活跃通知数量限制
      if (this.activeNotifications.size >= settings.maxNotifications) {
        log.warn("[NotificationService] Max notifications limit reached");
        return false;
      }

      const notification = new Notification({
        title: options.title,
        body: options.body,
        silent: options.silent ?? !settings.soundEnabled,
        icon: options.icon ? nativeImage.createFromPath(options.icon) : undefined,
        actions: options.actions,
        timeoutType: options.timeoutType ?? "default",
      });

      // 设置事件监听器
      notification.on("show", () => {
        log.info("[NotificationService] Notification shown:", options.title);
        this.activeNotifications.set(options.tag || id, notification);
      });

      notification.on("click", () => {
        log.info("[NotificationService] Notification clicked:", options.title);
        this.recordNotificationInteraction(id, true);

        if (options.clickAction) {
          app.emit("notification-clicked", { id, action: options.clickAction, options });
        }
      });

      notification.on("close", () => {
        log.info("[NotificationService] Notification closed:", options.title);
        this.activeNotifications.delete(options.tag || id);
      });

      notification.on("action", (event, index) => {
        log.info("[NotificationService] Notification action clicked:", index);
        if (options.actions && options.actions[index]) {
          app.emit("notification-action", {
            id,
            action: options.actions[index].type,
            options,
          });
        }
      });

      // 显示通知
      notification.show();

      // 记录通知历史
      this.recordNotificationHistory(id, options);

      // 设置自动关闭（如果配置了）
      if (settings.autoCloseDelay > 0 && options.timeoutType !== "never") {
        setTimeout(() => {
          if (this.activeNotifications.has(options.tag || id)) {
            notification.close();
          }
        }, settings.autoCloseDelay);
      }

      return true;
    } catch (error: any) {
      log.error("[NotificationService] Failed to show notification:", error.message);
      return false;
    }
  }

  private recordNotificationHistory(id: string, options: NotificationOptions): void {
    const history = this.store.get("notificationHistory", []);

    const record = {
      id,
      title: options.title,
      body: options.body,
      type: options.type ?? ("info" as NotificationType),
      timestamp: Date.now(),
      clicked: false,
    };

    history.push(record);

    // 保持历史记录在合理范围内
    if (history.length > 200) {
      history.splice(0, history.length - 200);
    }

    this.store.set("notificationHistory", history);
  }

  private recordNotificationInteraction(id: string, clicked: boolean): void {
    const history = this.store.get("notificationHistory", []);
    const record = history.find((h) => h.id === id);
    if (record) {
      record.clicked = clicked;
      this.store.set("notificationHistory", history);
    }
  }

  // 公共方法

  async showNotification(options: NotificationOptions): Promise<boolean> {
    const id = this.generateNotificationId();

    return new Promise((resolve) => {
      this.notificationQueue.push({ id, options, resolve });
      this.processNotificationQueue();
    });
  }

  async showInfoNotification(
    title: string,
    body: string,
    additionalOptions?: Partial<NotificationOptions>,
  ): Promise<boolean> {
    return this.showNotification({
      title,
      body,
      type: "info",
      ...additionalOptions,
    });
  }

  async showSuccessNotification(
    title: string,
    body: string,
    additionalOptions?: Partial<NotificationOptions>,
  ): Promise<boolean> {
    return this.showNotification({
      title,
      body,
      type: "success",
      ...additionalOptions,
    });
  }

  async showWarningNotification(
    title: string,
    body: string,
    additionalOptions?: Partial<NotificationOptions>,
  ): Promise<boolean> {
    return this.showNotification({
      title,
      body,
      type: "warning",
      ...additionalOptions,
    });
  }

  async showErrorNotification(
    title: string,
    body: string,
    additionalOptions?: Partial<NotificationOptions>,
  ): Promise<boolean> {
    return this.showNotification({
      title,
      body,
      type: "error",
      timeoutType: "never",
      ...additionalOptions,
    });
  }

  clearAllNotifications(): void {
    log.info("[NotificationService] Clearing all notifications");

    for (const [key, notification] of this.activeNotifications.entries()) {
      notification.close();
    }

    this.activeNotifications.clear();
  }

  clearNotificationByTag(tag: string): boolean {
    if (this.activeNotifications.has(tag)) {
      const notification = this.activeNotifications.get(tag);
      notification?.close();
      this.activeNotifications.delete(tag);
      log.info("[NotificationService] Cleared notification with tag:", tag);
      return true;
    }
    return false;
  }

  getActiveNotificationsCount(): number {
    return this.activeNotifications.size;
  }

  getSettings(): NotificationSettings {
    return this.store.get("settings", defaultSettings);
  }

  updateSettings(settings: Partial<NotificationSettings>): { success: boolean; error?: string } {
    try {
      const currentSettings = this.store.get("settings", defaultSettings);
      const newSettings = { ...currentSettings, ...settings };

      this.store.set("settings", newSettings);
      log.info("[NotificationService] Settings updated:", newSettings);

      return { success: true };
    } catch (error: any) {
      const errorMsg = error.message || "Unknown error occurred";
      log.error("[NotificationService] Failed to update settings:", errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  resetSettings(): { success: boolean; error?: string } {
    try {
      this.store.set("settings", defaultSettings);
      log.info("[NotificationService] Settings reset to defaults");
      return { success: true };
    } catch (error: any) {
      const errorMsg = error.message || "Unknown error occurred";
      log.error("[NotificationService] Failed to reset settings:", errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  getNotificationHistory(limit?: number): Array<{
    id: string;
    title: string;
    body: string;
    type: NotificationType;
    timestamp: number;
    clicked: boolean;
  }> {
    const history = this.store.get("notificationHistory", []);

    if (limit && limit > 0) {
      return history.slice(-limit).reverse();
    }

    return [...history].reverse();
  }

  clearNotificationHistory(): { success: boolean; error?: string } {
    try {
      this.store.set("notificationHistory", []);
      log.info("[NotificationService] Notification history cleared");
      return { success: true };
    } catch (error: any) {
      const errorMsg = error.message || "Unknown error occurred";
      log.error("[NotificationService] Failed to clear notification history:", errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  isNotificationSupported(): boolean {
    return Notification.isSupported();
  }

  // 批量通知方法
  async showBatchNotifications(
    notifications: NotificationOptions[],
  ): Promise<{ success: boolean; results: boolean[] }> {
    try {
      const results = await Promise.all(notifications.map((options) => this.showNotification(options)));

      return {
        success: true,
        results,
      };
    } catch (error: any) {
      log.error("[NotificationService] Failed to show batch notifications:", error.message);
      return {
        success: false,
        results: [],
      };
    }
  }
}

export const notificationService = new NotificationService();
