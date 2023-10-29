import {ref, watch} from "vue"

/* 项目标题 * */
const VITE_APP_TITLE = import.meta.env.VITE_APP_TITLE ?? "MY APP"

/* 动态标题 * */
const dynamicTitle = ref("")

/* 设置标题 * */
const setTitle = (title) => {
  dynamicTitle.value = title ? `${VITE_APP_TITLE} | ${title}` : VITE_APP_TITLE
}

/* 监听标题变化 * */
watch(dynamicTitle, (value, oldValue) => {
  if (document && value !== oldValue) {
    document.title = value
  }
})

export function useTitle() {
  return { setTitle }
}
