// URL参数管理工具
export interface URLParams {
    viewMode?: "edit" | "preview";
    previewStyle?: string;
}

// 从URL获取参数
export const getURLParams = (): URLParams => {
    const params = new URLSearchParams(window.location.search);
    const urlParams: URLParams = {};

    // 视图模式
    if (params.has("viewmode")) {
        const mode = params.get("viewmode");
        if (mode === "edit" || mode === "preview") {
            urlParams.viewMode = mode;
        }
    }

    // 预览样式
    if (params.has("previewstyle")) {
        urlParams.previewStyle = params.get("previewstyle") || "";
    }

    return urlParams;
};

// 更新URL参数
export const updateURLParams = (params: Partial<URLParams>) => {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;

    // 更新视图模式
    if (params.viewMode !== undefined) {
        if (params.viewMode) {
            searchParams.set("viewmode", params.viewMode);
        } else {
            searchParams.delete("viewmode");
        }
    }

    // 更新预览样式
    if (params.previewStyle !== undefined) {
        if (params.previewStyle) {
            searchParams.set("previewstyle", params.previewStyle);
        } else {
            searchParams.delete("previewstyle");
        }
    }

    // 更新URL（不刷新页面）
    window.history.replaceState({}, "", url.toString());
};

// 监听URL变化
export const watchURLChanges = (callback: (params: URLParams) => void) => {
    // 监听popstate事件（浏览器前进后退）
    window.addEventListener("popstate", () => {
        callback(getURLParams());
    });

    // 监听hashchange事件
    window.addEventListener("hashchange", () => {
        callback(getURLParams());
    });
};

// 检查URL参数是否发生变化
export const hasURLParamsChanged = (
    currentParams: URLParams,
    newParams: URLParams,
): boolean => {
    return (
        currentParams.viewMode !== newParams.viewMode ||
        currentParams.previewStyle !== newParams.previewStyle
    );
};
