<template>
    <div class="toolbar" :class="{ 'dark-theme': isDarkTheme }">
        <input
            :value="title"
            @input="
                $emit('updateTitle', ($event.target as HTMLInputElement).value)
            "
            @blur="$emit('saveFile')"
            class="title-input"
            placeholder="标题"
        />
        <div class="toolbar-actions" v-if="viewMode === 'edit'">
            <button
                @click="$emit('togglePreview')"
                :class="{ active: viewMode !== 'edit' }"
                :title="shortcutHints.togglePreview"
            >
                {{ viewMode !== "edit" ? "编辑" : "预览" }}
            </button>
            <button
                @click="$emit('exportImage')"
                :disabled="viewMode === 'edit'"
                :class="{ disabled: viewMode === 'edit' }"
                :title="
                    viewMode !== 'edit'
                        ? shortcutHints.exportImagePreview
                        : shortcutHints.exportImageEdit
                "
            >
                导出图片
            </button>
            <button
                @click="$emit('saveLocal')"
                :title="shortcutHints.saveLocal"
            >
                保存本地
            </button>
            <button
                @click="$emit('toggleTheme')"
                :title="shortcutHints.toggleTheme"
            >
                {{ isDarkTheme ? "☀" : "🌙" }}
            </button>

            <!-- 预览风格选择器 -->
            <div class="preview-style-selector">
                <select
                    v-model="currentPreviewStyle"
                    @change="$emit('changePreviewStyle', currentPreviewStyle)"
                    class="style-select"
                    :title="shortcutHints.changePreviewStyle"
                >
                    <option
                        v-for="style in availableStyles"
                        :key="style.id"
                        :value="style.id"
                    >
                        {{ style.name }}
                    </option>
                </select>
            </div>

            <!-- GitHub 操作按钮 -->
            <div class="github-actions">
                <button
                    @click="$emit('pushToGitHub')"
                    :title="`推送到GitHub仓库 (${getPlatformShortcut(
                        SHORTCUT_KEYS.PUSH_TO_GITHUB,
                    )})`"
                    class="github-btn push-btn"
                >
                    Push
                </button>
                <button
                    @click="$emit('pullFromGitHub')"
                    :title="`从GitHub仓库拉取 (${getPlatformShortcut(
                        SHORTCUT_KEYS.PULL_FROM_GITHUB,
                    )})`"
                    class="github-btn pull-btn"
                >
                    Pull
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, ref, computed, type Ref, onMounted } from "vue";
import type { ToolbarEvents } from "../types";
import { SHORTCUT_KEYS, getPlatformShortcut } from "../utils/shortcuts";
import {
    previewStyleManager,
    type PreviewStyle,
} from "../styles/preview/manager";

// 注入主题状态
const isDarkTheme = inject("isDarkTheme", ref(false)) as Ref<boolean>;

// 预览风格状态
const currentPreviewStyle = ref<string>("github");
const availableStyles = ref<PreviewStyle[]>([]);

// 初始化预览风格
const initPreviewStyles = () => {
    availableStyles.value = previewStyleManager.getAvailableStyles();
    currentPreviewStyle.value = previewStyleManager.getCurrentStyle();
};

// 组件挂载时初始化
onMounted(() => {
    initPreviewStyles();
});

// 快捷键提示文本
const shortcutHints = computed(() => ({
    togglePreview: `切换预览模式 (${getPlatformShortcut(
        SHORTCUT_KEYS.TOGGLE_PREVIEW,
    )})`,
    saveLocal: `保存到本地 (${getPlatformShortcut(SHORTCUT_KEYS.SAVE_FILE)})`,
    toggleTheme: `切换主题 (${getPlatformShortcut(
        SHORTCUT_KEYS.TOGGLE_THEME,
    )})`,
    exportImagePreview: "导出当前预览为图片",
    exportImageEdit: `请先切换到预览模式 (${getPlatformShortcut(
        SHORTCUT_KEYS.TOGGLE_PREVIEW,
    )})`,
    pushToGitHub: `推送到GitHub (${getPlatformShortcut(
        SHORTCUT_KEYS.PUSH_TO_GITHUB,
    )})`,
    pullFromGitHub: `从GitHub拉取 (${getPlatformShortcut(
        SHORTCUT_KEYS.PULL_FROM_GITHUB,
    )})`,
    changePreviewStyle: `切换预览风格 (${getPlatformShortcut(
        SHORTCUT_KEYS.CHANGE_PREVIEW_STYLE,
    )})`,
}));

defineProps<{
    title: string;
    viewMode: "edit" | "preview";
}>();

defineEmits<ToolbarEvents>();
</script>

<style scoped>
.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #fff;
    border-bottom: 1px solid #e0e0e0;
}

.toolbar.dark-theme {
    background: #2d2d2d;
    border-bottom-color: #444;
}

.title-input {
    flex: 1;
    background: none;
    border: none;
    font-size: 18px;
    font-weight: 600;
    color: inherit;
    outline: none;
    margin-right: 16px;
}

.toolbar-actions {
    display: flex;
    gap: 8px;
}

.toolbar-actions button {
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 6px 12px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
}

.dark-theme .toolbar-actions button {
    background: #404040;
    border-color: #555;
    color: #e0e0e0;
}

.toolbar-actions button:hover {
    background: #e0e0e0;
}

.dark-theme .toolbar-actions button:hover {
    background: #505050;
}

.toolbar-actions button.active {
    background: #2196f3;
    color: white;
    border-color: #2196f3;
}

.toolbar-actions button:disabled,
.toolbar-actions button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

.dark-theme .toolbar-actions button:disabled,
.dark-theme .toolbar-actions button.disabled {
    opacity: 0.5;
}

/* 预览风格选择器样式 */
.preview-style-selector {
    margin-right: 16px;
}

.style-select {
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 6px 12px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 100px;
}

.dark-theme .style-select {
    background: #404040;
    border-color: #555;
    color: #e0e0e0;
}

.style-select:hover {
    background: #e0e0e0;
    border-color: #bbb;
}

.dark-theme .style-select:hover {
    background: #505050;
    border-color: #666;
}

.style-select:focus {
    outline: none;
    border-color: #2196f3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}

/* GitHub 操作按钮样式 */
.github-actions {
    display: flex;
    gap: 8px;
    margin-left: 16px;
    padding-left: 16px;
    border-left: 1px solid #e0e0e0;
}

.dark-theme .github-actions {
    border-left-color: #444;
}

.github-btn {
    background: #24292e;
    color: white;
    border: 1px solid #24292e;
    border-radius: 4px;
    padding: 6px 12px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 4px;
}

.github-btn:hover {
    background: #2f363d;
    border-color: #2f363d;
}

.github-btn.push-btn {
    background: #28a745;
    border-color: #28a745;
}

.github-btn.push-btn:hover {
    background: #2ea043;
    border-color: #2ea043;
}

.github-btn.pull-btn {
    background: #0366d6;
    border-color: #0366d6;
}

.github-btn.pull-btn:hover {
    background: #0256cc;
    border-color: #0256cc;
}

.dark-theme .github-btn {
    background: #404040;
    border-color: #555;
}

.dark-theme .github-btn:hover {
    background: #505050;
    border-color: #666;
}

.dark-theme .github-btn.push-btn {
    background: #28a745;
    border-color: #28a745;
}

.dark-theme .github-btn.pull-btn {
    background: #0366d6;
    border-color: #0366d6;
}
</style>
