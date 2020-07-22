<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container" label-width="150px">
      <div class="createPost-main-container">
        <el-form-item label="商品名称">
          <el-input v-model="postForm.goods_name" style="width:300px;" required />
        </el-form-item>
        <el-form-item label="虚拟销售数量基础">
          <el-input v-model="postForm.set_seal_nums" style="width:300px;" required />
        </el-form-item>
        <el-form-item label="上传轮播图">
          <el-upload
            class="avatar-uploader"
            action="https://up-z2.qiniup.com"
            :data="dataObj"
            :multiple="true"
            :show-file-list="false"
            :on-error="errorFun"
            :on-success="successFun"
            :before-upload="beforeUpload"
          >
            <img v-if="goods_img" :src="goods_img" class="avatar" required>
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item v-if="postForm.fileList.length > 0" label="图片预览" style="width:600px;">
          <el-carousel :interval="4000" type="card" height="150px">
            <el-carousel-item v-for="(item,i) in postForm.fileList" :key="i">
              <el-image style="width: 200px; height: 150px" :src="item" fit="fill" />
              <div class="closeDiv" @click="deleteImg(i)">
                <i class="el-icon-circle-close" style="font-size: 30px;color: #9a9a9a;" />
              </div>
            </el-carousel-item>
          </el-carousel>
        </el-form-item>
        <el-form-item label="商品状态">
          <el-radio-group v-model="postForm.is_offline" required @change="goodsIsOffLine">
            <el-radio :label="1" border>上线</el-radio>
            <el-radio :label="2" border>下线</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" required />
        </el-form-item>
        <el-form-item prop="content" style="margin-bottom: 30px;">
          <el-button type="success" @click="submitForm">发布商品</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { validURL } from '@/utils/validate'
import { createMn, getGoodsInfo } from '@/api/goods'
import { searchUser } from '@/api/remote-search'
import { getToken } from '@/api/qiniu'
import md5 from 'js-md5'

const defaultForm = {
  status: 'create',
  goods_name: '',
  content: '', // 文章内容
  is_offline: 0,
  goods_id: undefined,
  fileList: [],
  set_seal_nums: 0
}

export default {
  name: 'ArticleDetail',
  components: { Tinymce },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {},
      dataObj: { token: '', key: '' },
      goods_img: '',
      data: {
        fileName: '',
        fileSize: '',
        downUrl: '',
        Suffix: ''
      },
      Suffix: ['mp4', 'jpg', 'png', 'gif']
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return (+new Date(this.postForm.display_time))
      },
      set(val) {
        this.postForm.display_time = new Date(val)
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.goodsId
      this.fetchData(id)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      getGoodsInfo(id).then(response => {
        this.postForm.content = response.data.goods_explain
        this.postForm.fileList = response.data.goods_views
        this.postForm.goods_name = response.data.goods_name
        this.postForm.goods_id = response.data.goods_id
        this.postForm.is_offline = Number(response.data.is_offline)
        this.postForm.set_seal_nums = response.data.set_seal_nums
        this.postForm.status = 'edit'
        console.log(this.postForm)
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          createMn(this.postForm).then((response) => {
            // this.list.unshift(this.temp)
            this.loading = false
            if (this.postForm.status !== 'edit') {
              this.postForm = {}
              this.$notify({
                title: '新增成功',
                message: '新增商品',
                type: 'success',
                duration: 2000
              })
              this.postForm.fileList = []
              this.postForm.content = ''
              this.postForm.is_offline = 1
              this.postForm.goods_name = ''
            } else {
              this.$notify({
                title: '编辑成功',
                message: '编辑商品',
                type: 'success',
                duration: 2000
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'create'
    },
    getRemoteUserList(query) {
      searchUser(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
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
    successFun(response, file, fileList) {
      // this.goods_img = 'http://qdcm3dgyu.bkt.clouddn.com/' + response.key
      // this.postForm.goods_views_img = 'http://qdcm3dgyu.bkt.clouddn.com/' + response.key
      this.postForm.fileList.push('http://qdcm3dgyu.bkt.clouddn.com/' + response.key)
    },
    beforeUpload(file) {
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
          this.data.fileName = fileNames[0]
          const key = md5(file.name + new Date()) + '.' + this.data.Suffix
          this.data.downUrl = key
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
    goodsIsOffLine(value) {
      this.postForm.is_offline = value
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    deleteImg(index) {
      console.log(index)
      console.log(this.postForm.fileList)
      this.postForm.fileList.splice(index, 1)
      console.log(this.postForm.fileList)
    }
  }
}
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";
.labelFontColor .el-form-item__label{
  color: #343434;
}
.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
   .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 200px;
    height: 120px;
    flex-direction: column;
    justify-content: center;
    display: flex;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 200px;
    height: 120px;
    display: block;
  }
  .closeDiv{
    top: 10px;
    right: 75px;
    position: inherit;
    width: 30px;
    height: 30px;
    background: white;
    border-radius: 50%;
  }
</style>
