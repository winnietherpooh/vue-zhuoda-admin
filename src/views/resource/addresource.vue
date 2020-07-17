<template>
  <div style="text-align: center;margin-top:50px">
    <el-alert title="只允许上传 MP4, jpg, png, gif 格式" type="success" />
    <el-alert title="必须带文件后缀,例如:必须是xxx.jpg, 而不能是 xxx" type="success" />
    <el-alert title="每次只允许上传一个文件,但可以多次上传" type="success" />
    <el-alert title="拖入文件,即可完成上传,可在资源列表中查看上传后的文件详情" type="success" />
    <el-divider content-position="left" />
    <el-upload
      :data="dataObj"
      :multiple="true"
      :limit="1"
      :on-exceed="tooManyFilesError"
      :show-file-list="true"
      :on-error="errorFun"
      :on-success="successFun"
      :before-upload="beforeUpload"
      action="https://up-z0.qiniup.com"
      drag
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">
        将文件拖到此处，或<em>点击上传</em>
      </div>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/api/qiniu'
import md5 from 'js-md5'
import { createResource } from '@/api/resource'
export default {
  data() {
    return {
      dataObj: { token: '', key: '' },
      image_uri: [],
      fileList: [],
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
    beforeUpload(file) {
      console.log(file)
      const _self = this
      return new Promise((resolve, reject) => {
        getToken().then(response => {
          this.data.fileName = file.name
          this.data.fileSize = file.size
          var strArr = file.name.split('.')
          var arrLen = strArr.length
          this.data.Suffix = strArr[arrLen - 1]
          var isCanUp = false
          for (var i = 0; i < this.Suffix.length; i++) {
            if (this.Suffix[i] === this.data.Suffix) {
              isCanUp = true
            }
          }
          if (isCanUp === false) {
            reject(false)
            this.$notify({
              title: '不允许上传此格式',
              message: '资源上传',
              type: 'error',
              duration: 2000
            })
          }
          var fileNames = file.name.split('.' + this.data.Suffix)
          console.log(fileNames)
          this.data.fileName = fileNames[0]
          const key = md5(file.name + response.data.key) + '.' + this.data.Suffix
          this.data.downUrl = key
          console.log(this.data)
          const token = response.data.token
          _self._data.dataObj.token = token
          _self._data.dataObj.key = key
          resolve(true)
        }).catch(err => {
          console.log(err)
          reject(false)
        })
      })
    },
    successFun(response, file, fileList) {
      createResource(this.data).then((response) => {
        this.$notify({
          title: '上传成功!',
          message: '资源上传',
          type: 'success',
          duration: 2000
        })
      })
    },
    errorFun(err, file, fileList) {
      console.log(err.message)
      this.$notify({
        title: '上传错误',
        message: '资源上传',
        type: 'error',
        duration: 2000
      })
    },
    tooManyFilesError(files, fileList) {
      this.$notify({
        title: '请一个一个上传',
        message: '资源上传',
        type: 'error',
        duration: 2000
      })
    }
  }
}
</script>
