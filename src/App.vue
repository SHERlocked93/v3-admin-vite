<script setup>
import { useTheme } from "@/hooks/useTheme"
import zhCn from "element-plus/es/locale/lang/zh-cn"

const { initTheme } = useTheme()

/* 初始化主题 * */
initTheme()
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>
