import hotkeys from "hotkeys-js";

// 快捷键动作类型定义
export interface ShortcutActions {
    toggleSidebar: () => void;
    togglePreview: () => void;
    saveToLocal: () => void;
    createNewFile: () => void;
    switchToNextFile: () => void;
    switchToPrevFile: () => void;
    openSettings: () => void;
    toggleTheme: () => void;
    closeSettings: () => void;
    pushToGitHub: () => void;
    pullFromGitHub: () => void;
    changePreviewStyle: () => void; // 添加这个动作
    scrollToTop: () => void; // 添加这个动作
    exportPicture: () => void; // 添加这个动作
}

// 快捷键配置
export const SHORTCUT_KEYS = {
    TOGGLE_SIDEBAR: "cmd+shift+s,ctrl+shift+s",
    TOGGLE_PREVIEW: "cmd+shift+p,ctrl+shift+p",
    SAVE_FILE: "cmd+s,ctrl+s",
    CREATE_FILE: "cmd+shift+a,ctrl+shift+a",
    NEXT_FILE: "cmd+shift+down,ctrl+shift+down",
    PREV_FILE: "cmd+shift+up,ctrl+shift+up",
    OPEN_SETTINGS: "cmd+shift+c,ctrl+shift+c",
    TOGGLE_THEME: "cmd+shift+d,ctrl+shift+d",
    CLOSE_MODAL: "esc",
    PUSH_TO_GITHUB: "cmd+shift+g,ctrl+shift+g",
    PULL_FROM_GITHUB: "cmd+shift+o,ctrl+shift+o",
    CHANGE_PREVIEW_STYLE: "cmd+shift+l,ctrl+shift+l",
    SCROLL_TO_TOP: "cmd+shift+option+t,ctrl+shift+option+t",
    EXPORT_PICTURE: "cmd+shift+i,ctrl+shift+i",
} as const;

// 快捷键描述
export const SHORTCUT_DESCRIPTIONS = {
    [SHORTCUT_KEYS.TOGGLE_SIDEBAR]: "切换侧边栏",
    [SHORTCUT_KEYS.TOGGLE_PREVIEW]: "切换预览模式",
    [SHORTCUT_KEYS.SAVE_FILE]: "保存文件到本地",
    [SHORTCUT_KEYS.CREATE_FILE]: "新建文件",
    [SHORTCUT_KEYS.NEXT_FILE]: "切换到下一个文件",
    [SHORTCUT_KEYS.PREV_FILE]: "切换到上一个文件",
    [SHORTCUT_KEYS.OPEN_SETTINGS]: "打开设置",
    [SHORTCUT_KEYS.TOGGLE_THEME]: "快速切换主题",
    [SHORTCUT_KEYS.CLOSE_MODAL]: "关闭弹窗",
    [SHORTCUT_KEYS.PUSH_TO_GITHUB]: "推送到GitHub",
    [SHORTCUT_KEYS.PULL_FROM_GITHUB]: "从GitHub拉取",
    [SHORTCUT_KEYS.CHANGE_PREVIEW_STYLE]: "切换预览风格",
    [SHORTCUT_KEYS.SCROLL_TO_TOP]: "滚到顶部",
    [SHORTCUT_KEYS.EXPORT_PICTURE]: "导出图片",
} as const;

// 快捷键管理类
export class ShortcutManager {
    private actions: ShortcutActions;
    private boundKeys: string[] = [];
    private isPushInProgress: boolean = false;

    constructor(actions: ShortcutActions) {
        this.actions = actions;
    }

    /**
     * 设置推送状态
     */
    setPushInProgress(inProgress: boolean): void {
        this.isPushInProgress = inProgress;
    }

    /**
     * 绑定所有快捷键
     */
    bindAll(disabled?: boolean): void {
        this.bindShortcut(
            SHORTCUT_KEYS.TOGGLE_SIDEBAR,
            this.actions.toggleSidebar,
        );
        this.bindShortcut(
            SHORTCUT_KEYS.SCROLL_TO_TOP,
            this.actions.scrollToTop,
        );
        this.bindShortcut(
            SHORTCUT_KEYS.NEXT_FILE,
            this.actions.switchToNextFile,
        );
        this.bindShortcut(
            SHORTCUT_KEYS.PREV_FILE,
            this.actions.switchToPrevFile,
        );
        this.bindShortcut(
            SHORTCUT_KEYS.EXPORT_PICTURE,
            this.actions.exportPicture,
        );
        if (disabled) {
            return;
        }

        this.bindShortcut(
            SHORTCUT_KEYS.TOGGLE_PREVIEW,
            this.actions.togglePreview,
        );
        this.bindShortcut(SHORTCUT_KEYS.SAVE_FILE, this.actions.saveToLocal);
        this.bindShortcut(
            SHORTCUT_KEYS.CREATE_FILE,
            this.actions.createNewFile,
        );

        this.bindShortcut(
            SHORTCUT_KEYS.OPEN_SETTINGS,
            this.actions.openSettings,
        );
        this.bindShortcut(SHORTCUT_KEYS.TOGGLE_THEME, this.actions.toggleTheme);
        this.bindShortcut(
            SHORTCUT_KEYS.CLOSE_MODAL,
            this.actions.closeSettings,
        );
        this.bindShortcut(
            SHORTCUT_KEYS.PUSH_TO_GITHUB,
            this.actions.pushToGitHub,
        );

        // 绑定 pull 快捷键，但添加上下文检查
        this.bindShortcut(SHORTCUT_KEYS.PULL_FROM_GITHUB, () => {
            // 如果正在推送，则阻止 pull 操作
            if (this.isPushInProgress) {
                console.log("正在推送中，阻止 pull 操作");
                return;
            }
            this.actions.pullFromGitHub();
        });

        this.bindShortcut(
            SHORTCUT_KEYS.CHANGE_PREVIEW_STYLE,
            this.actions.changePreviewStyle,
        );
    }

    /**
     * 绑定单个快捷键
     */
    private bindShortcut(keys: string, action: () => void): void {
        hotkeys(keys, (event) => {
            event.preventDefault();
            action();
        });
        this.boundKeys.push(keys);
    }

    /**
     * 解绑所有快捷键
     */
    unbindAll(): void {
        this.boundKeys.forEach((keys) => {
            hotkeys.unbind(keys);
        });
        this.boundKeys = [];
    }

    /**
     * 获取所有快捷键信息
     */
    getAllShortcuts(): Array<{ keys: string; description: string }> {
        return Object.entries(SHORTCUT_KEYS).map(([, keys]) => ({
            keys: keys.split(",")[0], // 取第一个键位组合（cmd版本）
            description: SHORTCUT_DESCRIPTIONS[keys],
        }));
    }

    /**
     * 检查特定条件下的快捷键
     */
    bindConditional(
        keys: string,
        condition: () => boolean,
        action: () => void,
    ): void {
        hotkeys(keys, (event) => {
            if (condition()) {
                event.preventDefault();
                action();
            }
        });
        this.boundKeys.push(keys);
    }
}

/**
 * 创建快捷键管理器实例
 */
export function createShortcutManager(
    actions: ShortcutActions,
): ShortcutManager {
    return new ShortcutManager(actions);
}

/**
 * 格式化快捷键显示文本
 */
export function formatShortcutDisplay(keys: string): string {
    return keys
        .split(",")[0]
        .replace("cmd", "Cmd")
        .replace("ctrl", "Ctrl")
        .replace("shift", "Shift")
        .replace("+", " + ")
        .replace("up", "↑")
        .replace("down", "↓");
}

/**
 * 获取平台特定的快捷键文本
 */
export function getPlatformShortcut(keys: string): string {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const keyArray = keys.split(",");
    const targetKey = isMac ? keyArray[0] : keyArray[1] || keyArray[0];
    return formatShortcutDisplay(targetKey);
}
