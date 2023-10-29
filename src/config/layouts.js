import { getConfigLayout } from "@/utils/cache/local-storage"

/* 默认配置 * */
const defaultSettings = {
  layoutMode: "left",
  showSettings: true,
  showTagsView: true,
  fixedHeader: true,
  showFooter: true,
  showLogo: true,
  showNotify: true,
  showThemeSwitch: true,
  showScreenfull: true,
  showSearchMenu: true,
  cacheTagsView: false,
  showGreyMode: false,
  showColorWeakness: false
}

/* 项目配置 * */
export const layoutSettings = { ...defaultSettings, ...getConfigLayout() }
