<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="box-card" style="background-color:#EFF2F4;padding:15px;height:72px;">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="商品名称" class="labelFontColor">
            <el-input v-model="listQuery.goodsName" placeholder="请输入商品名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          </el-form-item>
          <el-form-item label="规格名称" class="labelFontColor">
            <el-input v-model="listQuery.specialName" placeholder="请输入规格名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          </el-form-item>
          <el-form-item label="状态" class="labelFontColor">
            <el-select v-model="listQuery.importanceOptions" style="width: 140px" class="filter-item" @change="handleFilter">
              <el-option v-for="item in importanceOptions" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="createData">
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
      <el-table-column label="商品名称" prop="goods_name" sortable="custom" align="center">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" content="点击可复制轮播图跳转商品+规格地址" placement="top-start">
            <span v-clipboard:copy="row.goods_name" v-clipboard:success="clipboardSuccess">{{ row.goods_name }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="规格名称" prop="special_name" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.special_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品价格" prop="goods_price" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.goods_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最大购买数量" prop="max_buy" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.max_buy }}</span>
        </template>
      </el-table-column>
      <el-table-column label="口味" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.taste }}</span>
        </template>
      </el-table-column>
      <el-table-column label="包装" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.packaging }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效期" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>常温下 {{ row.max_time }} 天</span>
        </template>
      </el-table-column>
      <el-table-column label="规格状态" class-name="status-col" prop="is_delete" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.is_offline_str | specialFilter">
            {{ row.is_offline_str }}
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
    <el-dialog title="新增规格" :visible.sync="showMemberSelected" width="1000px">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="商品名称" class="labelFontColor">
          <el-input v-model="listMemberQuery.title" placeholder="请输入商品名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
        <el-table-column label="商品名称" prop="goods_name" sortable="custom" align="center">
          <template slot-scope="{row}">
            <span>{{ row.goods_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品状态" class-name="status-col" prop="is_delete" width="100">
          <template slot-scope="{row}">
            <el-tag :type="row.is_offline_str | statusFilter">
              {{ row.is_offline_str }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button @click="addSpecial(row)">
              新增
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="memberTotal>0" :total="memberTotal" :page.sync="listMemberQuery.page" :limit.sync="listMemberQuery.limit" @pagination="getMemberList" />
    </el-dialog>

    <el-dialog :visible.sync="addSpecialDialog">
      <el-form ref="specialDataForm" :rules="rules" :model="specialTemp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="商品名称">
          <el-input v-model="specialTemp.goods_name" style="width:300px;" readonly />
        </el-form-item>
        <el-form-item label="规格名称">
          <el-input v-model="specialTemp.special_name" style="width:300px;" />
        </el-form-item>
        <el-form-item label="有效期">
          <el-popover
            placement="top-start"
            trigger="hover"
            content="有效期为 3 天,则填写 3。"
          >
            <el-input slot="reference" v-model="specialTemp.max_time" maxlength="10" type="number" style="width:300px;" />
          </el-popover>
        </el-form-item>
        <el-form-item label="包装">
          <el-input v-model="specialTemp.taste" style="width:300px;" />
        </el-form-item>
        <el-form-item label="口味">
          <el-input v-model="specialTemp.packaging" style="width:300px;" />
        </el-form-item>
        <el-form-item label="商品单价">
          <el-popover
            placement="top-start"
            width="450"
            trigger="hover"
            content="商品单价,单位: 元  。"
          >
            <el-input slot="reference" v-model="specialTemp.goods_price" oninput="value=value.replace(/[^\d.]/g,'')" maxlength="10" type="number" style="width:300px;" />
          </el-popover>
        </el-form-item>
        <el-form-item label="最大购买数量">
          <el-popover
            placement="top-start"
            width="450"
            trigger="hover"
            content="用户可购买的最大数量,如果不限制,则填写 0  。"
          >
            <el-input slot="reference" v-model="specialTemp.max_buy" maxlength="10" type="number" style="width:300px;" />
          </el-popover>
        </el-form-item>
        <el-form-item label="商品状态">
          <el-popover
            placement="top-start"
            width="450"
            trigger="hover"
            content="选择【正常】,则会显示在商品规格列表中,选择【下架】,则不会显示 。"
          >
            <el-radio-group slot="reference" v-model="specialTemp.is_offline">
              <el-radio :label="1" border>正常</el-radio>
              <el-radio :label="2" border>下架</el-radio>
            </el-radio-group>
          </el-popover>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addSpecialDialog = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createSpecialData():updateSpecialData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, getRanchSelect, getGoodsList, addMn, deleteMn, deleteSpecialAll, updateMn } from '@/api/goodSpecial'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves, clipboard },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '正常': 'success',
        '锁定': 'danger'
      }
      return statusMap[status]
    },
    specialFilter(status) {
      const statusMap = {
        '正常': 'success',
        '下架': 'danger'
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
      addSpecialDialog: false,
      listMemberQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+admin_account'
      },
      specialTemp: {
        goods_id: 0,
        goods_name: '',
        special_name: '',
        goods_price: '',
        max_buy: '',
        is_offline: 1,
        max_time: 0,
        taste: '',
        packaging: ''
      },
      listMemberLoading: true,
      value1: true,
      value2: true,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        specialName: undefined,
        type: undefined,
        sort: '+admin_account',
        goodsName: undefined
      },
      importanceOptions: [{ label: '所有', key: '0' }, { label: '正常', key: '1' }, { label: '下架', key: '2' }],
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
      showMemberSelected: false,
      dialogStatus: '',
      pvData: [],
      rules: {
        special_name: [{ required: true, message: '规格名称必须填写', trigger: 'change' }],
        goods_price: [{ type: 'price', required: true, message: '商品单价必须填写', trigger: 'change' }],
        is_offline: [{ required: true, message: '请选择规格状态', trigger: 'change' }]
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
    this.getMemberList()
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
      getGoodsList(this.listMemberQuery).then(response => {
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
      this.specialTemp = {
        goods_name: '',
        special_name: '',
        goods_price: '',
        max_buy: '',
        is_offline: 1
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.addSpecialDialog = true
    },
    handleUpdate(row) {
      this.resetTemp()
      this.specialTemp = Object.assign({}, row) // 拿实际列的值
      this.dialogStatus = 'update'
      this.addSpecialDialog = true
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
        this.multipleSelection.push(item.special_id)
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
        getGoodsList(this.listMemberQuery).then(response => {
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
      getGoodsList(this.listMemberQuery).then(response => {
        this.memberList = response.data.data
        this.memberTotal = response.data.total
        this.listMemberLoading = false
      })
    },
    handleDelete(row, index) {
      this.specialTemp.special_id = row.special_id
      this.$confirm('此操作将永久删除该规格, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMn(this.specialTemp).then(() => {
          this.$notify({
            title: '删除规格',
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
      console.log(this.multipleSelection)
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
        deleteSpecialAll(this.temp).then(() => {
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
    updateSpecialData() {
      this.$refs['specialDataForm'].validate((valid) => {
        if (valid) {
          updateMn(this.specialTemp).then(() => {
            const index = this.list.findIndex(v => v.special_id === this.specialTemp.special_id)
            if (this.specialTemp.is_offline === 1) {
              this.specialTemp.is_offline_str = '正常'
            } else {
              this.specialTemp.is_offline_str = '下架'
            }
            this.list.splice(index, 1, this.specialTemp)
            this.addSpecialDialog = false
            this.$notify({
              title: '操作成功',
              message: '编辑规格',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    addSpecial(row) {
      this.resetTemp()
      this.addSpecialDialog = true
      this.dialogStatus = 'create'
      this.specialTemp.goods_name = row.goods_name
      this.specialTemp.goods_id = row.goods_id
      this.$nextTick(() => {
        this.$refs['specialDataForm'].clearValidate()
      })
    },
    createSpecialData() {
      this.$refs['specialDataForm'].validate((valid) => {
        if (valid) {
          addMn(this.specialTemp).then((response) => {
            // this.list.unshift(this.temp)
            this.addSpecialDialog = false
            this.resetTemp()
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
    selectOffline(value) {
      if (value === 1) {
        this.specialTemp.is_offline_str = '正常'
      } else {
        this.specialTemp.is_offline_str = '下架'
      }
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

