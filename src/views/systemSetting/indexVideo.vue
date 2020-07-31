<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="box-card" style="background-color:#EFF2F4;padding:15px;height:72px;">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="标题" class="labelFontColor">
            <el-input v-model="listQuery.title" placeholder="请输入标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          </el-form-item>
          <el-form-item label="状态" class="labelFontColor">
            <el-select v-model="listQuery.importanceOptions" style="width: 140px" class="filter-item" @change="handleFilter">
              <el-option v-for="item in importanceOptions" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item label="类型" class="labelFontColor">
            <el-select v-model="listQuery.importanceOptionsType" style="width: 140px" class="filter-item" @change="handleFilter">
              <el-option v-for="item in importanceOptionsType" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
            新增
          </el-button>
        </el-form>
      </div>
    </div>

    <el-table
      :key="tableKey"
      ref="listTable"
      v-loading="listLoading"
      :data="list"
      border
      :header-cell-style="tableHeaderColor"
      :cell-style="{padding:'8px'}"
      @select="selectAll"
      @select-all="selectAll"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="视频名称" align="center" width="300">
        <template slot-scope="{row}">
          <el-popover trigger="hover" placement="top">
            <div>
              <span>点我复制视频预览地址</span>
            </div>
            <div slot="reference" class="name-wrapper">
              <el-tag v-clipboard:copy="IMGCND.IMGCND + row.video_url" v-clipboard:success="clipboardSuccess" size="medium">{{ row.video_name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="视频预览" align="center" width="200px">
        <template slot-scope="{row}">
          <el-image :src="IMGCND.IMGCND + row.video_url + '?vframe/jpg/offset/1'" fit="fill">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否展示首页" class-name="status-col" prop="is_delete" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.is_top_str | goTypeFilter">
            {{ row.is_top_str }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="虚拟点赞数量" class-name="status-col" prop="is_delete" width="100">
        <template slot-scope="{row}">
          <span>{{ row.set_like_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际点赞数量" class-name="status-col" prop="is_delete" width="100">
        <template slot-scope="{row}">
          <span>{{ row.real_like_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="success" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="视频标题">
          <el-input v-model="temp.video_name" placeholder="请填写视频标题" />
        </el-form-item>
        <el-form-item label="视频地址">
          <el-upload
            class="center-uploader"
            :data="dataObj"
            :multiple="false"
            :on-exceed="tooManyFilesError"
            :show-file-list="true"
            :on-error="errorFun"
            :on-success="successFun"
            :before-upload="beforeUpload"
            action="https://up-z2.qiniup.com"
            drag
          >
            <img v-if="imageUrl" :src="IMGCND.IMGCND + imageUrl + '?vframe/jpg/offset/1'" style="max-width:360px;">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="状态" prop="is_show">
          <el-popover
            placement="top-start"
            width="450"
            trigger="hover"
            content="选择【显示】,则会显示在首页视频位置,选择【隐藏】,则不会显示 。"
          >
            <el-radio-group slot="reference" v-model="temp.is_top">
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="2">隐藏</el-radio>
            </el-radio-group>
          </el-popover>
        </el-form-item>
        <el-form-item label="虚拟点赞数量">
          <el-input v-model="temp.set_like_num" placeholder="请填写点赞数量" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createMn, updateMn, deleteMn, deleteMnAll } from '@/api/indexVideo'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { getToken } from '@/api/qiniu'
import md5 from 'js-md5'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { createResource } from '@/api/resource'
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves, clipboard },
  filters: {
    goTypeFilter(status) {
      const statusMap = {
        '显示': 'success',
        '隐藏': 'danger'
      }
      return statusMap[status]
    },
    statusFilter(status) {
      const statusMap = {
        '显示': 'success',
        '隐藏': 'danger'
      }
      return statusMap[status]
    },
    typeFilter(status) {
      const statusMap = {
        '首页轮播图': 'success',
        '奶站轮播图': 'danger'
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
      importanceOptions: [{ label: '所有', key: '0' }, { label: '显示', key: '1' }, { label: '隐藏', key: '2' }],
      importanceOptionsType: [{ label: '所有', key: '0' }, { label: '首页轮播图', key: '1' }, { label: '奶站轮播图', key: '2' }],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      powerList: [],
      showReviewer: false,
      temp: {
        video_name: '',
        image_url: '',
        video_url: '',
        set_like_num: 0,
        is_top: 2
      },
      dialogFormVisible: false,
      data: {
        fileName: '',
        fileSize: '',
        downUrl: '',
        Suffix: ''
      },
      Suffix: ['mp4', 'jpg'],
      dialogStatus: '',
      textMap: {
        update: '编辑轮播图',
        create: '新增轮播图'
      },
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      multipleSelection: []
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
        video_name: '',
        image_url: '',
        video_url: '',
        set_like_num: 1,
        is_top: 2
      }
    },
    handleCreate() {
      this.imageUrl = ''
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createMn(this.temp).then((response) => {
            // this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.imageUrl = this.temp.video_url
      this.temp.image_url = this.temp.video_url
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.is_top === 1) {
            this.temp.is_top_str = '显示'
          } else {
            this.temp.is_top_str = '隐藏'
          }
          const tempData = Object.assign({}, this.temp)
          updateMn(tempData).then(() => {
            const index = this.list.findIndex(v => v.video_id === this.temp.video_id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleDelete(row, index) {
      this.temp.banner_id = row.banner_id
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.temp.banner_id = row.banner_id
        deleteMn(this.temp).then(() => {
          this.$notify({
            title: '删除图片',
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
      this.temp.IdArray = this.multipleSelection
      if (this.temp.IdArray.length <= 0) {
        return
      }
      this.$confirm('此操作将永久删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        this.temp.ranchIdArray = this.multipleSelection
        deleteMnAll(this.temp).then(() => {
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
        this.multipleSelection.push(item.banner_id)
      })
    },
    errorHandler() {
      return true
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
          const key = md5(file.name + response.key) + '.' + this.data.Suffix
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
      this.temp.image_url = response.key
      this.imageUrl = response.key
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
    showGoTo(value) {
      // if (value === 1) {
      // } else {
      // }
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功',
        type: 'success',
        duration: 1500
      })
    }
  }
}
</script>
<style>
  .labelFontColor .el-form-item__label{
    color: #343434;
  }
  .center-uploader{
    /* width: 360px;
    height: 180px; */
    text-align: center;
    font-size: 26px;
    color: #8c939d;
  }
</style>

