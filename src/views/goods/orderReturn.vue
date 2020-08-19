<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="box-card" style="background-color:#EFF2F4;padding:15px;height:72px;">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="订单编号" class="labelFontColor">
            <el-input v-model="listQuery.orderNo" placeholder="请输入订单编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          </el-form-item>
          <el-form-item label="退款编号" class="labelFontColor">
            <el-input v-model="listQuery.returnNo" placeholder="请输入退款编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          </el-form-item>
          <el-form-item label="微信交易单号" class="labelFontColor">
            <el-input v-model="listQuery.wechatNo" placeholder="请输入微信交易单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          </el-form-item>
          <el-form-item label="退款状态" class="labelFontColor">
            <el-select v-model="listQuery.importanceOptions" style="width: 140px" class="filter-item" @change="handleFilter">
              <el-option v-for="item in importanceOptions" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item label="微信状态" class="labelFontColor">
            <el-select v-model="listQuery.wechatOptions" style="width: 140px" class="filter-item" @change="handleFilter">
              <el-option v-for="item in wechatOptions" :key="item.key" :label="item.label" :value="item.key" />
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
      <el-table-column label="退款编号" prop="goods_name" align="center" min-width="140">
        <template slot-scope="{row}">
          <span>{{ row.return_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属订单" prop="goods_name" align="center" min-width="165">
        <template slot-scope="{row}">
          <router-link :to="'/goods/orderList/'+row.order_id">
            <span>{{ row.order_no }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="发起时间" align="center" prop="create_time" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退款金额" align="center" prop="create_time" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.return_money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货物状态" align="center" prop="create_time" min-width="200">
        <template slot-scope="{row}">
          <span>{{ row.goods_status_str }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退款理由" align="center" prop="create_time" min-width="200">
        <template slot-scope="{row}">
          <span>{{ row.return_type_str }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退款凭证" align="center" min-width="100">
        <template slot-scope="{row}">
          <el-image v-if="row.image_list.length > 0" src="https://rescdn.zhuodamilk.com/admin-use/admin-image-big-view-3.png" fit="fill" :preview-src-list="row.image_list" />
          <span v-if="row.image_list.length < 1">无图片评论</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" prop="is_delete" min-width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.return_result_str | statusFilter">
            {{ row.return_result_str }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="驳回理由" align="center" prop="create_time" min-width="200">
        <template slot-scope="{row}">
          <span>{{ row.fail_reslut }}</span>
        </template>
      </el-table-column>
      <el-table-column label="微信退款状态" class-name="status-col" prop="is_delete" min-width="130">
        <template slot-scope="{row}">
          <el-tag :type="row.wechat_result_str | statusWechatFilter">
            {{ row.wechat_result_str }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="到账金额" align="center" prop="create_time" min-width="100">
        <template slot-scope="{row}">
          <span>￥{{ row.wechat_money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退款到账时间" align="center" prop="create_time" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.wechat_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="微信退款说明" align="center" prop="create_time" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.wechat_explain }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="200">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.return_result == 1" type="success" size="mini" @click="confirmReturn(row,$index)">
            同意退款
          </el-button>
          <!-- <el-button size="mini" type="warning" style="margin-left:10px" @click="addSpecial(row)">
            添加规格
          </el-button> -->
          <el-button v-if="row.return_result == 1" size="mini" type="danger" style="margin-left:10px" @click="failReasonDialog(row,$index)">
            申请驳回
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
              <el-image :src="item" fit="fill" />
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

    <el-dialog :visible.sync="dialogForm2Visible" width="400px">
      <el-form :model="temp">
        <el-form-item>
          <el-col>驳回理由:</el-col>
          <el-col><el-input v-model="temp.fail_reslut" type="textarea" rows="5" /></el-col>
        </el-form-item>
        <el-form-item align="center">
          <el-button @click="closeView2Dialog">
            关闭
          </el-button>
          <el-button type="primary" @click="replyContentTxt()">
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getReturnList, cReturn, updateMn, deleteMn, deleteMnAll, disReturn } from '@/api/goods'
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
        '退款成功': 'success',
        '退款中': 'warning',
        '退款失败': 'danger'
      }
      return statusMap[status]
    },
    statusWechatFilter(status) {
      const statusMap = {
        '未处理': 'info',
        '退款成功': 'success',
        '退款异常': 'danger',
        '退款关闭': ''
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
        orderId: 0,
        importance: undefined,
        wechatNo: undefined,
        returnNo: undefined,
        order_no: undefined,
        sort: '+admin_account'
      },
      importanceOptions: [{ label: '所有', key: '0' }, { label: '退款中', key: '1' }, { label: '退款成功', key: '2' }, { label: '退款失败', key: '3' }, { label: '发起退款', key: '4' }],
      wechatOptions: [{ label: '所有', key: '0' }, { label: '成功', key: '1' }, { label: '异常', key: '2' }, { label: '关闭', key: '3' }],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      powerList: [],
      showReviewer: false,
      dialogForm2Visible: false,
      failReason: '',
      temp: {
        nick_name: '',
        is_delete: 0,
        IdArray: [],
        return_id: 0,
        fail_reslut: ''
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
      orderId: 0,
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
    const id = this.$route.params && this.$route.params.orderId
    this.getList(id)
  },
  methods: {
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #EFF2F4;color: #343434;padding: 8px;'
      }
    },
    getList(id) {
      this.listLoading = true
      this.listQuery.orderId = id
      console.log(this.orderId)
      console.log(this.listQuery.orderId)
      getReturnList(this.listQuery).then(response => {
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
    // createData() {
    //   this.$refs['dataForm'].validate((valid) => {
    //     if (valid) {
    //       cReturn(this.temp).then((response) => {
    //         // this.list.unshift(this.temp)
    //         this.dialogFormVisible = false
    //         this.getList()
    //         this.$notify({
    //           title: 'Success',
    //           message: 'Created Successfully',
    //           type: 'success',
    //           duration: 2000
    //         })
    //       })
    //     }
    //   })
    // },
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
        this.multipleSelection.push(item.goods_id)
      })
    },
    showGoodsView(row) {
      this.dialogFormVisible = true
      this.imgList = row.image_list
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
    },
    confirmReturn(row, index) {
      this.temp.return_id = row.return_id
      this.$confirm('确定要退款到用户账户吗?', '危险操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.temp.wechat_result_str = '发起退款'
        this.temp.return_id = row.return_id
        cReturn(this.temp).then(() => {
          this.list.splice(index, 1, this.temp)
          this.$notify({
            title: '退款到用户',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        })
        // this.list.splice(index, 1)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    failReasonDialog(row, index) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogForm2Visible = true
    },
    closeView2Dialog() {
      this.dialogForm2Visible = false
    },
    replyContentTxt() {
      const index = this.list.findIndex(v => v.return_id === this.temp.return_id)
      disReturn(this.temp).then(() => {
        this.temp.return_result_str = '退款失败'
        this.temp.return_result = 3
        this.list.splice(index, 1, this.temp)
        this.$notify({
          title: '驳回退款申请',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
      this.dialogForm2Visible = false
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

