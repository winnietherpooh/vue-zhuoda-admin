<template>
  <div class="chart-container">
    <div class="filter-container">
      <div class="box-card" style="background-color:#EFF2F4;padding:15px;height:72px;">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="统计条件" class="labelFontColor">
            <el-select v-model="listQuery.importanceOptions" style="width: 140px" class="filter-item" @change="changeSearchData">
              <el-option v-for="item in importanceOptions" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="图表样式" class="labelFontColor">
            <el-select v-model="echartsOption.chartType" style="width: 140px" class="filter-item" @change="changLineStyle">
              <el-option v-for="item in lineTypeOption" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
          </el-form-item> -->
          <el-form-item label="商品名称" class="labelFontColor">
            <el-select v-model="listQuery.GoodsId" style="width: 140px" class="filter-item" @change="changeGoodsData">
              <el-option key="0" label="未选择商品" value="0" />
              <el-option v-for="item in GoodsData" :key="item.goods_id" :label="item.goods_name" :value="item.goods_id" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="listQuery.GoodsId > 0 " label="规格名称" class="labelFontColor">
            <el-select v-model="listQuery.SpecialId" style="width: 140px" class="filter-item">
              <el-option key="0" label="未选择规格" value="0" />
              <el-option v-for="item in SpecialData" :key="item.special_id" :label="item.special_name" :value="item.special_id" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="线条样式" class="labelFontColor">
            <el-select v-model="echartsOption.lineStyleCicleData" style="width: 140px" class="filter-item" @change="changLineStyle">
              <el-option v-for="item in lineStyleCicle" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
          </el-form-item> -->
          <el-form-item v-if="dataType == 2" label="请选择年份" class="labelFontColor">
            <el-date-picker
              v-model="yearData"
              type="year"
              value-format="yyyy年"
              placeholder="请选择年份"
              @change="selectDate"
            />
          </el-form-item>
          <el-form-item v-if="dataType == 1" label="请选择月份" class="labelFontColor">
            <el-date-picker
              v-model="monthData"
              type="month"
              placeholder="请选择月份"
              value-format="yyyy-MM"
              @change="selectDate"
            />
          </el-form-item>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </el-form>
      </div>
    </div>
    <div :id="id" :class="className" :style="{height:height,width:width}" />
  </div>
</template>

<script>
import { getData, getGoodsData, getGoodsSpecialData } from '@/api/charts'
import echarts from 'echarts'
import waves from '@/directive/waves' // waves directive
import resize from './mixins/resize'

export default {
  directives: { waves },
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '700px'
    }
  },
  data() {
    return {
      chart: null,
      timeArr: [],
      dataArr: [],
      GoodsData: [],
      SpecialData: [],
      GoodsId: '',
      SpecialId: '',
      yearData: '',
      monthData: '',
      echartsOption: {
        lineStyleCicleData: false,
        chartType: 'line'
      },
      dataType: 1,
      importanceOptions: [{ label: '按月统计', key: '1' }, { label: '按年统计', key: '2' }],
      lineStyleCicle: [{ label: '折线', key: false }, { label: '曲线', key: true }],
      lineTypeOption: [{ label: '折线', key: 'line' }, { label: '柱状图', key: 'bar' }],
      listQuery: {
        dataType: undefined,
        yearData: undefined,
        monthData: undefined,
        GoodsId: undefined,
        SpecialId: undefined,
        importanceOptions: '1'
      }
    }
  },
  mounted() {
    this.initChart(this.echartsOption)
    this.getStaicData()
    this.getGoodsList()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getStaicData() {
      this.listLoading = true
      getData(this.listQuery).then(response => {
        this.timeArr = response.data.date
        this.dataArr = response.data.data
        this.chart.setOption({
          title: {
            text: '销售统计'
          },
          legend: {
            data: ['销量']
          },
          xAxis: {
            data: this.timeArr
          },
          yAxis: {},
          series: [{
            name: '销量',
            data: this.dataArr,
            stack: 'total',
            symbolSize: 10,
            symbol: 'circle',
            smooth: true,
            type: this.echartsOption.chartType,
            lineStyle: {
              width: 2
            },
            animation: true,
            animationDuration: 1000,
            animationEasing: 'linear',
            animationDurationUpdate: function(idx) {
              return idx * 10
            },
            itemStyle: {
              normal: {
                color: '#13C2C2',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? (p.value) : ''
                  }
                }
              }
            }
          }]
        })
        this.chart.hideLoading()
        this.monthData = response.data.searchData
        this.yearData = response.data.searchData
        this.listLoading = false
      })
    },
    getGoodsList() {
      this.listLoading = true
      getGoodsData(this.listQuery).then(response => {
        console.log(response.data)
        this.GoodsData = response.data
      })
    },
    setEchartsStyle(echartsOption) {
      this.chart.setOption({
        series: [{
          smooth: this.echartsOption.lineStyleCicleData,
          type: this.echartsOption.chartType
        }]
      })
    },
    initChart(echartsOption) {
      this.chart = echarts.init(document.getElementById(this.id))
      const xData = (function() {
        const data = []
        // for (let i = 1; i < 13; i++) {
        //   data.push(i + '月')
        // }
        return data
      }())
      this.chart.showLoading()
      this.chart.setOption({
        // backgroundColor: '#344b58',
        title: {
          text: '销量走势图',
          x: '20',
          top: '20',
          textStyle: {
            color: '#fff',
            fontSize: '22'
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16'
          }
        },
        toolbox: {
          show: true,
          feature: {
            dataView: {
              readOnly: false
            },
            magicType: {
              type: ['line', 'bar']
            },
            restore: {},
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,
          top: 150,
          bottom: 95,
          textStyle: {
            color: '#fff'
          }
        },
        // legend: {
        //   x: '5%',
        //   top: '10%',
        //   textStyle: {
        //     color: '#90979c'
        //   },
        //   data: ['female', 'male', 'average']
        // },
        calculable: false,
        xAxis: [{
          type: 'category',
          name: '时间',
          // nameRotate: 90,  名字旋转角度
          axisLine: {
            show: true,
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0
            // rotate: 270
          },
          data: xData
        }],
        yAxis: [{
          name: '销量',
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          }
        }],
        dataZoom: [{
          show: true,
          height: 30,
          xAxisIndex: [
            0
          ],
          bottom: 30,
          start: 0,
          end: 100,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: '#1890FF'
          },
          textStyle: {
            color: '#fff' },
          borderColor: '#90979c'

        }, {
          type: 'inside',
          show: true,
          height: 15,
          start: 1,
          end: 35
        }]
      })
    },
    changeSearchData() {
      this.dataType = this.listQuery.importanceOptions
      // if (this.dataType === 1) {
      //   this.startYear = ''
      //   this.endYear = ''
      // } else {
      //   this.monthRange = []
      // }
    },
    handleFilter() {
      this.getStaicData()
    },
    selectDate(v) {
      this.listQuery.yearData = this.yearData
      this.listQuery.monthData = this.monthData
    },
    changLineStyle() {
      this.setEchartsStyle()
    },
    changeGoodsData() {
      this.listLoading = true
      console.log(this.listQuery.GoodsId)
      if (this.listQuery.GoodsId > 0) {
        getGoodsSpecialData(this.listQuery).then(response => {
          console.log(response.data)
          this.SpecialData = response.data
        })
      }
    }
  }
}
</script>
