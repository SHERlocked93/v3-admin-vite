/// <reference types="vitest" />
import {loadEnv} from "vite"
import path, {resolve} from "path"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import {createSvgIconsPlugin} from "vite-plugin-svg-icons"
import svgLoader from "vite-svg-loader"
import UnoCSS from "unocss/vite"

/* 配置项文档：https://cn.vitejs.dev/config * */
export default (configEnv) => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd())
  const { VITE_PUBLIC_PATH } = viteEnv
  return {
    /* 打包时根据实际情况修改 base * */
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
        "~": resolve(__dirname, "./src"),
        components: resolve(__dirname, "./src/components"),
        api: resolve(__dirname, "./src/api"),
        icons: resolve(__dirname, "./src/icons"),
        plugins: resolve(__dirname, "./src/plugins"),
        directives: resolve(__dirname, "./src/directives"),
        config: resolve(__dirname, "./src/config"),
        hooks: resolve(__dirname, "./src/hooks"),
        router: resolve(__dirname, "./src/router"),
        store: resolve(__dirname, "./src/store"),
        views: resolve(__dirname, "./src/views"),
        styles: resolve(__dirname, "./src/styles"),
        utils: resolve(__dirname, "./src/utils")
      }
    },
    server: {
      https: false,
      /* 设置 host: true 才可以使用 Network 的形式，以 IP 访问项目 * */
      host: true, // host: "0.0.0.0"
      port: 3333,
      open: false,
      cors: true,
      /* 端口被占用时，是否直接退出 * */
      strictPort: false,
      /* 接口代理 * */
      proxy: {
        "/api/v1": {
          target: "https://www.fastmock.site/mock/761e2dda2b8890ab86c928a74e8f6538",
          ws: true,
          /* 是否允许跨域 * */
          changeOrigin: true
        }
      }
    },
    build: {
      /* 单个 chunk 文件的大小超过 2048KB 时发出警告 * */
      chunkSizeWarningLimit: 2048,
      /* 禁用 gzip 压缩大小报告 * */
      reportCompressedSize: false,
      /* 打包后静态资源目录 * */
      assetsDir: "static",
      rollupOptions: {
        output: {
          /**
           * 分块策略
           * 1. 注意这些包名必须存在，否则打包会报错
           * 2. 如果你不想自定义 chunk 分割策略，可以直接移除这段配置
           */
          manualChunks: {
            vue: ["vue", "vue-router", "pinia"],
            element: ["element-plus", "@element-plus/icons-vue"],
            vxe: ["vxe-table", "vxe-table-plugin-element", "xe-utils"]
          }
        }
      }
    },
    /* 混淆器 * */
    esbuild: {
      /* 打包时移除 console.log * */
      pure: ["console.log"],
      /* 打包时移除 debugger * */
      drop: ["debugger"],
      /* 打包时移除所有注释 * */
      legalComments: "none"
    },
    /* Vite 插件 * */
    plugins: [
      vue(),
      vueJsx(),
      /* 将 SVG 静态图转化为 Vue 组件 * */
      svgLoader({ defaultImport: "url" }),
      /* SVG * */
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/icons/svg")],
        symbolId: "icon-[dir]-[name]"
      }),
      UnoCSS()
    ]
  }
}
