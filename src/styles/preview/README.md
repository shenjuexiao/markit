# 预览样式系统

这个目录包含了 Markit 应用的预览样式系统，允许用户在不同的预览风格之间切换。

## 文件结构

```
src/styles/preview/
├── index.css          # 预览样式索引文件，导入所有样式
├── github.css         # GitHub风格预览样式
├── minimal.css        # 简约风格预览样式
├── syntax-highlight.css # 代码高亮样式
├── manager.ts         # 预览样式管理器
└── README.md          # 本文档
```

## 使用方法

### 1. 切换预览风格

在 Preview 组件中，用户可以通过下拉选择器切换不同的预览风格：

-   **GitHub**: 经典的 GitHub Markdown 风格
-   **简约**: 清爽简约的阅读体验

### 2. 添加新的预览风格

要添加新的预览风格，请按照以下步骤：

#### 步骤 1: 创建样式文件

在 `src/styles/preview/` 目录下创建新的 CSS 文件，例如 `elegant.css`：

```css
/* 优雅风格预览样式 */
.preview-style-elegant .markdown-body {
    font-family: "Georgia", serif;
    font-size: 18px;
    line-height: 1.8;
    color: #2c3e50;
    background-color: #fafafa;
    max-width: 750px;
    margin: 0 auto;
    padding: 50px 30px;
}

/* 添加更多样式... */
```

#### 步骤 2: 在索引文件中导入

在 `src/styles/preview/index.css` 中添加导入：

```css
/* 优雅风格预览样式 */
@import "./elegant.css";
```

#### 步骤 3: 在管理器中注册

在 `src/styles/preview/manager.ts` 中添加新样式：

```typescript
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
    {
        id: "elegant",
        name: "优雅",
        description: "优雅的阅读体验",
        className: "preview-style-elegant",
    },
];
```

### 3. 样式命名规范

-   所有预览样式类名都应该以 `preview-style-{styleId}` 开头
-   暗色主题样式使用 `.preview-style-{styleId}.dark-theme` 选择器
-   代码高亮样式使用 `.preview-style-{styleId} .hljs` 选择器

### 4. 样式管理器 API

```typescript
import { previewStyleManager } from "../styles/preview/manager";

// 切换样式
previewStyleManager.setStyle("minimal");

// 获取当前样式
const currentStyle = previewStyleManager.getCurrentStyle();

// 获取所有可用样式
const styles = previewStyleManager.getAvailableStyles();

// 动态添加样式
previewStyleManager.addStyle({
    id: "custom",
    name: "自定义",
    description: "自定义预览风格",
    className: "preview-style-custom",
});
```

## 样式特性

### GitHub 风格

-   经典的 GitHub Markdown 样式
-   支持完整的 GitHub 样式规范
-   包含暗色主题支持

### 简约风格

-   清爽的阅读体验
-   优化的字体和间距
-   现代化的设计元素

## 注意事项

1. **样式隔离**: 每个预览风格都有独立的样式类名，避免样式冲突
2. **响应式设计**: 所有样式都应该支持响应式布局
3. **暗色主题**: 每个风格都应该提供暗色主题支持
4. **性能优化**: 避免过度复杂的 CSS 选择器，保持渲染性能

## 扩展建议

-   可以添加更多预设风格（如：技术文档、博客、打印等）
-   支持用户自定义样式参数
-   添加样式预览功能
-   支持样式导入/导出
