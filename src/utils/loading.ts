import { ref } from "vue";

// 全局loading状态
const isLoading = ref(false);
const loadingMessage = ref("");
const loadingProgress = ref(0);
const loadingType = ref<"indeterminate" | "determinate">("indeterminate");

// 显示loading
export function showLoading(
    message: string = "加载中...",
    type: "indeterminate" | "determinate" = "indeterminate",
) {
    if (isLoading.value) {
        return;
    }
    isLoading.value = true;
    loadingMessage.value = message;
    loadingType.value = type;
    loadingProgress.value = 0;
}

// 隐藏loading
export function hideLoading() {
    isLoading.value = false;
    loadingMessage.value = "";
    loadingProgress.value = 0;
    loadingType.value = "indeterminate";
}

// 更新loading进度
export function updateLoadingProgress(progress: number, message?: string) {
    if (isLoading.value) {
        loadingProgress.value = Math.min(100, Math.max(0, progress));
        if (message) {
            loadingMessage.value = message;
        }
    }
}

// 获取loading状态
export function getLoadingState() {
    return {
        isLoading: isLoading.value,
        loadingMessage: loadingMessage.value,
        loadingProgress: loadingProgress.value,
        loadingType: loadingType.value,
    };
}

// 异步操作的loading包装器
export async function withLoading<T>(
    operation: () => Promise<T>,
    message: string = "加载中...",
    errorMessage?: string,
    type: "indeterminate" | "determinate" = "indeterminate",
): Promise<T> {
    try {
        showLoading(message, type);
        const result = await operation();
        return result;
    } catch (error) {
        if (errorMessage) {
            console.error(errorMessage, error);
        }
        throw error;
    } finally {
        hideLoading();
    }
}

// 带进度的异步操作包装器
export async function withProgressLoading<T>(
    operation: (
        updateProgress: (progress: number, message?: string) => void,
    ) => Promise<T>,
    initialMessage: string = "加载中...",
    errorMessage?: string,
): Promise<T> {
    try {
        showLoading(initialMessage, "determinate");
        return await operation(updateLoadingProgress);
    } catch (error) {
        if (errorMessage) {
            console.error(errorMessage, error);
        }
        throw error;
    } finally {
        hideLoading();
    }
}

// 导出响应式状态供组件使用
export { isLoading, loadingMessage, loadingProgress, loadingType };
