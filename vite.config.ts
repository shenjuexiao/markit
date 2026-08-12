import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    base: process.env.NODE_ENV === "production" ? "/markit/" : "/",
    build: {
        outDir: "dist",
        assetsDir: "assets",
        sourcemap: false,
        minify: "terser",
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["vue"],
                    markdown: ["marked", "github-markdown-css"],
                    math: ["katex"],
                    mermaid: ["mermaid"],
                },
            },
        },
    },
});
