<template>
  <div class="app-container">
    <!-- <div class="filter-container">
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
        </el-form>
      </div>
    </div> -->
    <div id="myChart" :style="{width: '100%', height: '300px'}" />
  </div>
</template>

<script>
import { fetchList } from '@/api/resource'
import waves from '@/directive/waves' // waves directive
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/bar')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
// import { echarts } from '@echarts/lib/echarts'
// import { bar } from '@echarts/lib/bar'
// import { tooltip } from '@echarts/lib/component/tooltip'
// import { titles } from '@echarts/lib/component/title'
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
export default {
  name: 'ComplexTable',
  components: { },
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
      chart: null
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.initCharts()
  },
  methods: {
    initCharts() {
      this.chart = echarts.init(document.getElementById('myChart'))
      this.setOptions()
    },
    setOptions(chart) {
      this.chart.setOption({
        title: {
          text: '折线图堆叠'
        },
        tooltip: {
          trigger: 'axis'
        },
        // legend: {
        //   data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
        // },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
          }
        ]
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
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

