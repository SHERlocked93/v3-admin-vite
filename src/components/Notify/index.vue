<script setup>
import { ref, computed } from "vue"
import { ElMessage } from "element-plus"
import { Bell } from "@element-plus/icons-vue"
import NotifyList from "./NotifyList.vue"
import { notifyData, messageData, todoData } from "./data"

/* 角标当前值 * */
const badgeValue = computed(() => {
  return data.value.reduce((sum, item) => sum + item.list.length, 0)
})
/* 角标最大值 * */
const badgeMax = 99
/* 面板宽度 * */
const popoverWidth = 350
/* 当前 Tab * */
const activeName = ref("通知")
const data = ref([
  {
    name: "通知",
    type: "primary",
    list: notifyData
  },
  {
    name: "消息",
    type: "danger",
    list: messageData
  },
  {
    name: "待办",
    type: "warning",
    list: todoData
  }
])

const handleHistory = () => {
  ElMessage.success(`跳转到${activeName.value}历史页面`)
}
</script>

<template>
  <div class="notify">
    <el-popover placement="bottom" :width="popoverWidth" trigger="click">
      <template #reference>
        <el-badge :value="badgeValue" :max="badgeMax" :hidden="badgeValue === 0">
          <el-tooltip effect="dark" content="消息通知" placement="bottom">
            <el-icon :size="20">
              <Bell />
            </el-icon>
          </el-tooltip>
        </el-badge>
      </template>
      <template #default>
        <el-tabs v-model="activeName" class="demo-tabs" stretch>
          <el-tab-pane v-for="(item, index) in data" :name="item.name" :key="index">
            <template #label>
              {{ item.name }}
              <el-badge :value="item.list.length" :max="badgeMax" :type="item.type" />
            </template>
            <el-scrollbar height="400px">
              <NotifyList :list="item.list" />
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
        <div class="notify-history">
          <el-button link @click="handleHistory">查看{{ activeName }}历史</el-button>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<style lang="scss" scoped>
.notify {
  margin-right: 10px;
  color: var(--el-text-color-regular);
}
.notify-history {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color);
}
</style>
