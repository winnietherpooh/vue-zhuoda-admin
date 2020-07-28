<template>
  <div class="app-container">
    <div class="filter-container">
      <el-tree
        ref="tree"
        :data="treeData"
        show-checkbox
        :default-expand-all="false"
        node-key="area_id"
        highlight-current
        :render-after-expand="true"
        :props="defaultProps"
        :lazy="true"
        :load="loadNode"
        @check="checkTreeCheckBox"
      />
      <div class="buttons" style="margin-top:20px;">
        <el-button @click="selectAll">设置所有城市</el-button>
        <el-button type="warning" :disabled="setPostAgeButton" @click="selectNone">清空</el-button>
        <el-button type="success" :disabled="setPostAgeButton" @click="updateSelectNode">设置运费</el-button>
      </div>
    </div>
    <el-dialog :visible.sync="addSpecialDialog">
      <el-form ref="specialDataForm" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="运费价格">
          <el-input v-model="temp.money" type="number" style="width:300px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addSpecialDialog = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateSpecialData">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCityData, setCityPostAgeData } from '@/api/goods'
import waves from '@/directive/waves' // waves directive
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive

export default {
  name: 'ComplexTable',
  directives: { waves, clipboard },
  data() {
    return {
      defaultProps: {
        children: 'a',
        label: 'name'
      },
      treeData: [],
      listQuery: {
        parentId: 0
      },
      temp: {
        money: 0.00,
        selectedNode: [],
        isAll: false
      },
      ranchSelectList: [],
      ranchSelected: 0,
      ranchSelectedName: 'fdsfds',
      addSpecialDialog: false,
      setPostAgeButton: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.treeData = []
      getCityData(this.listQuery).then(response => {
        this.treeData = response.data
        console.log(this.treeData)
      })
    },
    resetTemp() {
      this.temp.selectedNode = []
      this.temp.money = 0
    },
    loadNode(node, resolve) {
      if (node.key > 0) {
        this.listQuery.parentId = node.key
        getCityData(this.listQuery).then(response => {
          resolve(response.data)
        })
      }
    },
    selectAll(node) {
      this.resetTemp()
      this.addSpecialDialog = true
      this.temp.isAll = true
    },
    selectNone(node) {
      console.log(this.$refs.tree)
      this.$refs.tree.setCheckedNodes([])
      this.setPostAgeButton = true
    },
    updateSelectNode() {
      this.resetTemp()
      var selecteNode = this.$refs.tree.getCheckedNodes()
      if (selecteNode.length > 0) {
        this.addSpecialDialog = true
      }
    },
    updateSpecialData() {
      console.log(this.temp)
      if (this.temp.isAll !== true) {
        this.temp.isAll = 0
        this.temp.selectedNode = this.$refs.tree.getCheckedKeys()
      } else {
        this.temp.isAll = 1
        this.temp.selectedNode = []
      }
      setCityPostAgeData(this.temp).then(() => {
        this.$notify({
          title: '操作成功',
          message: '修改运费',
          type: 'success',
          duration: 2000
        })
        this.addSpecialDialog = false
        this.getList()
      })
    },
    checkTreeCheckBox(a, b) {
      if (this.$refs.tree.getCheckedNodes().length > 0) {
        this.setPostAgeButton = false
      } else {
        this.setPostAgeButton = true
      }
    }
  }
}
</script>
<style>
  .labelFontColor .el-form-item__label{
    color: #343434;
  }
</style>

