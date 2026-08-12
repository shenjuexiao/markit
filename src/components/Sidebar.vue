<template>
    <div
        class="sidebar"
        :class="{ hidden: !visible, 'dark-theme': isDarkTheme }"
    >
        <div class="sidebar-header">
            <h2>Markit</h2>
            <div class="sidebar-actions">
                <button
                    v-if="viewMode === 'edit'"
                    @click="$emit('createFile')"
                    :title="shortcutHints.createFile"
                >
                    +
                </button>
                <button
                    @click="$emit('toggleSidebar')"
                    :title="shortcutHints.toggleSidebar"
                >
                    ←
                </button>
            </div>
        </div>
        <div class="file-list">
            <div
                v-for="(file, index) in files"
                :key="file.id"
                class="file-item"
                :class="{ active: currentFileIndex === index }"
                @click="$emit('selectFile', index)"
            >
                <div class="file-info">
                    <span class="file-name">{{ file.title || file.name }}</span>
                    <span
                        v-if="viewMode === 'edit'"
                        class="file-status"
                        :class="{
                            github: file.isPushedToGitHub,
                            local: !file.isPushedToGitHub,
                        }"
                        :title="
                            file.isPushedToGitHub
                                ? '已推送到GitHub'
                                : '仅本地文件'
                        "
                    >
                        {{ file.isPushedToGitHub ? "🌐" : "💾" }}
                    </span>
                </div>
                <button
                    v-if="viewMode === 'edit'"
                    class="delete-btn"
                    @click.stop="$emit('deleteFile', index)"
                >
                    ×
                </button>
            </div>
        </div>
        <div class="sidebar-footer" v-if="viewMode === 'edit'">
            <button
                class="settings-btn"
                @click="$emit('openSettings')"
                :title="shortcutHints.openSettings"
            >
                ⚙
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, ref, computed, type Ref } from "vue";
import type { FileItem, SidebarEvents } from "../types";
import { SHORTCUT_KEYS, getPlatformShortcut } from "../utils/shortcuts";

// 注入主题状态
const isDarkTheme = inject("isDarkTheme", ref(false)) as Ref<boolean>;

// 快捷键提示文本
const shortcutHints = computed(() => ({
    createFile: `新建文件 (${getPlatformShortcut(SHORTCUT_KEYS.CREATE_FILE)})`,
    toggleSidebar: `隐藏侧边栏 (${getPlatformShortcut(
        SHORTCUT_KEYS.TOGGLE_SIDEBAR,
    )})`,
    openSettings: `打开设置 (${getPlatformShortcut(
        SHORTCUT_KEYS.OPEN_SETTINGS,
    )})`,
}));

defineProps<{
    visible: boolean;
    files: FileItem[];
    currentFileIndex: number;
    viewMode: "edit" | "preview";
}>();

defineEmits<SidebarEvents>();
</script>

<style scoped>
.sidebar {
    width: 250px;
    background: #fff;
    border-right: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
}

.sidebar.dark-theme {
    background: #2d2d2d;
    border-right-color: #444;
}

.sidebar.hidden {
    width: 0;
    overflow: hidden;
}

.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #e0e0e0;
}

.dark-theme .sidebar-header {
    border-bottom-color: #444;
}

.sidebar-header h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
}

.sidebar-actions {
    display: flex;
    gap: 8px;
}

.sidebar-actions button {
    background: none;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 4px 8px;
    cursor: pointer;
    font-size: 14px;
}

.dark-theme .sidebar-actions button {
    border-color: #555;
    color: #e0e0e0;
}

.sidebar-actions button:hover {
    background: #f0f0f0;
}

.dark-theme .sidebar-actions button:hover {
    background: #404040;
}

.file-list {
    flex: 1;
    overflow-y: auto;
}

.file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
    transition: background 0.2s ease;
}

.dark-theme .file-item {
    border-bottom-color: #444;
}

.file-item:hover {
    background: #f8f8f8;
}

.dark-theme .file-item:hover {
    background: #3a3a3a;
}

.file-item.active {
    background: #e3f2fd;
    border-left: 3px solid #2196f3;
}

.dark-theme .file-item.active {
    background: #1e3a5f;
    border-left-color: #64b5f6;
}

.file-info {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
}

.file-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.file-status {
    font-size: 14px;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 500;
}

.file-status.github {
    color: #28a745;
    background: rgba(40, 167, 69, 0.1);
}

.file-status.local {
    color: #6c757d;
    background: rgba(108, 117, 125, 0.1);
}

.dark-theme .file-status.github {
    color: #4caf50;
    background: rgba(76, 175, 80, 0.2);
}

.dark-theme .file-status.local {
    color: #9e9e9e;
    background: rgba(158, 158, 158, 0.2);
}

.delete-btn {
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    font-size: 18px;
    padding: 2px 6px;
    border-radius: 2px;
}

.delete-btn:hover {
    background: #ffebee;
    color: #f44336;
}

.dark-theme .delete-btn:hover {
    background: #4a2c2a;
    color: #ff6b6b;
}

.sidebar-footer {
    padding: 16px;
    border-top: 1px solid #e0e0e0;
}

.dark-theme .sidebar-footer {
    border-top-color: #444;
}

.settings-btn {
    background: none;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
    width: 100%;
    font-size: 16px;
}

.dark-theme .settings-btn {
    border-color: #555;
    color: #e0e0e0;
}

.settings-btn:hover {
    background: #f0f0f0;
}

.dark-theme .settings-btn:hover {
    background: #404040;
}
</style>
