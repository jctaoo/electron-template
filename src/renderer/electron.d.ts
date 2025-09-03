export {};

// declare on window
declare global {
  interface Window {
    electronAPI: {
      storeLoginToken: (token: string) => Promise<void>;
      clearSession: () => Promise<void>;
      setWindowTheme: (theme: "light" | "dark" | "system") => Promise<void>;
    };
  }
}
