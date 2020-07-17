<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="box-card" style="background-color:#EFF2F4;padding:15px;height:72px;">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="权限组名称" class="labelFontColor">
            <el-input v-model="listQuery.title" placeholder="请输入权限组名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column label="权限组名称" prop="admin_account" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.power_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="查看权限" align="center" prop="register_time" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.power_array }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限组说明" align="center" prop="register_time" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.power_explain }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管理员数量" align="center">
        <template slot-scope="{row}">
          <span>{{ row.adminnum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" prop="is_lock">
        <template slot-scope="{row}">
          <el-tag :type="row.is_lock_str | statusFilter">
            {{ row.is_lock_str }}
          </el-tag>
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
          <el-button size="mini" type="primer" @click="handlePowerTree(row)">
            编辑权限
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="权限组名称" prop="power_name">
          <el-input v-model="temp.power_name" placeholder="请填写权限组名称" />
        </el-form-item>
        <el-form-item label="权限组说明" prop="power_explain">
          <el-input v-model="temp.power_explain" type="textarea" rows="3" placeholder="请填写权限组说明" />
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
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="收货地址" :visible.sync="dialogFormPowerTree">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-tree
          ref="tree"
          :data="powerList"
          :default-checked-keys="temp.powerMenu"
          show-checkbox
          default-expand-all
          node-key="id"
          highlight-current
          :props="defaultProps"
        />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormPowerTree = false">取 消</el-button>
        <el-button type="primary" @click="updatePowerTree()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createPowerTeam, updatePowerTeam, getPowerTree, deletePowerTeam, updatePowerList, deleteAllPowerTeam } from '@/api/power'
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
        limit: 20,
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
        power_name: '',
        power_explain: '',
        is_lock: false,
        powerMenu: []
      },
      dialogFormVisible: false,
      dialogFormPowerTree: false,
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
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      multipleSelection: []
    }
  },
  created() {
    this.getList()
    this.getPowerListData()
  },
  methods: {
    handlePowerTree(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogFormPowerTree = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
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
    getPowerListData() {
      getPowerTree().then(response => {
        console.log(response.data)
        this.powerList = response.data
      })
    },
    getPowerTreeData() {
      getPowerTree().then(response => {
        this.powerList = response.data
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
        power_name: '',
        power_explain: '',
        is_lock: false,
        powerMenu: []
      }
    },
    handleAddPower() {
      this.resetTemp()
      this.dialogStatus = 'addpower'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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
          createPowerTeam(this.temp).then((response) => {
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
      console.log(this.temp.powerMenu)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.is_lock === 0) {
            this.temp.is_lock_str = '正常'
          } else {
            this.temp.is_lock_str = '锁定'
          }
          const tempData = Object.assign({}, this.temp)
          console.log(this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updatePowerTeam(tempData).then(() => {
            const index = this.list.findIndex(v => v.power_id === this.temp.power_id)
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
    updatePowerTree() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.$refs.tree.getCheckedKeys())
          var selectedKey = this.$refs.tree.getCheckedKeys()
          const tempData = Object.assign({}, this.temp)
          tempData.selectedKey = selectedKey
          this.temp.powerMenu = selectedKey
          updatePowerList(tempData).then(() => {
            const index = this.list.findIndex(v => v.power_id === this.temp.power_id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormPowerTree = false
            this.$notify({
              title: '编辑权限',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.temp.power_id = row.power_id
      deletePowerTeam(this.temp).then(() => {
        this.$notify({
          title: '删除权限组',
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
      console.log(this.multipleSelection)
      this.multipleSelection = []
      this.$refs.listTable.clearSelection()
    },
    deleteAll() {
      this.listLoading = true
      this.temp.IdArray = this.multipleSelection
      deleteAllPowerTeam(this.temp).then(() => {
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
        this.multipleSelection.push(item.power_id)
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

