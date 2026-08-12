// 预览样式管理器
export interface PreviewStyle {
    id: string;
    name: string;
    description: string;
    className: string;
}

export const PREVIEW_STYLES: PreviewStyle[] = [
    {
        id: "github",
        name: "GitHub",
        description: "GitHub风格的Markdown预览",
        className: "preview-style-github",
    },
    {
        id: "minimal",
        name: "简约",
        description: "简约清爽的预览风格",
        className: "preview-style-minimal",
    },
];

export class PreviewStyleManager {
    private currentStyle: string = "github";
    private styleElement: HTMLStyleElement | null = null;

    constructor() {
        this.init();
    }

    private init() {
        // 从本地存储加载保存的样式
        const savedStyle = localStorage.getItem("markit-preview-style");
        if (savedStyle && PREVIEW_STYLES.find((s) => s.id === savedStyle)) {
            this.currentStyle = savedStyle;
        }

        // 创建样式元素
        this.styleElement = document.createElement("style");
        this.styleElement.id = "preview-style-dynamic";
        document.head.appendChild(this.styleElement);

        // 设置当前样式
        this.setStyle(this.currentStyle);
    }

    /**
     * 设置预览样式
     * @param styleId 样式ID
     */
    setStyle(styleId: string) {
        const style = PREVIEW_STYLES.find((s) => s.id === styleId);
        if (!style) {
            console.warn(`预览样式 ${styleId} 不存在`);
            return;
        }

        this.currentStyle = styleId;

        // 更新样式类名 - 查找所有预览容器
        const previewContainers =
            document.querySelectorAll(".preview-container");
        const previewContents = document.querySelectorAll(".preview-content");

        previewContainers.forEach((container) => {
            // 移除所有样式类
            PREVIEW_STYLES.forEach((s) => {
                container.classList.remove(s.className);
            });
            // 添加当前样式类
            container.classList.add(style.className);
        });

        previewContents.forEach((content) => {
            // 移除所有样式类
            PREVIEW_STYLES.forEach((s) => {
                content.classList.remove(s.className);
            });
            // 添加当前样式类
            content.classList.add(style.className);
        });

        // 保存到本地存储
        localStorage.setItem("markit-preview-style", styleId);

        console.log(`预览样式已切换到: ${style.name}`);
    }

    /**
     * 获取当前样式
     */
    getCurrentStyle(): string {
        return this.currentStyle;
    }

    /**
     * 获取所有可用样式
     */
    getAvailableStyles(): PreviewStyle[] {
        return [...PREVIEW_STYLES];
    }

    /**
     * 添加新的预览样式
     * @param style 新样式定义
     */
    addStyle(style: PreviewStyle) {
        // 检查是否已存在
        const existingIndex = PREVIEW_STYLES.findIndex(
            (s) => s.id === style.id,
        );
        if (existingIndex >= 0) {
            PREVIEW_STYLES[existingIndex] = style;
        } else {
            PREVIEW_STYLES.push(style);
        }
    }

    /**
     * 移除预览样式
     * @param styleId 样式ID
     */
    removeStyle(styleId: string) {
        const index = PREVIEW_STYLES.findIndex((s) => s.id === styleId);
        if (index >= 0) {
            PREVIEW_STYLES.splice(index, 1);

            // 如果移除的是当前样式，切换到默认样式
            if (this.currentStyle === styleId) {
                this.setStyle("github");
            }
        }
    }
}

// 创建全局实例
export const previewStyleManager = new PreviewStyleManager();
