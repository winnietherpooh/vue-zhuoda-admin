<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="box-card" style="background-color:#EFF2F4;padding:15px;height:72px;">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="请选择牧场" class="labelFontColor">
            <el-select v-model="listQuery.ranchSelectList" style="width: 140px" class="filter-item" @change="selectedRanch">
              <el-option label="请选择" value="0" />
              <el-option v-for="item in ranchSelectList" :key="item.ranch_id" :label="item.ranch_name" :value="{value:item.ranch_id,label:item.ranch_name}" />
            </el-select>
          </el-form-item>
          <el-form-item label="用户昵称" class="labelFontColor">
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
          <el-button v-if="ranchSelected > 0" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="createData">
            新增
          </el-button>
          <!-- <el-form-item label="当前选择牧场" class="labelFontColor" style="padding-left:20px">
            <el-tag type="success">{{ ranchName }}</el-tag>
          </el-form-item> -->
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
      <el-table-column label="牧场名称" prop="ranch_name" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.ranch_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="员工类型" class-name="status-col" prop="is_delete" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.staff_type_str | staffFilter">
            {{ row.staff_type_str }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" prop="nick_name" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.nick_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" prop="real_name" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.real_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" align="center" prop="create_time" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职工状态" class-name="status-col" prop="is_delete" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.user_status_str | staffStatusFilter">
            {{ row.user_status_str }}
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
    <div>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="牧场名称" prop="ranch_name">
          <el-input v-model="temp.ranch_name" readonly="" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nick_name">
          <el-input v-model="temp.nick_name" readonly="" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="real_name">
          <el-input v-model="temp.real_name" />
        </el-form-item>
        <el-form-item label="职工状态" prop="user_status">
          <el-radio-group v-model="temp.user_status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">请假</el-radio>
            <el-radio :label="3">离职</el-radio>
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
    <el-dialog :title="ranchSelectedName" :visible.sync="showMemberSelected" width="1000px">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="用户昵称" class="labelFontColor">
          <el-input v-model="listMemberQuery.title" placeholder="请输入账号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="queryMemberName">
          搜索
        </el-button>
      </el-form>
      <el-table
        :key="tableKey"
        ref="listTable"
        v-loading="listMemberLoading"
        :data="memberList"
        border
        fit
        :header-cell-style="tableHeaderColor"
        :cell-style="{padding:'8px'}"
        @sort-change="sortChange"
      >
        <el-table-column label="用户昵称" prop="nick_name" sortable="custom" align="center">
          <template slot-scope="{row}">
            <span>{{ row.nick_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="挤奶员" class-name="status-col" prop="is_delete" width="100">
          <template slot-scope="{row}">
            <el-tag :type="row.is_milker_str | memberFilter">
              {{ row.is_milker_str }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="生产员" class-name="status-col" prop="is_delete" width="100">
          <template slot-scope="{row}">
            <el-tag :type="row.is_creater_str | memberFilter">
              {{ row.is_creater_str }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="配送员" class-name="status-col" prop="is_delete" width="100">
          <template slot-scope="{row}">
            <el-tag :type="row.is_dispatching_str | memberFilter">
              {{ row.is_dispatching_str }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="用户状态" class-name="status-col" prop="is_delete" width="100">
          <template slot-scope="{row}">
            <el-tag :type="row.is_delete_str | statusFilter">
              {{ row.is_delete_str }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-dropdown style="margin-left:10px">
              <el-button type="primary" size="mini">
                设置<i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="row.is_milker=== 1" @click.native="setMilkerCreate(row,$index,1,0)">取消挤奶员</el-dropdown-item>
                <el-dropdown-item v-if="row.is_milker=== 0" @click.native="setMilkerCreate(row,$index,1,1)">设置挤奶员</el-dropdown-item>
                <el-dropdown-item v-if="row.is_creater=== 1" @click.native="setMilkerCreate(row,$index,2,0)">取消生产员</el-dropdown-item>
                <el-dropdown-item v-if="row.is_creater=== 0" @click.native="setMilkerCreate(row,$index,2,1)">设置生产员</el-dropdown-item>
                <el-dropdown-item v-if="row.is_dispatching=== 1" @click.native="setMilkerCreate(row,$index,3,0)">取消配送员</el-dropdown-item>
                <el-dropdown-item v-if="row.is_dispatching=== 0" @click.native="setMilkerCreate(row,$index,3,1)">设置配送员</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="memberTotal>0" :total="memberTotal" :page.sync="listMemberQuery.page" :limit.sync="listMemberQuery.limit" @pagination="getMemberList" />
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, getRanchSelect, getMember, setMn, deleteMn, deleteStaffAll, updateMn } from '@/api/ranchStaff'
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
        '锁定': 'danger'
      }
      return statusMap[status]
    },
    memberFilter(status) {
      const statusMap = {
        '是': 'success',
        '否': 'danger'
      }
      return statusMap[status]
    },
    staffFilter(status) {
      const statusMap = {
        '挤奶员': 'success',
        '生产员': 'danger',
        '配送员': 'warning'
      }
      return statusMap[status]
    },
    staffStatusFilter(status) {
      const statusMap = {
        '正常': 'success',
        '请假': 'danger',
        '离职': 'warning'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      memberList: null,
      memberTotal: 0,
      listMemberQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+admin_account'
      },
      listMemberLoading: true,
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
      importanceOptions: [{ label: '所有', key: '0' }, { label: '正常', key: '1' }, { label: '请假', key: '2' }, { label: '离职', key: '3' }],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      powerList: [],
      showReviewer: false,
      temp: {
        nick_name: '',
        is_delete: 0,
        IdArray: []
      },
      memberTemp: {
        is_creater_str: '否',
        is_creater: 0,
        is_dispatching_str: '否',
        is_dispatching: 0,
        is_milker_str: '否',
        is_milker: 0
      },
      dialogFormVisible: false,
      showMemberSelected: false,
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
      multipleSelection: [],
      ranchId: 0,
      ranchName: '未选择',
      ranchSelectList: [],
      ranchSelected: 0,
      ranchSelectedName: 'fdsfds'
    }
  },
  created() {
    this.getList()
    this.getRanchSelectList()
    this.ranchId = this.$route.query.ranchId
    this.ranchName = this.$route.query.ranchName
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
    getMemberList() {
      this.listMemberLoading = true
      getMember(this.listMemberQuery).then(response => {
        this.memberList = response.data.data
        this.memberTotal = response.data.total
        this.listMemberLoading = false
      })
    },
    getRanchSelectList() {
      getRanchSelect().then(response => {
        this.ranchSelectList = response.data
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
    selectAll(selection, row) {
      this.multipleSelection = []
      selection.map((item) => {
        this.multipleSelection.push(item.milker_id)
      })
    },
    selectedRanch(selected) {
      if (isNaN(this.ranchSelected) && typeof (selected.value) !== 'number') {
        this.ranchSelected = 0
      } else {
        this.ranchSelected = Number(selected.value)
      }
      this.ranchSelectedName = selected.label
      this.listMemberQuery.ranchId = this.ranchSelected
      if (this.ranchSelected > 0) {
        getMember(this.listMemberQuery).then(response => {
          this.memberList = response.data.data
          this.memberTotal = response.data.total
          this.listMemberLoading = false
        })
      }
      this.listLoading = true
      this.listQuery.page = 1
      this.listQuery.ranchId = this.ranchSelected
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    createData() {
      this.showMemberSelected = true
    },
    queryMemberName() {
      this.listMemberLoading = true
      getMember(this.listMemberQuery).then(response => {
        this.memberList = response.data.data
        this.memberTotal = response.data.total
        this.listMemberLoading = false
      })
    },
    setMilkerCreate(row, index, type, value) {
      this.temp = row
      this.temp.ranch_id = this.ranchSelected
      this.temp.member_id = row.member_id
      this.temp.type = type
      switch (type) {
        case 1:
          if (value === 1) {
            this.temp.is_milker = 1
            this.temp.is_milker_str = '是'
          } else {
            this.temp.is_milker = 0
            this.temp.is_milker_str = '否'
          }
          break
        case 2:
          if (value === 1) {
            this.temp.is_creater = 1
            this.temp.is_creater_str = '是'
          } else {
            this.temp.is_creater = 0
            this.temp.is_creater_str = '否'
          }
          break
        case 3:
          if (value === 1) {
            this.temp.is_dispatching = 1
            this.temp.is_dispatching_str = '是'
          } else {
            this.temp.is_dispatching = 0
            this.temp.is_dispatching_str = '否'
          }
          break
      }
      setMn(this.temp).then(() => {
        this.memberList.splice(index, 1, this.temp)
        this.$notify({
          title: '删除用户',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDelete(row, index) {
      this.temp.milker_id = row.milker_id
      this.$confirm('此操作将永久删除该职工, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMn(this.temp).then(() => {
          this.$notify({
            title: '删除职工',
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
    deleteAll() {
      this.temp.ranchIdArray = this.multipleSelection
      if (this.temp.ranchIdArray.length <= 0) {
        return
      }
      this.$confirm('此操作将永久删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        this.temp.ranchIdArray = this.multipleSelection
        deleteStaffAll(this.temp).then(() => {
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
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.user_status === 1) {
            this.temp.user_status_str = '正常'
          } else if (this.temp.user_status === 2) {
            this.temp.user_status_str = '请假'
          } else {
            this.temp.user_status_str = '离职'
          }
          updateMn(this.temp).then(() => {
            const index = this.list.findIndex(v => v.milker_id === this.temp.milker_id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '操作成功',
              message: '编辑员工',
              type: 'success',
              duration: 2000
            })
          })
        }
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

