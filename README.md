# Markit

这是一款网页版的在线 Markdown 编辑器网站，以快捷键操作著称，大多数操作均通过快捷键完成，来实现用户在网页上的鼠标使用的低频性，进一步保障用户的沉浸式编写体验，也将网站的设计风格进一步的简约化。

## ✨ 主要特性

-   🚀 **快捷键驱动** - 支持 macOS 和 Windows/Linux 的跨平台快捷键操作
-   📝 **Markdown 编辑** - 完整的 Markdown 语法支持，包括表格、代码块、链接等
-   👀 **实时预览** - 支持编辑和预览模式切换，所见即所得
-   🎨 **多主题支持** - 明暗主题切换，多种预览样式选择
-   📊 **图表支持** - 内置 Mermaid 图表渲染，支持流程图、时序图、甘特图等
-   🧮 **数学公式** - KaTeX 渲染引擎，支持 LaTeX 数学公式
-   ☁️ **GitHub 集成** - 直接与 GitHub 仓库同步，支持 Push/Pull 操作
-   💾 **本地存储** - 自动保存到浏览器本地存储
-   📱 **响应式设计** - 适配不同屏幕尺寸
-   🎯 **代码高亮** - 支持多种编程语言的语法高亮

## ⌨️ 快捷键一览

### 基础操作

-   `Cmd/Ctrl + Shift + S` - 侧边栏显示/隐藏
-   `Cmd/Ctrl + Shift + A` - 新建文件
-   `Cmd/Ctrl + Shift + ↑/↓` - 文件上下切换
-   `Cmd/Ctrl + Shift + P` - 切换编辑/预览模式
-   `Cmd/Ctrl + S` - 保存文件到本地
-   `Cmd/Ctrl + Shift + D` - 快速切换明暗主题
-   `Cmd/Ctrl + Shift + C` - 打开/关闭设置弹框
-   `ESC` - 关闭弹窗

### 高级功能

-   `Cmd/Ctrl + Shift + L` - 切换预览风格
-   `Cmd/Ctrl + Shift + Option + T` - 滚动到顶部
-   `Cmd/Ctrl + Shift + G` - 推送到 GitHub
-   `Cmd/Ctrl + Shift + O` - 从 GitHub 拉取

## 🚀 功能详解

### Markdown 编辑

-   完整的 Markdown 语法支持
-   实时语法检查
-   自动保存功能
-   Tab 键缩进支持

### 预览系统

-   **GitHub 风格** - 经典的 GitHub 样式，适合技术文档
-   **简约风格** - 清爽简洁的样式，适合阅读体验
-   代码语法高亮
-   响应式布局

### Mermaid 图表支持

-   📊 **流程图** - 使用 `graph` 或 `flowchart` 关键字
-   ⏱️ **时序图** - 使用 `sequenceDiagram` 关键字
-   📅 **甘特图** - 使用 `gantt` 关键字
-   🏗️ **类图** - 使用 `classDiagram` 关键字
-   🥧 **饼图** - 使用 `pie` 关键字
-   🔄 **状态图** - 使用 `stateDiagram-v2` 关键字

### LaTeX 数学公式

-   💡 **行内公式** - `$E = mc^2$` 或 `\(E = mc^2\)`
-   📐 **块级公式** - `$$E = mc^2$$` 或 `\[E = mc^2\]`
-   🔬 支持数学、物理、化学等各类公式
-   🎨 自动主题适配

### GitHub 集成

-   📤 **Push** - 将本地文件推送到 GitHub 仓库
-   📥 **Pull** - 从 GitHub 仓库拉取最新文件
-   🔐 **安全认证** - 支持 GitHub Personal Access Token
-   📁 **仓库管理** - 支持指定 GitHub 仓库地址和分支
-   📝 **智能提交** - 自动生成有意义的提交信息

## 🛠️ 技术栈

### 核心框架

-   **Vue 3** - 渐进式 JavaScript 框架
-   **TypeScript** - 类型安全的 JavaScript 超集
-   **Vite** - 下一代前端构建工具

### 依赖库

-   **marked.js** - Markdown 解析器
-   **highlight.js** - 代码语法高亮
-   **github-markdown-css** - GitHub 风格样式
-   **@zumer/snapdom** - 图片导出功能
-   **hotkeys-js** - 跨平台快捷键支持
-   **mermaid** - 图表渲染引擎
-   **KaTeX** - LaTeX 数学公式渲染
-   **axios** - HTTP 客户端

## 📦 安装与运行

```bash
# 克隆项目
git clone <repository-url>
cd markit

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 🏗️ 项目结构

```
src/
├── components/              # Vue 组件
│   ├── Sidebar.vue         # 侧边栏 - 文件管理
│   ├── Toolbar.vue         # 工具栏 - 主要操作
│   ├── Editor.vue          # 编辑器 - Markdown 输入
│   ├── Preview.vue         # 预览器 - Markdown 渲染
│   ├── Settings.vue        # 设置面板 - 配置管理
│   ├── StatusBar.vue       # 状态栏 - 信息显示
│   └── Loading.vue         # 加载组件 - 状态反馈
├── types/                  # TypeScript 类型定义
│   └── index.ts            # 统一类型定义
├── utils/                  # 工具函数
│   ├── shortcuts.ts        # 快捷键管理
│   ├── github.ts           # GitHub API 集成
│   ├── loading.ts          # 加载状态管理
│   └── index.ts            # 通用工具函数
├── styles/                 # 样式文件
│   └── preview/            # 预览样式
│       ├── manager.ts      # 样式管理器
│       ├── github.css      # GitHub 风格
│       ├── minimal.css     # 简约风格
│       └── syntax-highlight.css # 代码高亮
├── App.vue                 # 主应用组件
├── main.ts                 # 应用入口
└── style.css               # 全局样式
```

## ⚙️ 配置说明

### GitHub 配置

#### 1. 获取 Personal Access Token

1. 访问 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token (classic)"
3. 选择需要的权限（至少需要 `repo` 权限）
4. 复制生成的 token

#### 2. 配置仓库信息

1. 在编辑器中按 `Cmd/Ctrl + Shift + C` 打开设置
2. 输入 GitHub Token
3. 输入仓库地址（格式：`https://github.com/username/repository`）
4. 选择分支（默认为 `main`）
5. 点击保存

#### 3. 使用 GitHub 功能

-   **Push**: 使用快捷键或工具栏按钮推送文件到 GitHub
-   **Pull**: 从 GitHub 拉取最新文件到本地
-   **状态检查**: 自动检查文件同步状态

### 预览样式配置

-   支持多种预览风格切换
-   样式偏好自动保存到本地存储
-   可通过快捷键快速切换

## 🔧 开发指南

### 组件开发

-   所有组件使用 Vue 3 Composition API
-   严格的 TypeScript 类型检查
-   组件间通过事件通信，保持松耦合

### 快捷键系统

-   统一的快捷键配置管理
-   跨平台兼容性支持
-   条件性快捷键绑定
-   快捷键冲突检测

### 状态管理

-   响应式状态管理
-   本地存储持久化
-   加载状态反馈

## 📱 浏览器兼容性

-   Chrome 88+
-   Firefox 85+
-   Safari 14+
-   Edge 88+

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

感谢以下开源项目的支持：

-   [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
-   [Mermaid](https://mermaid.js.org/) - 图表和流程图工具
-   [KaTeX](https://katex.org/) - 数学公式渲染引擎
-   [GitHub Markdown CSS](https://github.com/sindresorhus/github-markdown-css) - GitHub 风格样式
