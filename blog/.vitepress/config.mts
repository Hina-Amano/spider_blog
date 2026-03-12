// .vitepress/config.mts
import { defineConfig } from "vitepress";
import { defineTeekConfig } from "vitepress-theme-teek/config";

// Teek 主题配置
const teekConfig = defineTeekConfig({});

// VitePress 配置
export default defineConfig({
    extends: teekConfig,
    srcDir: "../blog_context",
    // ...
});