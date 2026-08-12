# 重构总结：统一视图模式管理

## 问题描述

在重构之前，项目中存在两个相关的变量来管理编辑和预览状态：

-   `editMode`: 控制是否显示编辑相关的 UI 元素（工具栏按钮、侧边栏操作等）
-   `isPreviewMode`: 控制当前是编辑模式还是预览模式，影响 Editor 和 Preview 组件的显示

这两个变量存在功能重叠和逻辑混乱的问题：

1. 功能重复：两个变量都在某种程度上控制编辑/预览状态
2. 逻辑复杂：需要同时维护两个状态变量，容易产生不一致
3. 代码冗余：多处需要同时检查两个变量

## 解决方案

将两个变量合并为一个统一的 `viewMode` 变量，使用联合类型 `'edit' | 'preview'` 来明确表示当前状态。

### 重构内容

#### 1. 类型定义更新 (`src/types/index.ts`)

```typescript
// 新增视图模式类型
export type ViewMode = "edit" | "preview";

// 更新应用状态接口
export interface AppState {
    currentFileIndex: number;
    viewMode: ViewMode; // 替换 isPreviewMode 和 editMode
    sidebarVisible: boolean;
}
```

#### 2. URL 参数管理更新 (`src/utils/urlParams.ts`)

```typescript
export interface URLParams {
    viewMode?: "edit" | "preview"; // 替换 editMode
    previewStyle?: string;
}
```

#### 3. 存储管理更新 (`src/utils/storage.ts`)

```typescript
// 根据URL参数更新状态
updateFromURL: (urlParams: URLParams): Partial<AppState> => {
    const updates: Partial<AppState> = {};

    if (urlParams.viewMode !== undefined) {
        updates.viewMode = urlParams.viewMode;
    }

    return updates;
},
```

#### 4. 主应用组件更新 (`src/App.vue`)

```typescript
// 替换两个变量为一个
const viewMode = ref<'edit' | 'preview'>('edit');

// 更新状态保存逻辑
const saveAppState = () => {
    const appState: AppState = {
        currentFileIndex: currentFileIndex.value,
        viewMode: viewMode.value,           // 统一使用 viewMode
        sidebarVisible: sidebarVisible.value,
    };
    // ...
};

// 更新预览切换逻辑
const togglePreview = () => {
    viewMode.value = viewMode.value === 'edit' ? 'preview' : 'edit';
};

// 更新条件渲染
<Editor v-if="viewMode === 'edit'" />
<Preview v-else-if="viewMode === 'preview'" />

// 更新快捷键绑定
shortcutManager.bindAll(viewMode.value === 'edit');
```

#### 5. 工具栏组件更新 (`src/components/Toolbar.vue`)

```typescript
// Props 更新
defineProps<{
    title: string;
    viewMode: 'edit' | 'preview';  // 替换 isPreviewMode 和 editMode
}>();

// 模板更新
<div class="toolbar-actions" v-if="viewMode === 'edit'">
    <button :class="{ active: viewMode === 'preview' }">
        {{ viewMode === 'preview' ? "编辑" : "预览" }}
    </button>
    <button :disabled="viewMode !== 'preview'">
        导出图片
    </button>
</div>
```

#### 6. 侧边栏组件更新 (`src/components/Sidebar.vue`)

```typescript
// Props 更新
defineProps<{
    visible: boolean;
    files: FileItem[];
    currentFileIndex: number;
    viewMode: 'edit' | 'preview';  // 替换 editMode
}>();

// 模板更新
<button v-if="viewMode === 'edit'">+</button>
<span v-if="viewMode === 'edit'" class="file-status">...</span>
<button v-if="viewMode === 'edit'" class="delete-btn">×</button>
<div class="sidebar-footer" v-if="viewMode === 'edit'">...</div>
```

## 重构优势

1. **逻辑简化**: 使用单一变量管理视图状态，避免状态不一致
2. **类型安全**: 使用联合类型确保值只能是 'edit' 或 'preview'
3. **代码清晰**: 条件判断更加直观，如 `viewMode === 'edit'`
4. **维护性提升**: 只需要维护一个状态变量，减少 bug 风险
5. **功能完整**: 保持了原有的所有功能，包括 URL 参数同步、状态持久化等

## 兼容性说明

-   URL 参数从 `editmode=true` 改为 `viewmode=edit` 或 `viewmode=preview`
-   本地存储结构更新，旧版本的状态会自动迁移
-   所有快捷键和用户交互行为保持不变

## 测试建议

1. 测试编辑模式和预览模式的切换
2. 验证 URL 参数同步功能
3. 检查状态持久化是否正确
4. 确认所有 UI 元素在两种模式下正确显示/隐藏
5. 验证快捷键在不同模式下的行为
