# Markit 本地缓存功能

## 概述

Markit 现在支持完整的本地缓存功能，确保用户在刷新页面后能够恢复到之前的工作状态。同时支持 URL 参数同步，用户可以通过修改 URL 来动态调整应用状态。

## 缓存内容

### 1. 文档状态

-   **当前文档索引**: 记住用户最后选择的文档
-   **文档内容**: 自动保存所有编辑的文档内容
-   **文档标题**: 保存用户设置的文档标题

### 2. 界面状态

-   **预览/编辑模式**: 记住用户最后使用的模式
-   **侧边栏状态**: 记住侧边栏是展开还是收起
-   **编辑模式**: 记住是否处于编辑状态

### 3. 应用设置

-   **主题设置**: 记住明暗主题选择
-   **预览样式**: 记住用户选择的预览样式
-   **GitHub 配置**: 保存 GitHub Token 和仓库信息

## 技术实现

### 存储工具 (`src/utils/storage.ts`)

提供了统一的存储管理接口：

### URL 参数管理 (`src/utils/urlParams.ts`)

提供了 URL 参数解析、更新和监听功能：

```typescript
// 获取URL参数
const params = getURLParams();

// 更新URL参数
updateURLParams({ editMode: true, fileIndex: 2 });

// 监听URL变化
watchURLChanges((params) => {
    // 处理URL参数变化
});
```

```typescript
// 文件存储
fileStorage.save(files);
fileStorage.load();

// 应用状态存储
appStateStorage.save(state);
appStateStorage.load();

// 设置存储
settingsStorage.save(settings);
settingsStorage.load();

// 主题存储
themeStorage.save(isDark);
themeStorage.load();

// 预览样式存储
previewStyleStorage.save(styleId);
previewStyleStorage.load();
```

### 自动保存机制

-   使用 Vue 3 的 `watch` API 监听状态变化
-   状态变化时自动保存到 localStorage
-   页面加载时自动恢复所有缓存状态
-   URL 参数变化时自动更新应用状态并缓存

### 安全检查

-   文件索引恢复时会检查是否在有效范围内
-   所有存储操作都有错误处理
-   支持向后兼容旧版本数据

## 使用方法

### 自动缓存

所有状态变化都会自动缓存，无需手动操作。

### URL 参数同步

支持通过 URL 参数动态调整应用状态：

-   `?editmode=true` - 启用编辑模式
-   `?previewstyle=minimal` - 设置预览样式为 minimal
-   `?file=2` - 切换到第 3 个文档（索引从 0 开始）
-   `?mode=preview` - 切换到预览模式
-   `?sidebar=true` - 显示侧边栏

URL 参数优先级高于本地缓存，确保用户可以通过修改 URL 来覆盖缓存状态。

### 手动清理缓存

```typescript
import { clearAllStorage } from "./utils/storage";

// 清理所有缓存数据
clearAllStorage();
```

## 存储键名

-   `markit-files`: 文档数据
-   `markit-app-state`: 应用状态
-   `markit-settings`: 应用设置
-   `markit-theme`: 主题设置
-   `markit-preview-style`: 预览样式

## 注意事项

1. 缓存数据存储在浏览器的 localStorage 中
2. 清除浏览器数据会丢失所有缓存
3. 不同域名下的缓存是独立的
4. 建议定期备份重要文档

## 更新日志

-   添加完整的本地缓存功能
-   重构存储逻辑，提高代码可维护性
-   增强错误处理和向后兼容性
-   优化状态恢复逻辑
-   新增 URL 参数同步功能
-   支持通过 URL 动态调整应用状态
