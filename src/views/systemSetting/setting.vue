<template>
  <div class="app-container">
    <div class="filter-container">
      <el-alert title="此页面内容禁止随意修改,若修改错误,将导致小程序无法正常运行!!!" type="error" effect="dark" />
      <el-divider />
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item v-for="(item,i) in dataList" :key="i" :label="item.conf_title" class="labelFontColor">
          <el-tooltip class="item" effect="dark" content="请勿随意修改,修改后可能导致小程序无法使用" placement="top-start">
            <el-input v-model="item.conf_value" placeholder="请输入标题" style="width: 400px;" class="filter-item" @keyup.enter.native="handleFilter" />
          </el-tooltip>
        </el-form-item>
        <div style="margin-top: 30px">
          <el-button class="filter-item" style="text-align:center" type="primary" icon="el-icon-edit" @click="handleUpdate">
            保存
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { fetchList, updateMn } from '@/api/setting'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'

export default {
  name: 'ComplexTable',
  directives: { waves },
  filters: {
    goTypeFilter(status) {
      const statusMap = {
        '商品ID': 'success',
        '跳转地址': 'danger'
      }
      return statusMap[status]
    },
    statusFilter(status) {
      const statusMap = {
        '显示': 'success',
        '隐藏': 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      dataList: [],
      dialogFormVisible: false,
      data: {
        postData: []
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #EFF2F4;color: #343434;padding: 8px;'
      }
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data
        this.dataList = response.data
        this.total = response.data.total
        console.log(response.data)
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'admin_account') {
        this.sortByID(order)
      }
      if (prop === 'register_time') {
        this.sortByRegisterTime(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+admin_account'
      } else {
        this.listQuery.sort = '-admin_account'
      }
      this.handleFilter()
    },
    sortByRegisterTime(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+register_time'
      } else {
        this.listQuery.sort = '-register_time'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        title: '',
        is_show: 0,
        image_url: '',
        go_type: 1,
        go_url: ''
      }
    },
    handleUpdate() {
      this.$confirm('请确认你真的需要修改,且修改正确!', '你正在修改危险配置', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.data.postData = this.dataList
        updateMn(this.data).then(() => {
          this.$notify({
            title: 'Success',
            message: 'Update Successfully',
            type: 'success',
            duration: 2000
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    errorHandler() {
      return true
    }
  }
}
</script>
<style>
  .labelFontColor .el-form-item__label{
    color: #343434;
  }
  .center-uploader{
    width: 360px;
    height: 180px;
    text-align: center;
    line-height: 180px;
    font-size: 26px;
    color: #8c939d;
  }
</style>

