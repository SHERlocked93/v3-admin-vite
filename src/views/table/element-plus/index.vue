<script setup>
import { reactive, ref, watch } from "vue"
import { createTableDataApi, deleteTableDataApi, getTableDataApi, updateTableDataApi } from "api/table"
import { ElMessage, ElMessageBox } from "element-plus"
import { CirclePlus, Delete, Download, Refresh, RefreshRight, Search } from "@element-plus/icons-vue"
import { usePagination } from "hooks/usePagination"

defineOptions({
  // 命名当前组件
  name: "ElementPlus"
})

const loading = ref(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref(false)
const formRef = ref(null)
const formData = reactive({
  username: "",
  password: ""
})
const formRules = reactive({
  username: [{ required: true, trigger: "blur", message: "请输入用户名" }],
  password: [{ required: true, trigger: "blur", message: "请输入密码" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid, fields) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        createTableDataApi(formData)
          .then(() => {
            ElMessage.success("新增成功")
            getTableData()
          })
          .finally(() => {
            dialogVisible.value = false
          })
      } else {
        updateTableDataApi({
          id: currentUpdateId.value,
          username: formData.username
        })
          .then(() => {
            ElMessage.success("修改成功")
            getTableData()
          })
          .finally(() => {
            dialogVisible.value = false
          })
      }
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}
const resetForm = () => {
  currentUpdateId.value = undefined
  formData.username = ""
  formData.password = ""
}
//#endregion

//#region 删
const handleDelete = (row) => {
  ElMessageBox.confirm(`正在删除用户：${row.username}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteTableDataApi(row.id).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 改
const currentUpdateId = ref(undefined)
const handleUpdate = (row) => {
  currentUpdateId.value = row.id
  formData.username = row.username
  dialogVisible.value = true
}
//#endregion

//#region 查
const tableData = ref([])
const searchFormRef = ref(null)
const searchData = reactive({
  username: "",
  phone: ""
})
const getTableData = () => {
  loading.value = true
  getTableDataApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    username: searchData.username || undefined,
    phone: searchData.phone || undefined
  })
    .then((res) => {
      paginationData.total = res.data.total
      tableData.value = res.data.list
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1)
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}
//#endregion

/* 监听分页参数的变化 * */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" class="search-wrapper" shadow="never">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="searchData.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="searchData.phone" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button :icon="Search" type="primary" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button :icon="CirclePlus" type="primary" @click="dialogVisible = true">新增用户</el-button>
          <el-button :icon="Delete" type="danger">批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button :icon="Download" circle type="primary" />
          </el-tooltip>
          <el-tooltip content="刷新当前页">
            <el-button :icon="RefreshRight" circle type="primary" @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column align="center" type="selection" width="50" />
          <el-table-column align="center" label="用户名" prop="username" />
          <el-table-column align="center" label="角色" prop="roles">
            <template #default="scope">
              <el-tag v-if="scope.row.roles === 'admin'" effect="plain">admin</el-tag>
              <el-tag v-else effect="plain" type="warning">{{ scope.row.roles }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="手机号" prop="phone" />
          <el-table-column align="center" label="邮箱" prop="email" />
          <el-table-column align="center" label="状态" prop="status">
            <template #default="scope">
              <el-tag v-if="scope.row.status" effect="plain" type="success">启用</el-tag>
              <el-tag v-else effect="plain" type="danger">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="创建时间" prop="createTime" />
          <el-table-column align="center" fixed="right" label="操作" width="150">
            <template #default="scope">
              <el-button bg size="small" text type="primary" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button bg size="small" text type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination :currentPage="paginationData.currentPage" :layout="paginationData.layout" :page-size="paginationData.pageSize" :page-sizes="paginationData.pageSizes" :total="paginationData.total" background @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
    <!-- 新增/修改 -->
    <el-dialog v-model="dialogVisible" :title="currentUpdateId === undefined ? '新增用户' : '修改用户'" width="30%" @close="resetForm">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-position="left" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="currentUpdateId === undefined" label="密码" prop="password">
          <el-input v-model="formData.password" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;

  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
