<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="box-card">
        <el-form :model="form" label-width="120px">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name" style="width:300px;" />
          </el-form-item>
          <el-form-item label="商品预览图">
            <el-upload
              class="avatar-uploader"
              action="https://up-z2.qiniup.com"
              :data="dataObj"
              :multiple="true"
              :show-file-list="true"
              :on-error="errorFun"
              :on-success="successFun"
              :before-upload="beforeUpload"
            >
              <img v-if="goods_img" :src="goods_img" class="avatar" style="width:200px; height:120px;text-align:center;">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
          <el-form-item label="单价">
            <el-input v-model="form.name" style="width:300px;" />
          </el-form-item>
          <!-- <el-form-item label="活动区域">
            <el-select v-model="form.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="活动时间">
            <el-col :span="11">
              <el-date-picker v-model="form.date1" type="date" placeholder="选择日期" style="width: 100%;" />
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-time-picker v-model="form.date2" placeholder="选择时间" style="width: 100%;" />
            </el-col>
          </el-form-item>
          <el-form-item label="即时配送">
            <el-switch v-model="form.delivery" />
          </el-form-item>
          <el-form-item label="活动性质">
            <el-checkbox-group v-model="form.type">
              <el-checkbox label="美食/餐厅线上活动" name="type" />
              <el-checkbox label="地推活动" name="type" />
              <el-checkbox label="线下主题活动" name="type" />
              <el-checkbox label="单纯品牌曝光" name="type" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="特殊资源">
            <el-radio-group v-model="form.resource">
              <el-radio label="线上品牌商赞助" />
              <el-radio label="线下场地免费" />
            </el-radio-group>
          </el-form-item> -->
          <el-form-item label="商品详情">
            <article-detail :is-edit="false" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchList, createMn, updateMn, deleteMn, deleteMnAll } from '@/api/member'
import { parseTime } from '@/utils'
import { getToken } from '@/api/qiniu'
import ArticleDetail from './components/ArticleDetail'
import md5 from 'js-md5'
export default {
  name: 'ComplexTable',
  components: { ArticleDetail },
  data() {
    return {
      goods_img: '',
      dataObj: { token: '', key: '' },
      form: {
        goods_name: '',
        is_offline: 0,
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      data: {
        fileName: '',
        fileSize: '',
        downUrl: '',
        Suffix: ''
      },
      Suffix: ['mp4', 'jpg', 'png', 'gif'],
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
      importanceOptions: [{ label: '所有', key: '0' }, { label: '正常', key: '2' }, { label: '锁定', key: '1' }],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      powerList: [],
      showReviewer: false,
      temp: {
        nick_name: '',
        is_delete: 0,
        IdArray: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户',
        create: '创建用户'
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
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
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
    errorFun(err, file, fileList) {
      console.log(err.message)
      this.$notify({
        title: '上传错误',
        message: '资源上传',
        type: 'error',
        duration: 2000
      })
    },
    successFun(response, file, fileList) {
      this.goods_img = 'http://qdcm3dgyu.bkt.clouddn.com/' + response.key
    },
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #EFF2F4;color: #343434;padding: 8px;'
      }
    },
    onSubmit() {
      console.log('submit!')
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
        admin_account: '',
        admin_pwd: '',
        power_team: 0,
        is_lock: false
      }
    },
    handleCreate() {
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
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.is_delete === 0) {
            this.temp.is_delete_str = '正常'
          } else {
            this.temp.is_delete_str = '锁定'
          }
          const tempData = Object.assign({}, this.temp)
          updateMn(tempData).then(() => {
            const index = this.list.findIndex(v => v.member_id === this.temp.member_id)
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
      this.temp.admin_id = row.admin_id
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.temp.resource_id = row.resource_id
        deleteMn(this.temp).then(() => {
          this.$notify({
            title: '删除用户',
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
      this.listLoading = true
      this.temp.IdArray = this.multipleSelection
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
    },
    selectAll(selection, row) {
      this.multipleSelection = []
      selection.map((item) => {
        console.log(item)
        this.multipleSelection.push(item.member_id)
      })
    }
  }
}
</script>
<style>
  .labelFontColor .el-form-item__label{
    color: #343434;
  }
   .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 200px;
    height: 120px;
    flex-direction: column;
    justify-content: center;
    display: flex;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 200px;
    height: 120px;
    display: block;
  }
</style>

