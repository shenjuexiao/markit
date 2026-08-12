<template>
    <div
        class="preview-container"
        :class="{ 'dark-theme': isDarkTheme }"
        @scroll="handleScroll"
    >
        <div
            class="preview-content markdown-body"
            :class="{ 'dark-theme': isDarkTheme }"
            v-html="renderedMarkdown"
            ref="previewContentRef"
        ></div>

        <!-- 滚到顶部按钮 -->
        <div
            v-show="showScrollToTop"
            class="scroll-to-top-btn"
            :title="shortcutHints.scrollToTop"
            @click="scrollToTop"
            :class="{ 'dark-theme': isDarkTheme }"
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M12 4L4 12H9V20H15V12H20L12 4Z" fill="currentColor" />
            </svg>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    computed,
    inject,
    ref,
    type Ref,
    onMounted,
    nextTick,
    watch,
} from "vue";
import { marked } from "marked";
import hljs from "highlight.js";
import mermaid from "mermaid";
import katex from "katex";
import "katex/dist/katex.min.css";
import { previewStyleManager } from "../styles/preview/manager";
import { SHORTCUT_KEYS, getPlatformShortcut } from "../utils/shortcuts";

// 注入主题状态
const isDarkTheme = inject("isDarkTheme", ref(false)) as Ref<boolean>;

const props = defineProps<{
    content: string;
}>();

// 滚动相关状态
const previewContentRef = ref<HTMLElement>();
const showScrollToTop = ref(false);

const shortcutHints = computed(() => ({
    scrollToTop: `滚到顶部 (${getPlatformShortcut(
        SHORTCUT_KEYS.SCROLL_TO_TOP,
    )})`,
}));

// 处理滚动事件
const handleScroll = () => {
    if (previewContentRef.value) {
        const scrollTop = previewContentRef.value.parentElement?.scrollTop!;
        showScrollToTop.value = scrollTop > 100; // 滚动超过100px时显示按钮
    }
};

// 滚到顶部
const scrollToTop = () => {
    if (previewContentRef.value) {
        previewContentRef.value.parentElement?.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }
};

// 初始化mermaid配置
onMounted(() => {
    mermaid.initialize({
        startOnLoad: false,
        theme: isDarkTheme.value ? "dark" : "default",
        securityLevel: "loose",
        fontFamily: "monospace",
        themeVariables: {
            darkMode: isDarkTheme.value,
            background: isDarkTheme.value ? "#1a1a1a" : "#ffffff",
            primaryColor: isDarkTheme.value ? "#4a9eff" : "#0366d6",
            primaryTextColor: isDarkTheme.value ? "#e0e0e0" : "#24292e",
            primaryBorderColor: isDarkTheme.value ? "#4a9eff" : "#0366d6",
            lineColor: isDarkTheme.value ? "#404040" : "#e1e4e8",
            secondaryColor: isDarkTheme.value ? "#6a737d" : "#586069",
            tertiaryColor: isDarkTheme.value ? "#6a737d" : "#f6f8fa",
        },
    });

    // 确保样式管理器正确初始化当前样式
    const currentStyle = previewStyleManager.getCurrentStyle();
    previewStyleManager.setStyle(currentStyle);
});

const renderedMarkdown = computed(() => {
    if (!props.content) return "";

    // 配置marked
    marked.setOptions({
        breaks: true,
        gfm: true,
    });

    // 渲染markdown
    let html = marked(props.content) as string;

    // 先处理块级数学公式，避免与行内公式冲突

    // 处理块级数学公式（$$...$$ 格式）
    html = html.replace(
        /\$\$([^\$\n]+?)\$\$/g,
        (match: string, formula: string) => {
            try {
                const katexHtml = katex.renderToString(formula, {
                    throwOnError: false,
                    displayMode: true,
                    output: "html",
                });
                return `<div class="math-block">${katexHtml}</div>`;
            } catch (error) {
                console.warn("块级LaTeX公式渲染失败:", error);
                return match;
            }
        },
    );

    // 处理块级数学公式 \[...\]
    html = html.replace(
        /\\\[([^\\\n]+?)\\\]/g,
        (match: string, formula: string) => {
            try {
                const katexHtml = katex.renderToString(formula, {
                    throwOnError: false,
                    displayMode: true,
                    output: "html",
                });
                return `<div class="math-block">${katexHtml}</div>`;
            } catch (error) {
                console.warn("块级LaTeX公式渲染失败:", error);
                return match;
            }
        },
    );

    // 再处理行内数学公式，避免与块级公式冲突

    // 处理行内数学公式 $...$ 或 \(...\)
    html = html.replace(
        /\$([^\$\n]+?)\$/g,
        (match: string, formula: string) => {
            try {
                return katex.renderToString(formula, {
                    throwOnError: false,
                    displayMode: false,
                    output: "html",
                });
            } catch (error) {
                console.warn("行内LaTeX公式渲染失败:", error);
                return match;
            }
        },
    );

    // 处理行内数学公式 \(...\)
    html = html.replace(
        /\\\(([^\\\n]+?)\\\)/g,
        (match: string, formula: string) => {
            try {
                return katex.renderToString(formula, {
                    throwOnError: false,
                    displayMode: false,
                    output: "html",
                });
            } catch (error) {
                console.warn("行内LaTeX公式渲染失败:", error);
                return match;
            }
        },
    );

    // 添加代码高亮
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const codeBlocks = tempDiv.querySelectorAll("pre code");

    codeBlocks.forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
    });
    const whitePng =
        "https://raw.githubusercontent.com/GitHubJiKe/markit/refs/heads/main/public/favicon_white.png";
    const blackPng =
        "https://raw.githubusercontent.com/GitHubJiKe/markit/refs/heads/main/public/favicon_black.png";
    return (
        `<div style="flex:1">${tempDiv.innerHTML}</div>` +
        `<div class="brand-footer">
            <img src="${
                isDarkTheme.value ? whitePng : blackPng
            }" alt="Markit" class="brand-icon" />
            <span class="brand-name">Markit</span>
        </div>`
    );
});

// 渲染mermaid图表
const renderMermaidCharts = async () => {
    await nextTick();

    // 查找所有mermaid代码块
    const mermaidBlocks = document.querySelectorAll(
        "pre code.language-mermaid",
    );

    mermaidBlocks.forEach(async (block, index) => {
        const container = block.parentElement;
        if (!container) return;

        // 创建mermaid容器
        const mermaidDiv = document.createElement("div");
        mermaidDiv.className = "mermaid-chart";
        mermaidDiv.style.margin = "20px 0";
        mermaidDiv.style.textAlign = "center";

        // 获取mermaid代码
        const mermaidCode = block.textContent || "";

        try {
            // 渲染mermaid图表
            const { svg } = await mermaid.render(
                `mermaid-${index}`,
                mermaidCode,
            );
            mermaidDiv.innerHTML = svg;

            // 替换原始代码块
            container.parentElement?.replaceChild(mermaidDiv, container);
        } catch (error) {
            console.error("Mermaid渲染错误:", error);
            mermaidDiv.innerHTML = `<div style="color: #e53e3e; padding: 20px; border: 1px solid #e53e3e; border-radius: 4px;">
                <p>Mermaid图表渲染失败</p>
                <p style="font-size: 12px; margin-top: 10px;">${
                    error instanceof Error ? error.message : "未知错误"
                }</p>
            </div>`;
            container.parentElement?.replaceChild(mermaidDiv, container);
        }
    });
};

// 监听内容变化，重新渲染mermaid图表
const watchContent = async () => {
    await renderMermaidCharts();
};

// 监听主题变化，重新初始化mermaid
const watchTheme = () => {
    mermaid.initialize({
        startOnLoad: false,
        theme: isDarkTheme.value ? "dark" : "default",
        securityLevel: "loose",
        fontFamily: "monospace",
        themeVariables: {
            darkMode: isDarkTheme.value,
            background: isDarkTheme.value ? "#1a1a1a" : "#ffffff",
            primaryColor: isDarkTheme.value ? "#4a9eff" : "#0366d6",
            primaryTextColor: isDarkTheme.value ? "#e0e0e0" : "#24292e",
            primaryBorderColor: isDarkTheme.value ? "#4a9eff" : "#0366d6",
            lineColor: isDarkTheme.value ? "#404040" : "#e1e4e8",
            secondaryColor: isDarkTheme.value ? "#6a737d" : "#586069",
            tertiaryColor: isDarkTheme.value ? "#6a737d" : "#f6f8fa",
        },
    });

    // 重新渲染图表
    renderMermaidCharts();
};

// 监听主题变化
watch(isDarkTheme, watchTheme);

// 监听内容变化
watch(() => props.content, watchContent, { immediate: true });
</script>

<style scoped>
.preview-container {
    height: 100%;
    overflow: auto;
}

.preview-container.dark-theme {
    background: #2d2d2d;
}

.preview-content {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    background: #fff;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #333;
}

.preview-content.dark-theme {
    background: #1a1a1a;
    color: #e0e0e0;
}

/* Mermaid图表样式 */
:deep(.mermaid-chart) {
    margin: 20px 0;
    text-align: center;
}

:deep(.mermaid-chart svg) {
    max-width: 100%;
    height: auto;
}

/* 暗色主题下的mermaid图表样式调整 */
:deep(.dark-theme .mermaid-chart svg) {
    filter: invert(0.9) hue-rotate(180deg);
}

/* LaTeX公式样式 */
:deep(.math-block) {
    text-align: center;
    margin: 20px 0;
    overflow-x: auto;
}

:deep(.math-block .katex) {
    font-size: 1.1em;
}

/* 行内LaTeX公式居中 */
:deep(.katex) {
    text-align: center;
}

/* 图片居中显示 */
:deep(.markdown-body img) {
    display: block;
    margin: 20px auto;
    text-align: center;
    max-width: 100%;
    height: auto;
}

/* 暗色主题下的LaTeX公式样式调整 */
:deep(.dark-theme .math-block .katex) {
    color: #e0e0e0;
}

:deep(.dark-theme .math-block .katex .base) {
    color: #e0e0e0;
}

/* 暗色主题下的图片样式调整 */
:deep(.dark-theme .markdown-body img) {
    filter: brightness(0.9);
}

/* 滚到顶部按钮样式 */
.scroll-to-top-btn {
    position: fixed;
    bottom: 40px;
    right: 40px;
    width: 50px;
    height: 50px;
    background: #ffffff;
    border: 1px solid #e1e4e8;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    z-index: 1000;
    color: #586069;
}

.scroll-to-top-btn:hover {
    background: #f6f8fa;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.scroll-to-top-btn.dark-theme {
    background: #2d2d2d;
    border-color: #404040;
    color: #e0e0e0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.scroll-to-top-btn.dark-theme:hover {
    background: #404040;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

@media (max-width: 768px) {
    .preview-content {
        padding: 16px;
        font-size: 16px; /* 防止iOS缩放 */
        line-height: 1.6;
    }

    .scroll-to-top-btn {
        bottom: 16px;
        right: 16px;
        width: 44px;
        height: 44px;
    }

    .preview-container.mobile {
        padding: 0;
    }
}

@media (max-width: 480px) {
    .preview-content {
        padding: 12px;
        font-size: 15px;
    }

    .scroll-to-top-btn {
        bottom: 12px;
        right: 12px;
        width: 40px;
        height: 40px;
    }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
    .preview-container {
        -webkit-overflow-scrolling: touch;
    }

    .scroll-to-top-btn:active {
        transform: scale(0.95);
    }
}

/* 横屏模式适配 */
@media (max-height: 500px) and (orientation: landscape) {
    .scroll-to-top-btn {
        bottom: 10px;
        right: 10px;
        width: 36px;
        height: 36px;
    }
}
</style>
