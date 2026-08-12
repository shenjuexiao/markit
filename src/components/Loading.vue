<template>
    <Transition name="loading-fade">
        <div
            v-if="visible"
            class="loading-overlay"
            :class="{ 'dark-theme': isDarkTheme }"
        >
            <div class="loading-content">
                <div
                    class="loading-spinner"
                    v-if="loadingType === 'indeterminate'"
                ></div>
                <div class="loading-progress" v-else>
                    <div class="progress-bar">
                        <div
                            class="progress-fill"
                            :style="{ width: `${loadingProgress}%` }"
                        ></div>
                    </div>
                    <div class="progress-text">
                        {{ Math.round(loadingProgress || 0) }}%
                    </div>
                </div>
                <div class="loading-text">{{ message }}</div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { inject, ref, type Ref } from "vue";

// 注入主题状态
const isDarkTheme = inject("isDarkTheme", ref(false)) as Ref<boolean>;

defineProps<{
    visible: boolean;
    message?: string;
    loadingType?: "indeterminate" | "determinate";
    loadingProgress?: number;
}>();
</script>

<style scoped>
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    backdrop-filter: blur(4px);
}

.loading-overlay.dark-theme {
    background: rgba(0, 0, 0, 0.8);
}

.loading-content {
    background: white;
    border-radius: 12px;
    padding: 32px 48px;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    min-width: 200px;
}

.dark-theme .loading-content {
    background: #2d2d2d;
    color: #e0e0e0;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.loading-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #2196f3;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
}

.dark-theme .loading-spinner {
    border-color: #404040;
    border-top-color: #2196f3;
}

.loading-progress {
    margin: 0 auto 16px;
    width: 100%;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 8px;
}

.dark-theme .progress-bar {
    background: #404040;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #2196f3, #64b5f6);
    border-radius: 4px;
    transition: width 0.3s ease;
}

.progress-text {
    font-size: 14px;
    font-weight: 500;
    color: #666;
    text-align: center;
}

.dark-theme .progress-text {
    color: #b0b0b0;
}

.loading-text {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-top: 8px;
}

.dark-theme .loading-text {
    color: #e0e0e0;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

/* 过渡动画 */
.loading-fade-enter-active,
.loading-fade-leave-active {
    transition: opacity 0.3s ease;
}

.loading-fade-enter-from,
.loading-fade-leave-to {
    opacity: 0;
}

.loading-fade-enter-to,
.loading-fade-leave-from {
    opacity: 1;
}
</style>
