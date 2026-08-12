<template>
    <div class="app" :class="{ 'dark-theme': isDarkTheme }">
        <!-- 侧边栏 -->
        <Sidebar
            :visible="sidebarVisible"
            :files="files"
            :current-file-index="currentFileIndex"
            :view-mode="viewMode"
            @create-file="createNewFile"
            @toggle-sidebar="toggleSidebar"
            @select-file="switchToFile"
            @delete-file="deleteFile"
            @open-settings="openSettings"
        />

        <!-- 主编辑区域 -->
        <div class="main-content">
            <!-- 顶部工具栏 -->
            <Toolbar
                :view-mode="viewMode"
                :title="currentFile.title"
                @update-title="updateTitle"
                @save-file="saveCurrentFile"
                @toggle-preview="togglePreview"
                @export-image="exportToImage"
                @save-local="saveToLocal"
                @toggle-theme="toggleTheme"
                @push-to-git-hub="pushToGitHub"
                @pull-from-git-hub="pullFromGitHub"
                @change-preview-style="changePreviewStyle"
            />

            <!-- 内容区域 -->
            <div class="content-area">
                <!-- 编辑器 -->
                <Editor
                    v-if="viewMode === 'edit'"
                    ref="editorRef"
                    :content="currentFile.content"
                    :auto-focus="false"
                    @update-content="updateContent"
                    @save-file="saveCurrentFile"
                />

                <!-- 预览区域 -->
                <Preview
                    v-else-if="viewMode === 'preview'"
                    :content="currentFile.content"
                />
            </div>

            <!-- 状态栏 -->
            <StatusBar :content="currentFile.content" />
        </div>

        <!-- 设置弹窗 -->
        <Settings
            :visible="showSettings"
            :theme="selectedTheme"
            :github-token="githubToken"
            :github-repo="githubRepo"
            @close="closeSettings"
            @save="saveSettings"
            @update-theme="updateSelectedTheme"
            @update-github-token="updateGithubToken"
            @update-github-repo="updateGithubRepo"
        />

        <!-- 全局Loading -->
        <Loading
            :visible="isLoading"
            :message="loadingMessage"
            :loading-type="loadingType"
            :loading-progress="loadingProgress"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, provide, watch } from "vue";
import type { FileItem, AppState } from "./types";
import { snapdom } from "@zumer/snapdom";
import { createShortcutManager, type ShortcutActions } from "./utils/shortcuts";
import {
    createGitHubAPI,
    formatFilePath,
    generateCommitMessage,
} from "./utils/github";
import { generateTimestampFileName } from "./utils";
import {
    fileStorage,
    appStateStorage,
    settingsStorage,
    themeStorage,
    previewStyleStorage,
} from "./utils/storage";
import {
    getURLParams,
    updateURLParams,
    watchURLChanges,
} from "./utils/urlParams";
import {
    isLoading,
    loadingMessage,
    loadingType,
    loadingProgress,
    showLoading,
    hideLoading,
} from "./utils/loading";

// 组件导入
import Sidebar from "./components/Sidebar.vue";
import Toolbar from "./components/Toolbar.vue";
import Editor from "./components/Editor.vue";
import Preview from "./components/Preview.vue";
import StatusBar from "./components/StatusBar.vue";
import Settings from "./components/Settings.vue";
import Loading from "./components/Loading.vue";

// 响应式数据
const sidebarVisible = ref(true);
const viewMode = ref<"edit" | "preview">("edit");
const isDarkTheme = ref(false);
const showSettings = ref(false);
const selectedTheme = ref("github");
const githubToken = ref("");
const githubRepo = ref("");

const files = ref<FileItem[]>([
    {
        id: 1,
        name: "欢迎使用Markit",
        title: "欢迎使用Markit",
        content:
            "# 欢迎使用Markit\n\n这是一个功能强大的Markdown编辑器，专为键盘操作而设计。\n\n## 🚀 快捷键一览\n\n### 文件操作\n- `Cmd/Ctrl + Shift + A`: 新建文件\n- `Cmd/Ctrl + S`: 保存文件到本地\n- `Cmd/Ctrl + Shift + ↑/↓`: 切换文件\n\n### 界面操作\n- `Cmd/Ctrl + Shift + S`: 切换侧边栏\n- `Cmd/Ctrl + Shift + P`: 切换预览模式\n- `Cmd/Ctrl + Shift + D`: 快速切换主题\n- `Cmd/Ctrl + Shift + C`: 打开设置\n- `ESC`: 关闭设置弹窗\n\n## ✨ 功能特性\n\n- **🎯 快捷键优先**: 所有主要操作都有快捷键支持\n- **🖼️ 图片导出**: 一键将预览导出为图片（仅预览模式）\n- **💾 自动保存**: 编辑时自动保存到本地存储\n- **🌍 跨平台**: 智能识别 macOS (Cmd) 和 Windows/Linux (Ctrl)\n- **🎨 主题切换**: 支持明暗主题无缝切换\n- **⚙️ 智能管理**: 统一的快捷键绑定和管理系统\n- **📱 响应式**: 适配不同屏幕尺寸\n\n## 🔧 技术架构\n\n- **Vue 3 + TypeScript**: 现代化前端框架\n- **Vite**: 快速构建工具\n- **Marked.js**: Markdown 解析\n- **Highlight.js**: 代码语法高亮\n- **HotKeys.js**: 跨平台快捷键管理\n\n开始编写你的文档吧！试试按 `Cmd/Ctrl + Shift + D` 切换主题。",
        lastModified: new Date(),
        isPushedToGitHub: false,
    },
]);

const currentFileIndex = ref(0);
const editorRef = ref<InstanceType<typeof Editor>>();

// 提供主题状态给子组件
provide("isDarkTheme", isDarkTheme);

// 快捷键管理器
let shortcutManager: ReturnType<typeof createShortcutManager> | null = null;

// 计算属性
const currentFile = computed(
    () =>
        files.value[currentFileIndex.value] || {
            id: 0,
            name: "新文件",
            title: "",
            content: "",
            lastModified: new Date(),
        },
);

// 状态缓存方法
const saveAppState = () => {
    const appState: AppState = {
        currentFileIndex: currentFileIndex.value,
        viewMode: viewMode.value,
        sidebarVisible: sidebarVisible.value,
    };
    appStateStorage.save(appState);

    // 同步更新URL参数
    updateURLParams({
        viewMode: viewMode.value,
    });
};

const loadAppState = () => {
    // 首先加载URL参数
    const urlParams = getURLParams();

    // 加载本地缓存的状态
    const savedState = appStateStorage.load();

    // 根据URL参数更新状态（URL参数优先级更高）
    const urlUpdates = appStateStorage.updateFromURL(urlParams);

    // 合并状态：URL参数 > 本地缓存 > 默认值
    const finalState = { ...savedState, ...urlUpdates };
    console.log("finalState", finalState);
    // 应用最终状态
    if (finalState.currentFileIndex !== undefined) {
        // 安全检查：确保文件索引在有效范围内
        if (
            finalState.currentFileIndex >= 0 &&
            finalState.currentFileIndex < files.value.length
        ) {
            currentFileIndex.value = finalState.currentFileIndex;
        }
    }
    if (finalState.viewMode !== undefined) {
        viewMode.value = finalState.viewMode;
    }
    if (finalState.sidebarVisible !== undefined) {
        sidebarVisible.value = finalState.sidebarVisible;
    }
};

// 监听状态变化并自动保存
watch(
    [currentFileIndex, viewMode, sidebarVisible],
    () => {
        saveAppState();
    },
    { deep: true },
);

// 方法
const toggleSidebar = () => {
    sidebarVisible.value = !sidebarVisible.value;
    // URL参数会自动通过watch更新
};

const togglePreview = () => {
    viewMode.value = viewMode.value === "edit" ? "preview" : "edit";
    // URL参数会自动通过watch更新
};

const toggleTheme = () => {
    isDarkTheme.value = !isDarkTheme.value;
    themeStorage.save(isDarkTheme.value);
};

const changePreviewStyle = (styleId: string) => {
    // 导入样式管理器并切换样式
    import("./styles/preview/manager").then(({ previewStyleManager }) => {
        previewStyleManager.setStyle(styleId);
    });

    // 保存到本地存储
    previewStyleStorage.save(styleId);

    // 同步更新URL参数
    updateURLParams({ previewStyle: styleId });
};

const createNewFile = () => {
    const newFile: FileItem = {
        id: Date.now(),
        name: generateTimestampFileName(),
        title: "",
        content: "",
        lastModified: new Date(),
        isPushedToGitHub: false,
    };
    files.value.push(newFile);
    currentFileIndex.value = files.value.length - 1;
};

const deleteFile = (index: number) => {
    if (files.value.length <= 1) return;

    const fileToDelete = files.value[index];

    // 如果文件还没有推送到GitHub，直接删除不保留
    if (!fileToDelete.isPushedToGitHub) {
        // 清除本地缓存
        files.value.splice(index, 1);
        if (currentFileIndex.value >= files.value.length) {
            currentFileIndex.value = files.value.length - 1;
        }
        // 保存更改到本地存储
        saveCurrentFile();
        return;
    }

    // 如果文件已经推送到GitHub，询问用户是否确定删除
    if (
        confirm(
            `文件 "${
                fileToDelete.title || fileToDelete.name
            }" 已经推送到GitHub，确定要删除吗？`,
        )
    ) {
        files.value.splice(index, 1);
        if (currentFileIndex.value >= files.value.length) {
            currentFileIndex.value = files.value.length - 1;
        }
        // 保存更改到本地存储
        saveCurrentFile();
    }
};

const switchToFile = (index: number) => {
    saveCurrentFile();
    currentFileIndex.value = index;
    // URL参数会自动通过watch更新
};

const updateTitle = (title: string) => {
    if (currentFile.value) {
        currentFile.value.title = title;
        // 如果标题不为空，同步更新文件名
        if (title.trim()) {
            currentFile.value.name = title;
        }
        // 保存更改
        saveCurrentFile();
    }
};

const updateContent = (content: string) => {
    if (currentFile.value) {
        // 如果内容发生变化且之前已推送到GitHub，重置状态
        if (
            currentFile.value.content !== content &&
            currentFile.value.isPushedToGitHub
        ) {
            currentFile.value.isPushedToGitHub = false;
        }
        currentFile.value.content = content;
    }
};

const saveCurrentFile = () => {
    if (currentFile.value) {
        currentFile.value.lastModified = new Date();
        fileStorage.save(files.value);
    }
};

const saveToLocal = () => {
    const blob = new Blob([currentFile.value.content], {
        type: "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentFile.value.title || currentFile.value.name}.md`;
    a.click();
    URL.revokeObjectURL(url);
};

const exportToImage = async () => {
    if (viewMode.value !== "preview") {
        return; // 非预览模式不执行导出
    }

    try {
        showLoading("正在生成图片...");
        const els = document.querySelectorAll(
            ".preview-content",
        ) as unknown as HTMLElement[];

        if (els.length === 0) {
            alert("找不到预览内容，请先切换到预览模式");
            return;
        }

        const result = await snapdom(els[0], {
            scale: 2,
            backgroundColor: isDarkTheme.value ? "#1a1a1a" : "#ffffff",
        });

        const filename =
            currentFile.value.title ||
            currentFile.value.name ||
            "markit-export";
        await result.download({
            format: "png",
            filename: filename,
        });
    } catch (error) {
        console.error("导出图片失败:", error);
        alert("导出图片失败，请重试");
    } finally {
        hideLoading();
    }
};

const openSettings = () => {
    showSettings.value = true;
};

const closeSettings = () => {
    showSettings.value = false;
};

const updateSelectedTheme = (theme: string) => {
    selectedTheme.value = theme;
};

const updateGithubToken = (token: string) => {
    githubToken.value = token;
};

const updateGithubRepo = (repo: string) => {
    githubRepo.value = repo;
};

const saveSettings = () => {
    settingsStorage.save({
        theme: selectedTheme.value,
        githubToken: githubToken.value,
        githubRepo: githubRepo.value,
    });
    closeSettings();
};

// GitHub 相关方法
const pushToGitHub = async () => {
    if (!githubToken.value || !githubRepo.value) {
        alert("请先在设置中配置GitHub Token和仓库地址");
        return;
    }

    try {
        // 设置推送状态，禁用 pull 快捷键
        if (shortcutManager) {
            shortcutManager.setPushInProgress(true);
        }

        // 解析仓库地址
        const repoMatch = githubRepo.value.match(
            /github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/,
        );
        if (!repoMatch) {
            alert(
                "GitHub仓库地址格式不正确，请使用格式：https://github.com/owner/repo",
            );
            return;
        }

        const [, owner, repo] = repoMatch;
        const githubAPI = createGitHubAPI({
            token: githubToken.value,
            owner,
            repo,
        });

        // 验证配置
        const validation = await githubAPI.validateConfig();
        if (!validation.success) {
            alert(`GitHub配置验证失败: ${validation.error}`);
            return;
        }

        // 准备要推送的文件
        const filesToPush = files.value.map((file: FileItem) => ({
            path: formatFilePath(file.title || file.name),
            content: file.content,
            message: generateCommitMessage("push", [file.title || file.name]),
        }));

        // 推送文件
        const result = await githubAPI.pushFiles(filesToPush);
        if (result.success) {
            // 标记文件已推送到GitHub
            if (currentFile.value) {
                currentFile.value.isPushedToGitHub = true;
                saveCurrentFile();
            }
            alert("文件成功推送到GitHub仓库！");
        } else {
            alert(`推送失败: ${result.error}`);
        }
    } catch (error) {
        console.error("推送到GitHub失败:", error);
        alert("推送失败，请检查网络连接和配置");
    } finally {
        // 恢复 pull 快捷键
        if (shortcutManager) {
            shortcutManager.setPushInProgress(false);
        }
    }
};

const pullFromGitHub = async () => {
    if (!githubToken.value || !githubRepo.value) {
        alert("请先在设置中配置GitHub Token和仓库地址");
        return;
    }

    // 添加确认对话框，防止误操作
    if (!confirm("确定要从GitHub拉取最新文件吗？这将覆盖本地文件。")) {
        return;
    }

    try {
        // 解析仓库地址
        const repoMatch = githubRepo.value.match(
            /github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/,
        );
        if (!repoMatch) {
            alert(
                "GitHub仓库地址格式不正确，请使用格式：https://github.com/owner/repo",
            );
            return;
        }

        const [, owner, repo] = repoMatch;
        const githubAPI = createGitHubAPI({
            token: githubToken.value,
            owner,
            repo,
        });

        // 验证配置
        const validation = await githubAPI.validateConfig();
        if (!validation.success) {
            alert(`GitHub配置验证失败: ${validation.error}`);
            return;
        }

        // 拉取文件
        const result = await githubAPI.pullFiles();
        if (result.success) {
            // 将拉取的文件转换为本地文件格式
            const pulledFiles: FileItem[] = result.data.map(
                (file: any, index: number) => ({
                    id: Date.now() + index,
                    name: file.path.replace(/\.md$/, ""),
                    title: file.path.replace(/\.md$/, ""),
                    content: file.content,
                    lastModified: new Date(),
                    isPushedToGitHub: true, // 从GitHub拉取的文件标记为已推送
                }),
            );

            // 询问用户是否要覆盖现有文件
            if (
                confirm(
                    `从GitHub拉取了 ${pulledFiles.length} 个文件，是否要覆盖现有文件？`,
                )
            ) {
                files.value = pulledFiles;
                currentFileIndex.value = 0;
                saveCurrentFile();
                alert("文件同步成功！");
            }
        } else {
            alert(`拉取失败: ${result.error}`);
        }
    } catch (error) {
        console.error("从GitHub拉取失败:", error);
        alert("拉取失败，请检查网络连接和配置");
    }
};

const exportPicture = () => {
    if (viewMode.value === "preview") {
        exportToImage();
    } else {
        togglePreview();
        setTimeout(() => {
            exportToImage();
        }, 400);
    }
};

// 快捷键设置
const setupShortcuts = () => {
    // 定义快捷键动作
    const actions: ShortcutActions = {
        toggleSidebar,
        togglePreview,
        saveToLocal,
        createNewFile,
        switchToNextFile: () => {
            const nextIndex = (currentFileIndex.value + 1) % files.value.length;
            switchToFile(nextIndex);
        },
        switchToPrevFile: () => {
            const prevIndex =
                currentFileIndex.value === 0
                    ? files.value.length - 1
                    : currentFileIndex.value - 1;
            switchToFile(prevIndex);
        },
        openSettings,
        toggleTheme,
        closeSettings: () => {
            if (showSettings.value) {
                closeSettings();
            }
        },
        pushToGitHub,
        pullFromGitHub,
        exportPicture,
        changePreviewStyle: () => {
            // 实现快捷键切换预览风格的逻辑
            // 这里可以循环切换可用的预览风格
            import("./styles/preview/manager").then(
                ({ previewStyleManager }) => {
                    const availableStyles =
                        previewStyleManager.getAvailableStyles();
                    const currentStyle = previewStyleManager.getCurrentStyle();
                    const currentIndex = availableStyles.findIndex(
                        (style) => style.id === currentStyle,
                    );
                    const nextIndex =
                        (currentIndex + 1) % availableStyles.length;
                    const nextStyle = availableStyles[nextIndex];

                    // 切换样式
                    previewStyleManager.setStyle(nextStyle.id);

                    // 保存到本地存储
                    previewStyleStorage.save(nextStyle.id);

                    // 同步更新URL参数
                    updateURLParams({ previewStyle: nextStyle.id });

                    // 更新Toolbar组件的状态
                    // 这里需要通过事件通知Toolbar组件更新
                },
            );
        },
        scrollToTop: () => {
            const previewContentRef = document.querySelector(
                ".preview-container",
            ) as HTMLElement;
            previewContentRef.scrollTo({ top: 0, behavior: "smooth" });
        },
    };

    // 创建并绑定快捷键管理器
    shortcutManager = createShortcutManager(actions);
    shortcutManager.bindAll(viewMode.value === "edit");
};

// 从url获取参数，设置视图模式

const setViewMode = () => {
    if (location.search.includes("viewmode=preview")) {
        viewMode.value = "preview";
    } else {
        viewMode.value = "edit";
    }
};

// 生命周期
onMounted(() => {
    setViewMode();

    // 加载保存的文件
    const savedFiles = fileStorage.load();
    if (savedFiles.length > 0) {
        files.value = savedFiles;
    }

    // 加载应用状态（必须在加载文件之后）
    loadAppState();

    // 如果没有缓存状态，使用默认值
    if (viewMode.value === "edit") {
        // 默认编辑模式
    }

    // 加载设置
    const savedSettings = settingsStorage.load();
    if (savedSettings.theme) {
        selectedTheme.value = savedSettings.theme;
    }
    if (savedSettings.githubToken) {
        githubToken.value = savedSettings.githubToken;
    }
    if (savedSettings.githubRepo) {
        githubRepo.value = savedSettings.githubRepo;
    }

    // 加载主题
    isDarkTheme.value = themeStorage.load();

    // 加载预览样式
    const savedPreviewStyle = previewStyleStorage.load();
    const previewStyleDefault = location.search.includes("previewstyle=minimal")
        ? "minimal"
        : "github";
    if (previewStyleDefault || savedPreviewStyle) {
        // 延迟加载样式管理器，确保组件已挂载
        import("./styles/preview/manager").then(({ previewStyleManager }) => {
            previewStyleManager.setStyle(
                previewStyleDefault || savedPreviewStyle,
            );
        });
    }

    // 设置快捷键
    setupShortcuts();

    // 监听URL变化
    watchURLChanges((urlParams) => {
        // 当URL参数变化时，更新应用状态并缓存
        const urlUpdates = appStateStorage.updateFromURL(urlParams);
        // 应用URL参数更新
        if (urlUpdates.viewMode !== undefined) {
            viewMode.value = urlUpdates.viewMode;
        }
        if (urlUpdates.sidebarVisible !== undefined) {
            sidebarVisible.value = urlUpdates.sidebarVisible;
        }
        if (
            urlUpdates.currentFileIndex !== undefined &&
            urlUpdates.currentFileIndex >= 0 &&
            urlUpdates.currentFileIndex < files.value.length
        ) {
            currentFileIndex.value = urlUpdates.currentFileIndex;
        }

        // 保存更新后的状态到缓存
        saveAppState();
    });
});

onUnmounted(() => {
    // 清理所有快捷键绑定
    shortcutManager?.unbindAll();
});
</script>

<style scoped>
.app {
    display: flex;
    height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        sans-serif;
    background: #f5f5f5;
    color: #333;
    transition: all 0.3s ease;
}

.app.dark-theme {
    background: #1a1a1a;
    color: #e0e0e0;
}

.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.content-area {
    flex: 1;
    overflow: hidden;
}
</style>
