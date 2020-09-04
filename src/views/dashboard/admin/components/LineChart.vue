<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { getEchartsData } from '@/api/index'
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null,
      echartData: {
        data: [],
        date: []
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
      this.getList()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.echartData)
    },
    getList() {
      getEchartsData().then(response => {
        this.echartData.data = response.data.echarts.data
        this.echartData.date = response.data.echarts.date
        // this.chart.setOption({
        //   xAxis: {
        //     type: 'category',
        //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        //   },
        //   yAxis: {},
        //   series: [{
        //     data: [820, 932, 901, 934, 1290, 1330, 1320],
        //     type: 'line'
        //   }]
        // })
        this.chart.setOption({
          xAxis: {
            data: this.echartData.date
          },
          yAxis: {
            data: this.echartData.data
          },
          series: [{
            name: '七日销售量',
            smooth: true,
            type: 'line',
            lineStyle: {
              width: 2
            },
            animation: true,
            data: this.echartData.data,
            animationDuration: 1000,
            animationEasing: 'linear'
          }]
        })
      })
    },
    setOptions(echartData) {
      this.chart.setOption({
        xAxis: {
          // type: 'category',
          data: [],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['七日销售量']
        }
      })
    }
  }
}
</script>
