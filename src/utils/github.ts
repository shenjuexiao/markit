import axios from "axios";
import { showLoading, hideLoading } from "./loading";

// GitHub API 配置
export interface GitHubConfig {
    token: string;
    owner: string;
    repo: string;
    branch?: string;
}

// 文件内容接口
export interface GitHubFile {
    path: string;
    content: string;
    message: string;
    sha?: string;
}

// GitHub API 响应接口
export interface GitHubResponse {
    success: boolean;
    message: string;
    data?: any;
    error?: string;
}

// GitHub API 工具类
export class GitHubAPI {
    private config: GitHubConfig;
    private baseURL = "https://api.github.com";
    private headers: Record<string, string>;

    constructor(config: GitHubConfig) {
        this.config = {
            branch: "main",
            ...config,
        };

        this.headers = {
            Authorization: `token ${config.token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
        };
    }

    /**
     * 获取仓库信息
     */
    async getRepoInfo(): Promise<GitHubResponse> {
        try {
            showLoading("正在获取仓库信息...");
            const response = await axios.get(
                `${this.baseURL}/repos/${this.config.owner}/${this.config.repo}`,
                { headers: this.headers },
            );

            return {
                success: true,
                message: "获取仓库信息成功",
                data: response.data,
            };
        } catch (error: any) {
            return {
                success: false,
                message: "获取仓库信息失败",
                error: error.response?.data?.message || error.message,
            };
        } finally {
            hideLoading();
        }
    }

    /**
     * 获取文件内容
     */
    async getFile(path: string): Promise<GitHubResponse> {
        try {
            showLoading(`正在获取文件: ${path}...`);
            const response = await axios.get(
                `${this.baseURL}/repos/${this.config.owner}/${this.config.repo}/contents/${path}`,
                {
                    headers: this.headers,
                    params: { ref: this.config.branch },
                },
            );

            return {
                success: true,
                message: "获取文件内容成功",
                data: response.data,
            };
        } catch (error: any) {
            return {
                success: false,
                message: "获取文件内容失败",
                error: error.response?.data?.message || error.message,
            };
        } finally {
            hideLoading();
        }
    }

    /**
     * 创建或更新文件 (Push)
     */
    async pushFile(file: GitHubFile): Promise<GitHubResponse> {
        try {
            showLoading(`正在推送文件: ${file.path}...`);
            // 先尝试获取文件，如果存在则获取SHA
            const existingFile = await this.getFile(file.path);
            let sha: string | undefined;

            if (existingFile.success) {
                sha = existingFile.data.sha;
            }

            const payload: any = {
                message: file.message,
                content: this.encodeContentToBase64(file.content),
                branch: this.config.branch,
            };

            if (sha) {
                payload.sha = sha;
            }

            const response = await axios.put(
                `${this.baseURL}/repos/${this.config.owner}/${this.config.repo}/contents/${file.path}`,
                payload,
                { headers: this.headers },
            );

            return {
                success: true,
                message: "文件推送成功",
                data: response.data,
            };
        } catch (error: any) {
            return {
                success: false,
                message: "文件推送失败",
                error: error.response?.data?.message || error.message,
            };
        } finally {
            hideLoading();
        }
    }

    /**
     * 批量推送文件
     */
    async pushFiles(files: GitHubFile[]): Promise<GitHubResponse> {
        try {
            showLoading(`正在批量推送 ${files.length} 个文件...`);
            const results = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                showLoading(
                    `正在推送文件 ${i + 1}/${files.length}: ${file.path}...`,
                );

                const result = await this.pushFile(file);
                results.push({
                    path: file.path,
                    ...result,
                });

                // 如果某个文件推送失败，返回错误
                if (!result.success) {
                    return result;
                }
            }

            return {
                success: true,
                message: `成功推送 ${files.length} 个文件`,
                data: results,
            };
        } catch (error: any) {
            return {
                success: false,
                message: "批量推送文件失败",
                error: error.message,
            };
        } finally {
            hideLoading();
        }
    }

    /**
     * 获取仓库所有文件 (Pull)
     */
    async pullFiles(): Promise<GitHubResponse> {
        try {
            showLoading("正在从GitHub拉取文件列表...");
            const response = await axios.get(
                `${this.baseURL}/repos/${this.config.owner}/${this.config.repo}/git/trees/${this.config.branch}?recursive=1`,
                { headers: this.headers },
            );

            const files = response.data.tree.filter(
                (item: any) => item.type === "blob",
            );

            // 获取每个文件的内容
            const fileContents = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                showLoading(
                    `正在获取文件内容 ${i + 1}/${files.length}: ${
                        file.path
                    }...`,
                );

                const content = await this.getFile(file.path);
                if (content.success) {
                    // 使用更安全的Base64解码方法，避免中文乱码
                    const decodedContent = this.decodeBase64Content(
                        content.data.content,
                    );
                    fileContents.push({
                        path: file.path,
                        content: decodedContent,
                        sha: content.data.sha,
                    });
                }
            }

            return {
                success: true,
                message: "拉取文件成功",
                data: fileContents,
            };
        } catch (error: any) {
            return {
                success: false,
                message: "拉取文件失败",
                error: error.response?.data?.message || error.message,
            };
        } finally {
            hideLoading();
        }
    }

    /**
     * 安全编码内容到Base64，确保中文正确编码
     */
    private encodeContentToBase64(content: string): string {
        try {
            // 使用 TextEncoder 来正确处理UTF-8编码
            const encoder = new TextEncoder();
            const bytes = encoder.encode(content);
            const binaryString = String.fromCharCode(...bytes);
            return btoa(binaryString);
        } catch (error) {
            console.warn("内容编码失败，使用备用方法:", error);
            // 备用方法：使用原来的编码方式
            return btoa(unescape(encodeURIComponent(content)));
        }
    }

    /**
     * 安全解码Base64内容，避免中文乱码
     */
    private decodeBase64Content(base64Content: string): string {
        try {
            // 使用 TextDecoder 来正确处理UTF-8编码
            const binaryString = atob(base64Content);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return new TextDecoder("utf-8").decode(bytes);
        } catch (error) {
            console.warn("Base64解码失败，使用备用方法:", error);
            // 备用方法：直接使用atob，但可能在某些情况下仍有问题
            return atob(base64Content);
        }
    }

    /**
     * 验证配置
     */
    async validateConfig(): Promise<GitHubResponse> {
        try {
            showLoading("正在验证GitHub配置...");
            const response = await axios.get(`${this.baseURL}/user`, {
                headers: this.headers,
            });

            return {
                success: true,
                message: "GitHub配置验证成功",
                data: response.data,
            };
        } catch (error: any) {
            return {
                success: false,
                message: "GitHub配置验证失败",
                error: error.response?.data?.message || error.message,
            };
        } finally {
            hideLoading();
        }
    }

    /**
     * 获取仓库分支列表
     */
    async getBranches(): Promise<GitHubResponse> {
        try {
            showLoading("正在获取分支列表...");
            const response = await axios.get(
                `${this.baseURL}/repos/${this.config.owner}/${this.config.repo}/branches`,
                { headers: this.headers },
            );

            return {
                success: true,
                message: "获取分支列表成功",
                data: response.data,
            };
        } catch (error: any) {
            return {
                success: false,
                message: "获取分支列表失败",
                error: error.response?.data?.message || error.message,
            };
        } finally {
            hideLoading();
        }
    }

    /**
     * 获取仓库提交历史
     */
    async getCommits(): Promise<GitHubResponse> {
        try {
            showLoading("正在获取提交历史...");
            const response = await axios.get(
                `${this.baseURL}/repos/${this.config.owner}/${this.config.repo}/commits`,
                {
                    headers: this.headers,
                    params: {
                        sha: this.config.branch,
                        per_page: 10,
                    },
                },
            );

            return {
                success: true,
                message: "获取提交历史成功",
                data: response.data,
            };
        } catch (error: any) {
            return {
                success: false,
                message: "获取提交历史失败",
                error: error.response?.data?.message || error.message,
            };
        } finally {
            hideLoading();
        }
    }

    /**
     * 获取仓库状态
     */
    async getRepoStatus(): Promise<GitHubResponse> {
        try {
            showLoading("正在获取仓库状态...");
            const [repoInfo, branches, commits] = await Promise.all([
                this.getRepoInfo(),
                this.getBranches(),
                this.getCommits(),
            ]);

            return {
                success: true,
                message: "获取仓库状态成功",
                data: {
                    repoInfo: repoInfo.data,
                    branches: branches.data,
                    commits: commits.data,
                },
            };
        } catch (error: any) {
            return {
                success: false,
                message: "获取仓库状态失败",
                error: error.message,
            };
        } finally {
            hideLoading();
        }
    }
}

/**
 * 创建GitHub API实例
 */
export function createGitHubAPI(config: GitHubConfig): GitHubAPI {
    return new GitHubAPI(config);
}

/**
 * 格式化文件路径
 */
export function formatFilePath(
    title: string,
    extension: string = ".md",
): string {
    return `${title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "_")}${extension}`;
}

/**
 * 生成提交信息
 */
export function generateCommitMessage(
    action: "push" | "pull",
    files: string[],
): string {
    const timestamp = new Date().toLocaleString("zh-CN");
    const fileCount = files.length;

    if (action === "push") {
        return `feat: 更新 ${fileCount} 个文件 - ${timestamp}`;
    } else {
        return `feat: 同步 ${fileCount} 个文件 - ${timestamp}`;
    }
}
