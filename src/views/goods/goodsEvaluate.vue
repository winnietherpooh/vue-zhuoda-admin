<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="box-card" style="background-color:#EFF2F4;padding:15px;min-height:72px;">
        <el-form :inline="true">
          <el-form-item label="商品名称" class="labelFontColor">
            <el-input v-model="listQuery.goodsName" placeholder="请输入商品名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          </el-form-item>
          <el-form-item label="规格名称" class="labelFontColor">
            <el-input v-model="listQuery.goodsSpecial" placeholder="请输入规格名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          </el-form-item>
          <el-form-item label="用户昵称" class="labelFontColor">
            <el-input v-model="listQuery.memberName" placeholder="请输入用户昵称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          </el-form-item>
          <el-form-item label="分数条件" class="labelFontColor">
            <el-select v-model="listQuery.queryType" style="width: 140px" class="filter-item" @change="handleFilter">
              <el-option v-for="item in scoreType" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item label="评论分数" class="labelFontColor">
            <el-select v-model="listQuery.score" style="width: 140px" class="filter-item" @change="handleFilter">
              <el-option v-for="item in scoreValue" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
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
      stripe
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
      <el-table-column label="商品规格" align="center" prop="create_time" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.special_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="购买时间" align="center" prop="create_time" sortable="custom" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.pay_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评论分数" align="center" prop="create_time" sortable="custom" min-width="165">
        <template slot-scope="{row}">
          <el-rate v-model="row.score" disabled show-score text-color="#ff9900" />
        </template>
      </el-table-column>
      <el-table-column label="评论时间" align="center" prop="create_time" sortable="custom" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="包含视频/图片" class-name="status-col" prop="is_delete">
        <!-- <template slot-scope="{row}">
          <el-tag :type="row.had_video_str | videoStatusFilter">
            {{ row.had_video_str }}
          </el-tag>
        </template> -->
        <template slot-scope="{row,$index}">
          <el-switch
            v-model="row.had_video_str"
            active-value="是"
            inactive-value="否"
            style="display: block"
            active-text="是"
            inactive-text="否"
            @change="canSelect3($event,row,$index)"
          />
        </template>
      </el-table-column>
      <el-table-column label="查看图片" align="center">
        <template slot-scope="{row}">
          <el-image v-if="row.image_list.length > 0" src="https://rescdn.zhuodamilk.com/admin-use/admin-image-big-view-3.png" fit="fill" :preview-src-list="row.image_list" />
          <span v-if="row.image_list.length < 1">无图片评论</span>
        </template>
      </el-table-column>
      <el-table-column label="查看视频" align="center">
        <template slot-scope="{row}">
          <el-image v-if="row.media_list.length > 0" src="https://rescdn.zhuodamilk.com/admin-use/admin-video-big-view-2.png" fit="fill" @click="showGoodsView(row)" />
          <span v-if="row.media_list.length < 1">无视频评论</span>
        </template>
      </el-table-column>
      <el-table-column label="查看评论" align="center" width="100">
        <template slot-scope="{row}">
          <el-button icon="el-icon-s-comment" circle @click="showEInfo(row)" />
        </template>
      </el-table-column>
      <el-table-column label="商家回复时间" class-name="status-col" prop="is_delete" width="150">
        <template slot-scope="{row}">
          <el-tag :type="row.is_offline_str | statusFilter">
            <span>{{ row.repeat_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="商家回复内容" class-name="status-col" prop="is_delete">
        <template slot-scope="{row}">
          <span>{{ row.ranch_content }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="展示" class-name="status-col" prop="is_delete">
        <!-- <template slot-scope="{row}">
          <el-tag :type="row.is_show_str | isShowStatusFilter">
            {{ row.is_show_str }}
          </el-tag>
        </template> -->
        <template slot-scope="{row,$index}">
          <el-switch
            v-model="row.is_show_str"
            active-value="是"
            inactive-value="否"
            style="display: block"
            active-text="是"
            inactive-text="否"
            @change="canSelect2($event,row,$index)"
          />
        </template>
      </el-table-column>
      <el-table-column label="推荐" class-name="status-col" prop="is_delete">
        <!-- <template slot-scope="{row}">
          <el-tag :type="row.is_show_goods_str | isShowIndexStatusFilter">
            {{ row.is_show_goods_str }}
          </el-tag>
        </template> -->
        <template slot-scope="{row,$index}">
          <el-switch
            v-model="row.is_show_goods_str"
            active-value="是"
            inactive-value="否"
            style="display: block"
            active-text="是"
            inactive-text="否"
            @change="canSelect1($event,row,$index)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template slot-scope="{row,$index}">
          <!-- <router-link :to="'/goods/editGoods/'+row.goods_id">
            <el-button type="success" size="mini">
              编辑
            </el-button>
          </router-link> -->
          <el-dropdown>
            <el-button type="primary">更多菜单<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item>编辑</el-dropdown-item> -->
              <el-dropdown-item @click.native="handleDelete(row,$index)">删除</el-dropdown-item>
              <el-dropdown-item v-if="row.is_show === 1" @click.native="handleHidden(row,$index,2,1)">隐藏</el-dropdown-item>
              <el-dropdown-item v-if="row.is_show === 2" @click.native="handleHidden(row,$index,1,1)">显示</el-dropdown-item>
              <el-dropdown-item v-if="row.is_show_goods === 2" @click.native="handleHidden(row,$index,1,2)">设置推荐</el-dropdown-item>
              <el-dropdown-item v-if="row.is_show_goods === 1" @click.native="handleHidden(row,$index,2,2)">取消推荐</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button size="mini" type="warning" style="margin-left:10px" @click="addSpecial(row)">
            添加规格
          </el-button> -->
          <!-- <el-button v-if="row.status!='deleted'" size="mini" type="danger" style="margin-left:10px" @click="handleDelete(row,$index)">
            删除
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="deleteAll()">删除</el-button>
      <el-button @click="toggleSelection()">取消</el-button>
    </div>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :model="eInfo" :visible.sync="dialogFormVisible" width="545px">
      <el-form>
        <el-form-item>
          <div v-for="(item,i) in playerOptions.sources" :key="i" style="margin-top:20px;max-width:545px">
            <video-player ref="videoPlayer + item" :playsinline="true" :options="playerOptions" class="video-player vjs-custom-skin" style="width:500px;" />
          </div>
        </el-form-item>
        <el-form-item align="center">
          <el-button type="primary" @click="closeViewDialog">
            关闭
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :model="eInfo" :visible.sync="dialogForm2Visible" width="400px">
      <el-form>
        <el-form-item>
          <el-col>用户评论:</el-col>
          <el-col>{{ eInfo.content }}</el-col>
        </el-form-item>
        <el-form-item>
          <el-col>牧场回复:</el-col>
          <el-col><el-input v-model="eInfo.ranch_content" type="textarea" rows="5" /></el-col>
        </el-form-item>
        <el-form-item align="center">
          <el-button @click="closeView2Dialog">
            关闭
          </el-button>
          <el-button type="primary" @click="replyContentTxt(eInfo)">
            保存
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
import { getEList, createMn, updateMn, deleteMnE, deleteMnAllE, hiddenMn, replayE } from '@/api/goods'
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
    },
    videoStatusFilter(status) {
      const statusMap = {
        '是': 'success',
        '否': 'danger'
      }
      return statusMap[status]
    },
    isShowStatusFilter(status) {
      const statusMap = {
        '是': 'success',
        '否': 'danger'
      }
      return statusMap[status]
    },
    isShowIndexStatusFilter(status) {
      const statusMap = {
        '是': 'success',
        '否': 'danger'
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
        importance: '',
        goodsName: '',
        goodsSpecial: '',
        memberName: '',
        queryType: '0',
        score: '0',
        sort: '+admin_account'
      },
      importanceOptions: [{ label: '所有', key: '0' }, { label: '有图', key: '1' }, { label: '无图', key: '2' }],
      scoreType: [{ label: '所有', key: '0' }, { label: '等于', key: '1' }, { label: '大于等于', key: '2' }, { label: '小于', key: '3' }],
      scoreValue: [{ label: '所有', key: '0' }, { label: '1', key: '1' }, { label: '2', key: '2' }, { label: '3', key: '3' }, { label: '4', key: '4' }, { label: '5', key: '5' }],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      powerList: [],
      showReviewer: false,
      temp: {
        nick_name: '',
        is_delete: 0,
        IdArray: [],
        evaluate_id: 0,
        order_id: 0,
        goods_id: 0,
        special_id: 0,
        member_id: 0,
        score: 0,
        content: 0,
        image_list: [],
        media_list: [],
        had_video: 0,
        create_time: 0,
        ranch_content: '',
        repeat_time: 0,
        is_show: 0,
        is_show_goods: 0,
        show_goods_time: 0
      },
      specialTemp: {
        goods_name: '',
        special_name: '',
        goods_price: '',
        max_buy: '',
        is_offLine: 1
      },
      eInfo: {
        image_list: [],
        media_list: [],
        content: '',
        ranch_content: ''
      },
      dialogFormVisible: false,
      dialogForm2Visible: false,
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
      imgList: [],
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
        width: document.documentElement.clientWidth,
        // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          // 全屏按钮
          fullscreenToggle: true
        }
      }
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
      getEList(this.listQuery).then(response => {
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
        nick_name: '',
        is_delete: 0,
        IdArray: [],
        evaluate_id: 0,
        order_id: 0,
        goods_id: 0,
        special_id: 0,
        member_id: 0,
        score: 0,
        content: 0,
        image_list: [],
        media_list: [],
        had_video: 0,
        create_time: 0,
        ranch_content: '',
        repeat_time: 0,
        is_show: 0,
        is_show_goods: 0,
        show_goods_time: 0
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
      console.log(row)
      this.temp.evaluate_id = row.evaluate_id
      this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.temp.evaluate_id = row.evaluate_id
        deleteMnE(this.temp).then(() => {
          this.$notify({
            title: '删除评论',
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
      this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        this.temp.IdArray = this.multipleSelection
        deleteMnAllE(this.temp).then(() => {
          this.$notify({
            title: '删除评论',
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
        this.multipleSelection.push(item.evaluate_id)
      })
    },
    showGoodsView(row) {
      this.dialogFormVisible = true
      this.eInfo = row
      this.playerOptions.sources = row.media_list
    },
    showEInfo(row) {
      this.dialogForm2Visible = true
      this.eInfo = row
    },
    closeViewDialog() {
      this.dialogFormVisible = false
      this.imgList = []
    },
    closeView2Dialog() {
      this.dialogForm2Visible = false
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功',
        type: 'success',
        duration: 1500
      })
    },
    handleHidden(row, index, value, type) {
      this.temp = Object.assign({}, row)
      if (type === 1) {
        this.temp.is_show = value
      } else {
        this.temp.is_show_goods = value
      }
      this.temp.type = type
      console.log(this.temp)
      hiddenMn(this.temp).then(() => {
        this.list.splice(index, 1, this.temp)
        this.$notify({
          title: '设置评论',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
        if (type === 1) {
          if (this.temp.is_show === 1) {
            this.temp.is_show_str = '是'
          } else {
            this.temp.is_show_str = '否'
            this.temp.is_show_goods = 2
            this.temp.is_show_goods_str = '否'
          }
        } else {
          if (this.temp.is_show_goods === 1) {
            this.temp.is_show_goods_str = '是'
            this.temp.is_show_str = '是'
            this.temp.is_show = 1
          } else {
            this.temp.is_show_goods_str = '否'
          }
        }
      })
    },
    replyContentTxt(row) {
      this.temp = row
      console.log(this.temp)
      const index = this.list.findIndex(v => v.evaluate_id === this.temp.evaluate_id)
      replayE(this.temp).then(() => {
        this.list.splice(index, 1, this.temp)
        this.$notify({
          title: '回复评论',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
      this.dialogForm2Visible = false
    },
    canSelect1(v, row, index) {
      if (v === '是') {
        v = '否'
      } else {
        v = '是'
      }
      this.temp = row
      this.temp.is_show_goods_str = v
      this.list.splice(index, 1, this.temp)
    },
    canSelect2(v, row, index) {
      if (v === '是') {
        v = '否'
      } else {
        v = '是'
      }
      this.temp = row
      this.temp.is_show_str = v
      this.list.splice(index, 1, this.temp)
    },
    canSelect3(v, row, index) {
      if (v === '是') {
        v = '否'
      } else {
        v = '是'
      }
      this.temp = row
      this.temp.had_video_str = v
      this.list.splice(index, 1, this.temp)
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
  .el-carousel__container {
    height: 280px;
  }
</style>

