<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">
      upload
    </el-button>
    <el-dialog :visible.sync="dialogVisible">
      <el-upload
        :multiple="true"
        :data="dataObj"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        action="https://up-z2.qiniup.com"
        list-type="picture-card"
      >
        <el-button size="small" type="primary">
          Click upload
        </el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">
        Cancel
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        Confirm
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/api/qiniu'
import { createResource } from '@/api/resource'
import md5 from 'js-md5'
export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      dataObj: { token: '', key: '' },
      dialogVisible: false,
      listObj: {},
      fileList: {},
      data: {
        fileName: '',
        fileSize: '',
        downUrl: '',
        Suffix: ''
      },
      Suffix: ['mp4', 'jpg', 'png', 'gif']
    }
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('Please wait for all images to be uploaded successfully. If there is a network problem, please refresh the page and upload again!')
        return
      }
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = {}
      this.dialogVisible = false
    },
    handleSuccess(response, file) {
      console.log(response)
      this.data.fileName = file.name
      this.data.fileSize = file.size
      var strArr = file.name.split('.')
      var arrLen = strArr.length
      this.data.Suffix = strArr[arrLen - 1]
      var fileNames = file.name.split('.' + this.data.Suffix)
      this.data.fileName = fileNames[0]
      this.data.downUrl = response.key
      createResource(this.data).then((response) => {
        this.$notify({
          title: '上传成功!',
          message: '资源上传',
          type: 'success',
          duration: 2000
        })
      })
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      console.log(response)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = 'http://qdcm3dgyu.bkt.clouddn.com/' + response.key
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    beforeUpload(file) {
      const _self = this
      return new Promise((resolve, reject) => {
        getToken().then(response => {
          _self.data.fileName = file.name
          _self.data.fileSize = file.size
          var strArr = file.name.split('.')
          var arrLen = strArr.length
          this.data.Suffix = strArr[arrLen - 1]
          var fileNames = file.name.split('.' + this.data.Suffix)
          _self.data.fileName = fileNames[0]
          const key = md5(file.name + new Date()) + '.' + this.data.Suffix
          _self.data.downUrl = key
          const token = response.data.token
          _self._data.dataObj.token = token
          _self._data.dataObj.key = key
          _self.fileList[uid] = 'http://qdcm3dgyu.bkt.clouddn.com/' + key
          const img = new Image()
          const uid = file.uid
          const _URL = window.URL || window.webkitURL
          this.listObj[uid] = {}
          img.src = _URL.createObjectURL(file)
          img.onload = function() {
            _self.listObj[uid] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
          }
          resolve(true)
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  ::v-deep .el-upload--picture-card {
    width: 100%;
  }
}
</style>
