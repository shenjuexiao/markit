// 文件项类型定义
export interface FileItem {
    id: number;
    name: string;
    title: string;
    content: string;
    lastModified: Date;
    isPushedToGitHub?: boolean; // 是否已推送到GitHub
}

// 设置项类型定义
export interface Settings {
    theme: string;
    githubToken: string;
    githubRepo: string;
}

// 视图模式类型
export type ViewMode = "edit" | "preview";

// 应用状态类型定义
export interface AppState {
    currentFileIndex: number;
    viewMode: ViewMode;
    sidebarVisible: boolean;
}

// 事件类型定义
export interface SidebarEvents {
    createFile: [];
    toggleSidebar: [];
    selectFile: [index: number];
    deleteFile: [index: number];
    openSettings: [];
}

export interface ToolbarEvents {
    updateTitle: [title: string];
    saveFile: [];
    togglePreview: [];
    exportImage: [];
    saveLocal: [];
    toggleTheme: [];
    pushToGitHub: [];
    pullFromGitHub: [];
    changePreviewStyle: [styleId: string];
}

export interface EditorEvents {
    updateContent: [content: string];
    saveFile: [];
}

export interface SettingsEvents {
    close: [];
    save: [];
    updateTheme: [theme: string];
    updateGithubToken: [token: string];
    updateGithubRepo: [repo: string];
}
