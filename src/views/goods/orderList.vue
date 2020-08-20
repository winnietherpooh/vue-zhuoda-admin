<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="box-card" style="background-color:#EFF2F4;padding:15px;">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="买家昵称" class="labelFontColor">
            <el-input v-model="listQuery.nickName" placeholder="请输入账号" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
          </el-form-item>
          <el-form-item label="订单编号" class="labelFontColor">
            <el-input v-model="listQuery.orderNo" placeholder="请输入账号" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
          </el-form-item>
          <el-form-item label="微信交易单号" class="labelFontColor">
            <el-input v-model="listQuery.wecharNo" placeholder="请输入账号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          </el-form-item>
          <el-form-item label="收货人手机号" class="labelFontColor">
            <el-input v-model="listQuery.mobile" placeholder="请输入账号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          </el-form-item>
          <el-form-item label="交易类型" class="labelFontColor">
            <el-select v-model="listQuery.importanceOptions1" style="width: 140px" class="filter-item" @change="handleFilter">
              <el-option v-for="item in importanceOptions1" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item label="类型" class="labelFontColor">
            <el-select v-model="listQuery.importanceOptions2" style="width: 140px" class="filter-item" @change="handleFilter">
              <el-option v-for="item in importanceOptions2" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" class="labelFontColor">
            <el-select v-model="listQuery.importanceOptions3" style="width: 140px" class="filter-item" @change="handleFilter">
              <el-option v-for="item in importanceOptions3" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item label="售后" class="labelFontColor">
            <el-select v-model="listQuery.importanceOptions4" style="width: 140px" class="filter-item" @change="handleFilter">
              <el-option v-for="item in importanceOptions4" :key="item.key" :label="item.label" :value="item.key" />
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
      <el-table-column type="expand" label="收货人详情" width="150">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="收货人">
              <span>{{ props.row.member_name }}</span>
            </el-form-item>
            <el-form-item label="收货人电话">
              <span>{{ props.row.member_mobile }}</span>
            </el-form-item>
            <el-form-item label="收货人地址">
              <span>{{ props.row.member_address }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="订单号" prop="nick_name" sortable="custom" align="center" min-width="162">
        <template slot-scope="{row}">
          <span>{{ row.order_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="create_time" sortable="custom" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="购买用户" align="center" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.nick_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单金额" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.order_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付金额" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.pay_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付时间" align="center" prop="create_time" sortable="custom" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.pay_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="微信单号" align="center" min-width="260">
        <template slot-scope="{row}">
          <span>{{ row.transaction_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运费" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.postage }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易类型" class-name="status-col" prop="is_delete" min-width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.is_cod_str | statusBuyFilter">
            {{ row.is_cod_str }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="类型" class-name="status-col" prop="is_delete" min-width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.order_type_str | statusTypeFilter">
            {{ row.order_type_str }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" prop="is_delete" min-width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.order_status_str | statusFilter">
            {{ row.order_status_str }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="售后" class-name="status-col" prop="is_delete" min-width="150">
        <template slot-scope="{row}">
          <el-tag :type="row.order_status_sub_str | statusAfterSaleFilter">
            {{ row.order_status_sub_str }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="查看商品" align="center" prop="create_time" sortable="custom" min-width="100">
        <template slot-scope="{row}">
          <span @click="showshopinfo(row.order_id)">查看商品</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="200">
        <template slot-scope="{row,$index}" style="width:200px;">
          <el-dropdown split-button type="primary">
            订单操作
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="row.order_status === 2" @click.native="sendGoodsBackage(row,1)">设置发货</el-dropdown-item>
              <el-dropdown-item @click.native="deleteOrder(row,$index)">删除</el-dropdown-item>
              <router-link v-if="row.order_status === 5" :to="'/goods/orderReturn/'+row.order_id">
                <el-dropdown-item>退款详情</el-dropdown-item>
              </router-link>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="deleteAll()">删除</el-button>
      <el-button @click="toggleSelection()">取消</el-button>
    </div>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="买家评价" :visible.sync="dialogFormVisible" width="1000px">
      <el-form ref="dataForm" :model="evaluteData" label-position="left" style="margin-left:50px;">
        <el-form-item>
          <template>
            <el-row :gutter="20">
              <el-col style="margin-top:20px;">
                <el-tag type="success">评价时间：{{ evaluteData.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</el-tag>
              </el-col>
              <el-col style="margin-top:20px;">
                <el-input v-if="evaluteData.content != ''" v-model="evaluteData.content" type="textarea" :rows="5" readonly />
              </el-col>
              <el-col v-if="evaluteData.image_list.length > 0" style="margin-top:20px;">
                <div class="demo-image" style="display:block">
                  <div v-for="(item,i) in evaluteData.image_list" :key="i" class="block">
                    <el-image style="width: 100px; height: 100px" :src="item" :preview-src-list="evaluteData.image_list" fit="fill" />
                  </div>
                </div>
              </el-col>
              <el-col v-if="evaluteData.media_list.length > 0">
                <div v-for="(item,i) in playerOptions.sources" :key="i" style="margin-top:20px;">
                  <video-player ref="videoPlayer + item" :playsinline="true" :options="playerOptions" class="video-player vjs-custom-skin" style="width:500px;" />
                </div>
              </el-col>
            </el-row>
            <div>
              <el-divider v-if="evaluteData.repeat_time != 0" content-position="left">牧场回复：{{ evaluteData.repeat_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</el-divider>
              <el-divider v-if="evaluteData.repeat_time == 0" content-position="left"> 牧场未回复 </el-divider>
              <el-input v-model="evaluteData.ranch_content" type="textarea" :rows="5" placeholder="请输入内容" />
              <el-button style="margin-top:20px;" @click="repeatBuyer()">回复买家</el-button>
            </div>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看商品" :visible.sync="showMemberSelected" width="1000px">
      <el-table
        :key="tableKey"
        ref="listTable"
        v-loading="listMemberLoading"
        :data="orderGoodsListInfo"
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
        <el-table-column label="商品图片" prop="goods_name" sortable="custom" align="center">
          <template slot-scope="{row}">
            <el-avatar :size="60" @error="errorHandler">
              <img :src="IMGCND.IMGCND + row.goods_image">
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column label="规格名称" prop="goods_name" sortable="custom" align="center">
          <template slot-scope="{row}">
            <span>{{ row.goodSpecial_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单价" prop="goods_name" sortable="custom" align="center">
          <template slot-scope="{row}">
            <span>{{ row.goods_price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="购买数量" prop="goods_name" sortable="custom" align="center">
          <template slot-scope="{row}">
            <span>{{ row.goods_num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="评价" class-name="status-col" prop="is_delete" width="150">
          <template slot-scope="{row}">
            <el-tag v-if="row.is_evakuate === 2" :type="row.is_evakuate_str | evenlateFilter">
              {{ row.is_evakuate_str }}
            </el-tag>
            <el-button v-if="row.is_evakuate === 1" size="mini" @click="showEvakuate(row)">查看评价</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button @click="addSpecial(row)">
              新增
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, getOrderInfo, repeatBuyerContent, setOrderStatus, deleteMn, deleteMnAll } from '@/api/order'
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
        '待支付': '',
        '代发货': 'info',
        '待收货': 'danger',
        '待评价': 'warning',
        '已完成': 'success'
      }
      return statusMap[status]
    },
    statusTypeFilter(status) {
      const statusMap = {
        '交易成功': 'success',
        '交易失败': 'danger',
        '等待交易': 'info'
      }
      return statusMap[status]
    },
    statusBuyFilter(status) {
      const statusMap = {
        '货到付款': 'warning',
        '先付后货': 'success'
      }
      return statusMap[status]
    },
    statusAfterSaleFilter(status) {
      const statusMap = {
        '退款成功': 'success',
        '退款失败': 'danger',
        '申请退款中': 'warning'
      }
      return statusMap[status]
    },
    evenlateFilter(status) {
      const statusMap = {
        '未评价': 'success',
        '已评价': 'danger'
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
      memberList: null,
      listMemberLoading: false,
      showMemberSelected: false,
      listQuery: {
        page: 1,
        limit: 10,
        nickName: '',
        mobile: '',
        wecharNo: '',
        orderNo: '',
        order_id: 0,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+admin_account'
      },
      importanceOptions1: [{ label: '所有', key: '0' }, { label: '货到付款', key: '1' }, { label: '立即支付', key: '2' }],
      importanceOptions2: [{ label: '所有', key: '0' }, { label: '交易成功', key: '1' }, { label: '交易失败', key: '2' }, { label: '等待交易', key: '3' }],
      importanceOptions3: [{ label: '所有', key: '0' }, { label: '待支付', key: '1' }, { label: '待发货', key: '2' }, { label: '待收货', key: '3' }, { label: '待评价', key: '4' }, { label: '售后中', key: '5' }],
      importanceOptions4: [{ label: '所有', key: '0' }, { label: '申请成功', key: '1' }, { label: '申请失败', key: '2' }, { label: '申请中', key: '3' }],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      powerList: [],
      showReviewer: false,
      temp: {
        orderId: 0
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
      orderGoodsListInfo: [],
      evaluteData: {
        create_time: '',
        content: '',
        ranch_content: '',
        repeat_time: '',
        image_list: [],
        media_list: [],
        evaluate_id: 0
      },
      playerOptions: {
        // 播放速度
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        // 如果true,浏览器准备好时开始回放。
        autoplay: false,
        // 默认情况下将会消除任何音频。
        muted: false,
        //  导致视频一结束就重新开始。
        loop: false,
        // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        preload: 'auto',
        language: 'zh-CN',
        // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        aspectRatio: '16:9',
        // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        fluid: true,
        sources: [{
          type: '',
          src: ''
        }],
        // 你的封面地址
        // poster: "../../static/images/test.jpg",
        // width: document.documentElement.clientWidth, //播放器宽度
        // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          // 全屏按钮
          fullscreenToggle: true
        }
      },
      imageData: [],
      dataTemp: {
        order_id: 0,
        order_status: 0,
        setStatus: 0,
        order_status_str: ''
      }
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
      this.listQuery.order_id = id
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
        orderId: 0
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
    //       createMn(this.temp).then((response) => {
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
        this.multipleSelection.push(item.order_id)
      })
    },
    showshopinfo(info) {
      this.listMemberLoading = true
      this.showMemberSelected = true
      this.temp.orderId = info
      getOrderInfo(this.temp).then(response => {
        this.orderGoodsListInfo = response.data
        console.log(response.data)
        this.listMemberLoading = false
      })
    },
    errorHandler() {
      return true
    },
    showEvakuate(row) {
      console.log(row)
      this.dialogFormVisible = true
      this.evaluteData = row
      console.log(row.media_list)
      this.playerOptions.sources = row.media_list
    },
    repeatBuyer() {
      repeatBuyerContent(this.evaluteData).then((response) => {
        this.postForm = {}
        this.$notify({
          title: '回复成功',
          message: '回复买家',
          type: 'success',
          duration: 2000
        })
      })
    },
    sendGoodsBackage(row, value) {
      this.dataTemp = row
      this.dataTemp.setStatus = value
      this.$confirm('确认商品已经配送中了吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setOrderStatus(this.dataTemp).then(() => {
          this.$notify({
            title: '设置订单状态',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        })
        if (value === 1) {
          this.dataTemp.order_status_str = '待收货'
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    getReturnInfo(row) {

    },
    deleteOrder(row, index) {
      this.temp = row
      this.$confirm('确定要删除此订单吗,删除后无法恢复', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMn(this.temp).then(() => {
          this.list.splice(index, 1)
          this.$notify({
            title: '删除订单',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    deleteAll() {
      this.$confirm('确定要批量删除订单吗,删除后无法恢复', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        this.temp.IdArray = this.multipleSelection
        deleteMnAll(this.temp).then(() => {
          this.$notify({
            title: '删除订单',
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
          message: '已取消'
        })
      })
    }
  }
}
</script>
<style>
  .labelFontColor .el-form-item__label{
    color: #343434;
  }
  .el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .block {
    padding: 15px;
    text-align: center;
    border: 1px solid #eff2f6;
    display: inline-block;
    width: 15%;
  }
  .el-dropdown {
    vertical-align: top;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  /* .row-center {
    width: 100%;
    height: 100%;
    border: 1px solid black;
    max-width: 200px;
  }
  .row-center img {
    position: absolute;
    width: 80%;
    height: 80%;
    top: 50%;
    transform: translate(-50%,-50%);
    left: 50%;
  } */
</style>

