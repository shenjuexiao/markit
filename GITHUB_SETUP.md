# GitHub 设置指南

## 🚀 快速开始

### 1. 获取 GitHub Personal Access Token

1. 访问 [GitHub Settings](https://github.com/settings)
2. 点击左侧菜单的 "Developer settings"
3. 选择 "Personal access tokens" > "Tokens (classic)"
4. 点击 "Generate new token (classic)"
5. 设置 Token 描述（如：Markit Editor）
6. 选择权限范围：
    - ✅ `repo` - 完整的仓库访问权限
    - ✅ `workflow` - 工作流权限（可选）
7. 点击 "Generate token"
8. **重要**：复制生成的 token（只显示一次！）

### 2. 在 Markit 中配置

1. 打开 Markit 编辑器
2. 按 `Cmd/Ctrl + Shift + C` 打开设置
3. 在 "GitHub Token" 字段中输入你的 token
4. 在 "仓库地址" 字段中输入你的仓库地址，格式：
    ```
    https://github.com/username/repository
    ```
    或者
    ```
    username/repository
    ```
5. 点击 "保存" 按钮

### 3. 使用 GitHub 功能

#### 📤 Push（推送）

-   点击工具栏上的 📤 Push 按钮
-   系统会将当前所有文件推送到 GitHub 仓库
-   每个文件会创建一个提交，包含更新时间和文件数量信息

#### 📥 Pull（拉取）

-   点击工具栏上的 📥 Pull 按钮
-   系统会从 GitHub 仓库拉取最新的文件
-   会询问是否覆盖本地文件

## 🔧 高级配置

### 仓库分支

默认使用 `main` 分支，如需使用其他分支，可以在代码中修改 `GitHubConfig` 的 `branch` 属性。

### 文件命名规则

-   文件名会自动转换为安全的格式（移除特殊字符）
-   所有文件以 `.md` 扩展名保存
-   文件路径基于文件标题生成

### 提交信息格式

-   Push: `feat: 更新 X 个文件 - 时间戳`
-   Pull: `feat: 同步 X 个文件 - 时间戳`

## 🚨 注意事项

1. **Token 安全**：不要将你的 GitHub token 分享给他人
2. **权限范围**：确保 token 有足够的权限访问目标仓库
3. **网络连接**：需要稳定的网络连接来访问 GitHub API
4. **API 限制**：GitHub API 有速率限制，避免频繁操作
5. **文件冲突**：Push 前建议先 Pull 最新内容
6. **快捷键安全**：Push 操作期间会自动禁用 Pull 快捷键，防止误操作

## ⌨️ 快捷键

-   **Push 到 GitHub**: `Cmd/Ctrl + Shift + G`
-   **Pull 从 GitHub**: `Cmd/Ctrl + Shift + O`

## 🐛 常见问题

### Q: Token 验证失败

A: 检查 token 是否正确，是否有足够的权限

### Q: 仓库地址格式错误

A: 确保使用正确的格式：`https://github.com/username/repository`

### Q: 推送失败

A: 检查网络连接，确认仓库存在且有写入权限

### Q: 拉取失败

A: 确认仓库存在且有读取权限，检查网络连接

## 📚 相关链接

-   [GitHub Personal Access Tokens](https://github.com/settings/tokens)
-   [GitHub API 文档](https://docs.github.com/en/rest)
-   [GitHub 权限说明](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#about-tokens)
