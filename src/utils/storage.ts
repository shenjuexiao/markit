import type { FileItem, AppState, Settings } from "../types";
import type { URLParams } from "./urlParams";

// 存储键名常量
const STORAGE_KEYS = {
    FILES: "markit-files",
    APP_STATE: "markit-app-state",
    SETTINGS: "markit-settings",
    THEME: "markit-theme",
    PREVIEW_STYLE: "markit-preview-style",
} as const;

// 文件存储管理
export const fileStorage = {
    save: (files: FileItem[]) => {
        try {
            localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));
        } catch (error) {
            console.error("保存文件失败:", error);
        }
    },

    load: (): FileItem[] => {
        try {
            const savedFiles = localStorage.getItem(STORAGE_KEYS.FILES);
            if (savedFiles) {
                const parsedFiles = JSON.parse(savedFiles);
                // 为旧版本的文件添加GitHub状态字段
                return parsedFiles.map((file: FileItem) => ({
                    ...file,
                    isPushedToGitHub: file.isPushedToGitHub ?? false,
                }));
            }
        } catch (error) {
            console.error("加载文件失败:", error);
        }
        return [];
    },
};

// 应用状态存储管理
export const appStateStorage = {
    save: (state: AppState) => {
        try {
            localStorage.setItem(STORAGE_KEYS.APP_STATE, JSON.stringify(state));
        } catch (error) {
            console.error("保存应用状态失败:", error);
        }
    },

    load: (): Partial<AppState> => {
        try {
            const savedState = localStorage.getItem(STORAGE_KEYS.APP_STATE);
            if (savedState) {
                return JSON.parse(savedState);
            }
        } catch (error) {
            console.error("加载应用状态失败:", error);
        }
        return {};
    },

    // 根据URL参数更新状态
    updateFromURL: (urlParams: URLParams): Partial<AppState> => {
        const updates: Partial<AppState> = {};

        if (urlParams.viewMode !== undefined) {
            updates.viewMode = urlParams.viewMode;
        }

        return updates;
    },
};

// 设置存储管理
export const settingsStorage = {
    save: (settings: Settings) => {
        try {
            localStorage.setItem(
                STORAGE_KEYS.SETTINGS,
                JSON.stringify(settings),
            );
        } catch (error) {
            console.error("保存设置失败:", error);
        }
    },

    load: (): Partial<Settings> => {
        try {
            const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
            if (savedSettings) {
                return JSON.parse(savedSettings);
            }
        } catch (error) {
            console.error("加载设置失败:", error);
        }
        return {};
    },
};

// 主题存储管理
export const themeStorage = {
    save: (isDark: boolean) => {
        try {
            localStorage.setItem(STORAGE_KEYS.THEME, isDark ? "dark" : "light");
        } catch (error) {
            console.error("保存主题失败:", error);
        }
    },

    load: (): boolean => {
        try {
            const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
            return savedTheme === "dark";
        } catch (error) {
            console.error("加载主题失败:", error);
        }
        return false;
    },
};

// 预览样式存储管理
export const previewStyleStorage = {
    save: (styleId: string) => {
        try {
            localStorage.setItem(STORAGE_KEYS.PREVIEW_STYLE, styleId);
        } catch (error) {
            console.error("保存预览样式失败:", error);
        }
    },

    load: (): string | null => {
        try {
            return localStorage.getItem(STORAGE_KEYS.PREVIEW_STYLE);
        } catch (error) {
            console.error("加载预览样式失败:", error);
        }
        return null;
    },
};

// 清理所有存储
export const clearAllStorage = () => {
    try {
        Object.values(STORAGE_KEYS).forEach((key) => {
            localStorage.removeItem(key);
        });
    } catch (error) {
        console.error("清理存储失败:", error);
    }
};
