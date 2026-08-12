# 部署说明

## GitHub Pages 自动部署

本项目使用 GitHub Actions 实现自动部署到 GitHub Pages。

### 前置条件

1. 确保你的仓库是公开的（public）
2. 仓库名称必须是 `markit`（因为 base 路径配置为 `/markit/`）

### 配置步骤

#### 1. 启用 GitHub Pages

1. 进入你的 GitHub 仓库
2. 点击 `Settings` 标签页
3. 在左侧菜单中找到 `Pages`
4. 在 `Source` 部分选择 `GitHub Actions`

#### 2. 推送代码触发部署

将代码推送到 `main` 或 `master` 分支：

```bash
git add .
git commit -m "Initial commit with GitHub Actions deployment"
git push origin main
```

#### 3. 查看部署状态

1. 在仓库页面点击 `Actions` 标签页
2. 查看 `Deploy to GitHub Pages` 工作流的执行状态
3. 部署成功后，你的应用将在 `https://[你的用户名].github.io/markit/` 上可用

### 工作流说明

-   **触发条件**: 推送到 main/master 分支或创建 PR
-   **构建环境**: Ubuntu 最新版 + Node.js 18
-   **构建步骤**: 安装依赖 → 构建项目 → 上传构建产物
-   **部署步骤**: 自动部署到 GitHub Pages

### 自定义配置

如果需要修改部署配置：

1. 编辑 `.github/workflows/deploy.yml` 文件
2. 修改 `vite.config.ts` 中的 `base` 路径
3. 推送更改后会自动重新部署

### 故障排除

#### 部署失败

-   检查 Actions 标签页中的错误日志
-   确保所有依赖都正确安装
-   验证构建命令 `npm run build` 在本地能正常执行

#### 页面无法访问

-   确认 GitHub Pages 已启用
-   检查 base 路径配置是否正确
-   等待几分钟让 DNS 传播完成

### 本地测试

在部署前，可以在本地测试构建：

```bash
npm run build
npm run preview
```

访问 `http://localhost:4173` 查看构建结果。
