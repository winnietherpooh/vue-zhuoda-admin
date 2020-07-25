<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="box-card" style="background-color:#EFF2F4;padding:15px;height:72px;">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="商品名称" class="labelFontColor">
            <el-input v-model="listQuery.title" placeholder="请输入商品名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      @select="selectAll"
      @select-all="selectAll"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="商品名称" prop="goods_name" sortable="custom" align="center">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" content="点击可复制轮播图跳转商品地址" placement="top-start">
            <span v-clipboard:copy="row.goods_name" v-clipboard:success="clipboardSuccess">{{ row.goods_name }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" align="center" prop="create_time" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="虚拟出售数量" align="center" prop="create_time" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.set_seal_nums + row.real_seal_nums }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际出售数量" align="center" prop="create_time" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.real_seal_nums }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片预览" align="center">
        <template slot-scope="{row}">
          <el-button icon="el-icon-picture-outline" circle @click="showGoodsView(row)" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="登录次数" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.login_nums }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="状态" class-name="status-col" prop="is_delete" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.is_offline_str | statusFilter">
            {{ row.is_offline_str }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <router-link :to="'/goods/editGoods/'+row.goods_id">
            <el-button type="success" size="mini">
              编辑
            </el-button>
          </router-link>
          <!-- <el-button size="mini" type="warning" style="margin-left:10px" @click="addSpecial(row)">
            添加规格
          </el-button> -->
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" style="margin-left:10px" @click="handleDelete(row,$index)">
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

    <el-dialog :visible.sync="dialogFormVisible" width="400px">
      <el-form>
        <el-form-item>
          <el-carousel indicator-position="outside" height="375px">
            <el-carousel-item v-for="(item,i) in imgList" :key="i">
              <el-image :src="IMGCND.IMGCND + item" fit="fill" />
            </el-carousel-item>
          </el-carousel>
        </el-form-item>
        <el-form-item align="center">
          <el-button type="primary" @click="closeViewDialog">
            关闭
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- <el-dialog :visible.sync="addSpecialDialog">
      <el-form ref="dataForm" :rules="rules" :model="specialTemp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="商品名称">
          <el-input v-model="specialTemp.goods_name" style="width:300px;" readonly />
        </el-form-item>
        <el-form-item label="规格名称">
          <el-input v-model="specialTemp.special_name" style="width:300px;" readonly />
        </el-form-item>
        <el-form-item label="商品单价">
          <el-input v-model="specialTemp.goods_price" style="width:300px;" readonly />
        </el-form-item>
        <el-form-item label="最大购买数量">
          <el-input v-model="specialTemp.max_buy" style="width:300px;" readonly />
        </el-form-item>
        <el-form-item label="商品状态">
          <el-radio-group v-model="specialTemp.is_offLine">
            <el-radio :label="1" border>正常</el-radio>
            <el-radio :label="2" border>下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { fetchList, createMn, updateMn, deleteMn, deleteMnAll } from '@/api/goods'
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
        '下架': 'danger'
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
      // addSpecialDialog: false,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+admin_account'
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
      specialTemp: {
        goods_name: '',
        special_name: '',
        goods_price: '',
        max_buy: '',
        is_offLine: 1
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
      multipleSelection: [],
      imgList: []
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
    },
    showGoodsView(row) {
      this.dialogFormVisible = true
      this.imgList = row.goods_views
      console.log(row)
    },
    closeViewDialog() {
      this.dialogFormVisible = false
      this.imgList = []
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功',
        type: 'success',
        duration: 1500
      })
    }
    // addSpecial(row) {
    //   // specialTemp
    //   this.specialTemp.goods_name = row.goods_name
    //   this.addSpecialDialog = true
    // }
  }
}
</script>
<style>
  .labelFontColor .el-form-item__label{
    color: #343434;
  }
</style>

