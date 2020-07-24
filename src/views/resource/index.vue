<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="box-card" style="background-color:#EFF2F4;padding:15px;height:72px;">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="资源名称" class="labelFontColor">
            <el-input v-model="listQuery.title" placeholder="请输入资源名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          </el-form-item>
          <el-form-item label="状态" class="labelFontColor">
            <el-select v-model="listQuery.importanceOptions" style="width: 140px" class="filter-item" @change="handleFilter">
              <el-option v-for="item in importanceOptions" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
            新增
          </el-button> -->
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
      :highlight-current-row="true"
      :select-on-indeterminate="true"
      @sort-change="sortChange"
      @select="selectAll"
      @select-all="selectAll"
    >
      <el-table-column type="selection" label="全选" align="center" width="55" />
      <el-table-column label="资源名称" prop="resource_name" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.resource_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="create_time" sortable="custom" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资源大小" align="center" prop="resource_size" sortable="custom" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.resource_size }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资源后缀" align="center" width="100px">
        <template slot-scope="{row}">
          <span>{{ row.resource_suffix }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址   【点击复制】" align="center">
        <template slot-scope="{row}">
          <el-popover trigger="hover" placement="top">
            <div>
              <img :src="row.tempView" width="300px">
            </div>
            <div slot="reference" class="name-wrapper">
              <el-tag v-clipboard:copy="row.resource_url" v-clipboard:success="clipboardSuccess" size="medium">{{ row.resource_url }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" prop="is_delete" width="100px">
        <template slot-scope="{row}">
          <el-tag :type="row.is_delete_str | statusFilter">
            {{ row.is_delete_str }}
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
        <el-form-item label="资源名称" prop="resource_name">
          <el-input v-model="temp.resource_name" placeholder="请填写资源名称" />
        </el-form-item>
        <el-form-item label="状态" prop="is_delete">
          <el-radio-group v-model="temp.is_delete">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">下线</el-radio>
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
import { fetchList, createResource, updateResource, deleteResource, deleteResourceAll } from '@/api/resource'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// import clip from '@/utils/clipboard' // use clipboard directly
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves, clipboard },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '正常': 'success',
        '下线': 'danger'
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
      importanceOptions: [{ label: '所有', key: '0' }, { label: '正常', key: '1' }, { label: '下线', key: '2' }],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      powerList: [],
      showReviewer: false,
      temp: {
        resource_name: '',
        is_delete: 0,
        resourceIdArray: []
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
      if (prop === 'resource_name') {
        this.sortByName(order)
      }
      if (prop === 'create_time') {
        this.sortByCreateTime(order)
      }
      if (prop === 'resource_size') {
        this.sortByResourceSize(order)
      }
    },
    sortByName(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+resource_name'
      } else {
        this.listQuery.sort = '-resource_name'
      }
      this.handleFilter()
    },
    sortByResourceSize(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+resource_size'
      } else {
        this.listQuery.sort = '-resource_size'
      }
      this.handleFilter()
    },
    sortByCreateTime(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+create_time'
      } else {
        this.listQuery.sort = '-create_time'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        resource_name: '',
        is_delete: false
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
          createResource(this.temp).then((response) => {
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
          if (this.temp.is_delete === 1) {
            this.temp.is_delete_str = '正常'
          } else {
            this.temp.is_delete_str = '下线'
          }
          const tempData = Object.assign({}, this.temp)
          updateResource(tempData).then(() => {
            const index = this.list.findIndex(v => v.resource_id === this.temp.resource_id)
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
          var selectedKey = this.$refs.tree.getCheckedKeys()
          const tempData = Object.assign({}, this.temp)
          tempData.selectedKey = selectedKey
          this.temp.powerMenu = selectedKey
          updateResource(tempData).then(() => {
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
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.temp.resource_id = row.resource_id
        deleteResource(this.temp).then(() => {
          this.$notify({
            title: '删除资源',
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
      this.multipleSelection = []
      this.$refs.listTable.clearSelection()
    },
    deleteAll() {
      this.listLoading = true
      this.temp.resourceIdArray = this.multipleSelection
      deleteResourceAll(this.temp).then(() => {
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
        this.multipleSelection.push(item.resource_id)
      })
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
</style>

