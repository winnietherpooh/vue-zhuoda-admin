<template>
  <div class="chart-container">
    <chart height="100%" width="100%" />
  </div>
</template>

<script>
import Chart from '@/components/Charts/MixChart'

export default {
  name: 'MixChart',
  components: { Chart },
  mounted() {
    this.setEchartsStyle()
  },
  methods: {
    setEchartsStyle() {
      this.chart.setOption({
        series: [{
          smooth: true
        }]
      })
    }
  }
}

</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>

