// core
import { createApp } from "vue"
import App from "@/App.vue"
import store from "store"
import router from "router"
import "router/permission"

// load
import { loadSvg } from "icons"
import { loadPlugins } from "plugins"
import { loadDirectives } from "directives"

// css
import "virtual:uno.css"
import "@unocss/reset/normalize.css"
import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"
import "vxe-table/lib/style.css"
import "vxe-table-plugin-element/dist/style.css"
import "styles/index.scss"

const app = createApp(App)

loadPlugins(app)
loadSvg(app)
loadDirectives(app)

app.use(store).use(router)
router.isReady().then(() => {
  app.mount("#app")
})
