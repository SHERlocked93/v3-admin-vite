<script setup>
import { ref } from "vue"

defineOptions({
  name: "Menu1-3"
})

const text = ref("")
</script>

<template>
  <div class="app-container">
    <el-card header="三级路由缓存 - menu1-3">
      <el-input v-model="text" />
    </el-card>
  </div>
</template>
