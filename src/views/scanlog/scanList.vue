<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="box-card" style="background-color:#EFF2F4;padding:15px;height:72px;">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="管理员账号" class="labelFontColor">
            <el-input v-model="listQuery.title" placeholder="请输入账号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          </el-form-item>
          <el-form-item label="状态" class="labelFontColor">
            <el-select v-model="listQuery.importanceOptions" style="width: 140px" class="filter-item" @change="handleFilter">
              <el-option v-for="item in importanceOptions" :key="item.key" :label="item.label" :value="item.key" />
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
      fit
      :header-cell-style="tableHeaderColor"
      :cell-style="{padding:'8px'}"
      @select="selectAll"
      @select-all="selectAll"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="录入员工" prop="admin_account" align="center" min-width="70">
        <template slot-scope="{row}">
          <span>{{ row.inputer_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="录入时间" align="center" prop="register_time" min-width="90">
        <template slot-scope="{row}">
          <span>{{ row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" align="center" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.goods_name + "  -  " + row.spcial_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所在牧场" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.ranch_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所在生产地" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.factory_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生产时间" align="center" prop="register_time" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.factory_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效期" align="center" min-width="80">
        <template slot-scope="{row}">
          <span>{{ row.valid_period }}</span>
        </template>
      </el-table-column>
      <el-table-column label="挤奶员" align="center" min-width="80">
        <template slot-scope="{row}">
          <span>{{ row.milking_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生产员" align="center" min-width="80">
        <template slot-scope="{row}">
          <span>{{ row.create_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="配送员" align="center" min-width="80">
        <template slot-scope="{row}">
          <span>{{ row.delivery_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="扫码数量" align="center" min-width="80">
        <template slot-scope="{row}">
          <span>{{ row.scan_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="120">
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="账号" prop="admin_account">
          <el-input v-model="temp.admin_account" placeholder="请填写登录账号" />
        </el-form-item>
        <el-form-item label="权限组" prop="power_team">
          <el-select v-model="temp.power_id" class="filter-item" placeholder="请选择权限组">
            <el-option v-for="item in powerList" :key="item.power_id" :label="item.power_name" :value="item.power_id" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="创" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item> -->
        <el-form-item label="密码" prop="passwd">
          <el-input v-model="temp.passwd" placeholder="请填写登录密码,默认为123456" />
        </el-form-item>
        <el-form-item label="状态" prop="is_lock">
          <el-radio-group v-model="temp.is_lock">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">锁定</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createMaster, updateMaster, deleteMaster, deleteMasterAll } from '@/api/scan'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '正常': 'success',
        '禁用': 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
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
        admin_account: '',
        admin_pwd: '',
        power_team: 0,
        is_lock: false,
        IdArray: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: '创建管理员'
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
          createMaster(this.temp).then((response) => {
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
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.is_lock === 0) {
            this.temp.is_lock_str = '正常'
          } else {
            this.temp.is_lock_str = '锁定'
          }
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateMaster(tempData).then(() => {
            const index = this.list.findIndex(v => v.admin_id === this.temp.admin_id)
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
      deleteMaster(this.temp).then(() => {
        this.$notify({
          title: '删除管理员',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
      this.list.splice(index, 1)
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
      this.multipleSelection = []
      this.$refs.listTable.clearSelection()
    },
    deleteAll() {
      this.listLoading = true
      this.temp.IdArray = this.multipleSelection
      deleteMasterAll(this.temp).then(() => {
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
        this.multipleSelection.push(item.admin_id)
      })
    }
  }
}
</script>
<style>
  .labelFontColor .el-form-item__label{
    color: #343434;
  }
</style>

