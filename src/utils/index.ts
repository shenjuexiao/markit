// 导出所有工具函数
export * from "./shortcuts";
export * from "./github";

/**
 * 生成基于时间戳的文件名
 * 格式：YYYY-MM-DD_HH-MM-SS
 */
export function generateTimestampFileName(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}
