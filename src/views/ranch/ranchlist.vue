<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="box-card" style="background-color:#EFF2F4;padding:15px;height:72px;">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="牧场名称" class="labelFontColor">
            <el-input v-model="listQuery.title" placeholder="请输入牧场名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          </el-form-item>
          <el-form-item label="状态" class="labelFontColor">
            <el-select v-model="listQuery.importanceOptions" style="width: 140px" class="filter-item" @change="handleFilter">
              <el-option v-for="item in importanceOptions" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <router-link :to="'/ranch/addRanch'">
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">
              新增
            </el-button>
          </router-link>
        </el-form>
      </div>
    </div>
    <el-table
      :key="tableKey"
      ref="listTable"
      v-loading="listLoading"
      :data="list"
      border
      stripe
      fit
      :header-cell-style="tableHeaderColor"
      :cell-style="{padding:'8px'}"
      @select="selectAll"
      @select-all="selectAll"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="牧场名称" prop="admin_account" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.ranch_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="牧场形象" align="center">
        <template slot-scope="{row}">
          <el-avatar :size="60" @error="errorHandler">
            <img :src="IMGCND.IMGCND + row.ranch_img">
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" align="center" prop="register_time" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关闭时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.close_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="牧场介绍" align="center">
        <template slot-scope="{row}">
          <span>{{ row.ranch_introduction }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="状态" class-name="status-col" prop="is_lock">
        <template slot-scope="{row}">
          <el-tag :type="row.is_open_str | statusFilter" style="">
            {{ row.is_open_str }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <router-link :to="'/ranch/editRanch/' + row.ranch_id">
            <el-button type="success" size="mini">
              编辑
            </el-button>
          </router-link>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="deleteAll()">删除</el-button>
      <el-button @click="toggleSelection()">取消</el-button>
    </div>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList, createRanch, updateRanch, deleteRanch, deleteRanchAll } from '@/api/ranch'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { getToken } from '@/api/qiniu'
import md5 from 'js-md5'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { createResource } from '@/api/resource'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '营业中': 'success',
        '已关闭': 'danger',
        '休息中': 'warning'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      dataObj: { token: '', key: '' },
      imageUrl: '',
      tableKey: 0,
      list: null,
      total: 0,
      value1: true,
      value2: true,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+admin_account'
      },
      importanceOptions: [{ label: '所有', key: '0' }, { label: '营业中', key: '1' }, { label: '已关闭', key: '2' }, { label: '休息中', key: '3' }],
      temp: {
        ranch_name: '',
        is_open: false,
        ranch_introduction: '',
        ranch_img: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: '新增牧场'
      },
      rules: {
        ranch_name: [{ required: true, message: '请填写牧场名称', trigger: 'change' }],
        is_open: [{ required: true, message: '请选择牧场状态', trigger: 'change' }]
      },
      downloadLoading: false,
      multipleSelection: [],
      data: {
        fileName: '',
        fileSize: '',
        downUrl: '',
        Suffix: ''
      },
      Suffix: ['jpg', 'png', 'gif']
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
        ranch_name: '',
        is_open: false,
        ranchIdArray: [],
        ranch_introduction: '',
        ranch_img: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.imageUrl = ''
      this.dialogStatus = 'create'
      this.postForm.status = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.ranch_introduction = this.postForm.ranch_introduction
          createRanch(this.temp).then((response) => {
            // this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '新增牧场',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.postForm.status = 'update'
      this.dialogFormVisible = true
      this.postForm.ranch_introduction = row.ranch_introduction
      this.imageUrl = row.ranch_img
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.is_open === 1) {
            this.temp.is_open_str = '营业中'
          } else if (this.temp.is_open === 2) {
            this.temp.is_open_str = '已关闭'
          } else {
            this.temp.is_open_str = '休息中'
          }
          const tempData = Object.assign({}, this.temp)
          console.log(this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateRanch(tempData).then(() => {
            const index = this.list.findIndex(v => v.ranch_id === this.temp.ranch_id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm('此操作将永久删除该牧场, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.temp.ranch_id = row.ranch_id
        deleteRanch(this.temp).then(() => {
          this.$notify({
            title: '删除牧场',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        })
        this.list.splice(index, 1)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
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
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    toggleSelection(rows) {
      console.log(this.multipleSelection)
      this.multipleSelection = []
      this.$refs.listTable.clearSelection()
    },
    deleteAll() {
      this.temp.ranchIdArray = this.multipleSelection
      if (this.temp.ranchIdArray.length <= 0) {
        return
      }
      console.log(this.temp.ranchIdArray)
      this.$confirm('此操作将永久删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        this.temp.ranchIdArray = this.multipleSelection
        deleteRanchAll(this.temp).then(() => {
          this.$notify({
            title: '删除资源',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
          this.multipleSelection = []
          this.getList()
          this.listLoading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    selectAll(selection, row) {
      this.multipleSelection = []
      selection.map((item) => {
        console.log(item)
        this.multipleSelection.push(item.ranch_id)
      })
    },
    showDetail(row) {
      console.log(this.$router)
      this.$router.push({ name: 'staff', query: { ranchId: row.ranch_id, ranchName: row.ranch_name }})
    },
    beforeUpload(file) {
      const _self = this
      return new Promise((resolve, reject) => {
        getToken().then(response => {
          this.data.fileName = file.name
          this.data.fileSize = file.size
          var strArr = file.name.split('.')
          var arrLen = strArr.length
          this.data.Suffix = strArr[arrLen - 1]
          var isCanUp = false
          for (var i = 0; i < this.Suffix.length; i++) {
            if (this.Suffix[i] === this.data.Suffix) {
              isCanUp = true
            }
          }
          if (isCanUp === false) {
            reject(false)
            this.$notify({
              title: '不允许上传此格式',
              message: '资源上传',
              type: 'error',
              duration: 2000
            })
          }
          var fileNames = file.name.split('.' + this.data.Suffix)
          this.data.fileName = fileNames[0]
          const key = md5(file.name + new Date()) + '.' + this.data.Suffix
          this.data.downUrl = key
          const token = response.data.token
          _self._data.dataObj.token = token
          _self._data.dataObj.key = key
          resolve(true)
        }).catch(err => {
          console.log(err)
          reject(false)
        })
      })
    },
    successFun(response, file, fileList) {
      this.data.fileName = file.name
      this.data.fileSize = file.size
      var strArr = file.name.split('.')
      var arrLen = strArr.length
      this.data.Suffix = strArr[arrLen - 1]
      var fileNames = file.name.split('.' + this.data.Suffix)
      this.data.fileName = fileNames[0]
      this.data.downUrl = response.key
      this.temp.ranch_img = response.key
      this.imageUrl = this.IMGCND.IMGCND + '' + response.key
      createResource(this.data).then((response) => {
        this.$notify({
          title: '上传成功!',
          message: '资源上传',
          type: 'success',
          duration: 2000
        })
      })
    },
    errorFun(err, file, fileList) {
      console.log(err.message)
      this.$notify({
        title: '上传错误',
        message: '资源上传',
        type: 'error',
        duration: 2000
      })
    },
    tooManyFilesError(files, fileList) {
      this.$notify({
        title: '请一个一个上传',
        message: '资源上传',
        type: 'error',
        duration: 2000
      })
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

