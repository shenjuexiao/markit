# Markit URL 参数使用示例

## 概述

Markit 支持通过 URL 参数来动态调整应用状态。这些参数会自动同步到本地缓存，确保刷新页面后状态保持一致。

## 支持的 URL 参数

### 编辑模式

```
?editmode=true    # 启用编辑模式
?editmode=false   # 禁用编辑模式（默认）
```

### 预览样式

```
?previewstyle=github    # GitHub风格预览（默认）
?previewstyle=minimal   # 简约风格预览
```

### 文档选择

```
?file=0    # 选择第1个文档
?file=1    # 选择第2个文档
?file=2    # 选择第3个文档
```

### 预览模式

```
?mode=preview    # 切换到预览模式
?mode=edit      # 切换到编辑模式（默认）
```

### 侧边栏状态

```
?sidebar=true    # 显示侧边栏
?sidebar=false   # 隐藏侧边栏（默认）
```

## 组合使用示例

### 基本组合

```
# 编辑模式 + 第2个文档 + 简约预览样式
?editmode=true&file=1&previewstyle=minimal

# 预览模式 + 第3个文档 + 显示侧边栏
?mode=preview&file=2&sidebar=true
```

### 完整示例

```
# 完整的应用状态配置
?editmode=true&file=1&previewstyle=minimal&sidebar=true&mode=preview
```

## 实际应用场景

### 1. 分享特定文档状态

```
# 分享第2个文档的预览模式
https://your-domain.com/?file=1&mode=preview
```

### 2. 快速切换到编辑模式

```
# 直接进入编辑模式
https://your-domain.com/?editmode=true
```

### 3. 预设界面布局

```
# 简约风格 + 隐藏侧边栏
https://your-domain.com/?previewstyle=minimal&sidebar=false
```

### 4. 演示模式

```
# 预览模式 + 简约样式 + 显示侧边栏
https://your-domain.com/?mode=preview&previewstyle=minimal&sidebar=true
```

## 注意事项

1. **参数优先级**: URL 参数优先级高于本地缓存
2. **参数验证**: 无效的参数会被忽略
3. **状态同步**: 所有 URL 参数变化都会自动同步到本地缓存
4. **浏览器兼容**: 支持现代浏览器的 History API
5. **参数顺序**: 参数顺序不影响功能

## 开发调试

### 查看当前 URL 参数

```javascript
// 在浏览器控制台中查看
console.log(new URLSearchParams(window.location.search));
```

### 手动更新 URL 参数

```javascript
// 在浏览器控制台中测试
const url = new URL(window.location.href);
url.searchParams.set("file", "2");
url.searchParams.set("mode", "preview");
window.history.replaceState({}, "", url.toString());
```

## 技术实现

URL 参数管理通过以下机制实现：

1. **参数解析**: 使用 `URLSearchParams` API 解析查询字符串
2. **状态更新**: 参数变化时自动更新应用状态
3. **缓存同步**: 状态变化时自动保存到本地存储
4. **事件监听**: 监听浏览器前进后退和 URL 变化事件
5. **历史管理**: 使用 `history.replaceState` 更新 URL 而不刷新页面
