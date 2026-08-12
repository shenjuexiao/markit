<template>
    <div v-if="visible" class="settings-modal" @click="$emit('close')">
        <div
            class="settings-content"
            :class="{ 'dark-theme': isDarkTheme }"
            @click.stop
        >
            <h3>设置</h3>
            <div class="setting-item">
                <label>主题:</label>
                <select
                    :value="theme"
                    @change="
                        $emit(
                            'updateTheme',
                            ($event.target as HTMLSelectElement).value,
                        )
                    "
                >
                    <option value="github">GitHub</option>
                    <option value="dark">Dark</option>
                    <option value="minimal">Minimal</option>
                </select>
            </div>
            <div class="setting-item">
                <label>GitHub Token:</label>
                <input
                    :value="githubToken"
                    @input="
                        $emit(
                            'updateGithubToken',
                            ($event.target as HTMLInputElement).value,
                        )
                    "
                    type="password"
                    placeholder="输入GitHub Token"
                />
            </div>
            <div class="setting-item">
                <label>仓库地址:</label>
                <input
                    :value="githubRepo"
                    @input="
                        $emit(
                            'updateGithubRepo',
                            ($event.target as HTMLInputElement).value,
                        )
                    "
                    placeholder="用户名/仓库名"
                />
            </div>
            <div class="settings-actions">
                <button @click="$emit('save')">保存</button>
                <button @click="$emit('close')">取消</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, ref, type Ref } from "vue";
import type { SettingsEvents } from "../types";

// 注入主题状态
const isDarkTheme = inject("isDarkTheme", ref(false)) as Ref<boolean>;

defineProps<{
    visible: boolean;
    theme: string;
    githubToken: string;
    githubRepo: string;
}>();

defineEmits<SettingsEvents>();
</script>

<style scoped>
.settings-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.settings-content {
    background: #fff;
    border-radius: 8px;
    padding: 24px;
    max-width: 400px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
}

.settings-content.dark-theme {
    background: #2d2d2d;
}

.settings-content h3 {
    margin: 0 0 20px 0;
    font-size: 18px;
}

.setting-item {
    margin-bottom: 16px;
}

.setting-item label {
    display: block;
    margin-bottom: 4px;
    font-weight: 500;
}

.setting-item input,
.setting-item select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    background: #fff;
    color: #333;
}

.dark-theme .setting-item input,
.dark-theme .setting-item select {
    background: #404040;
    border-color: #555;
    color: #e0e0e0;
}

.settings-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-top: 20px;
}

.settings-actions button {
    padding: 8px 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.dark-theme .settings-actions button {
    border-color: #555;
    background: #404040;
    color: #e0e0e0;
}

.settings-actions button:first-child {
    background: #2196f3;
    color: white;
    border-color: #2196f3;
}

.settings-actions button:hover {
    opacity: 0.8;
}
</style>
