<template>
  <div class="content">
    <a-button
      type="primary"
      class="goback"
      @click="goback">返回上一页</a-button>
    <div class="abs form">
      <div class="title">
        <span>文章标题：</span>
        <a-input
          placeholder="设置文章标题"
          v-model="params.title" />
      </div>
      <div class="title">
        <span>文章作者：</span>
        <a-input
          placeholder="设置文章作者"
          v-model="params.author" />
      </div>
      <div class="tinymce">
        <editor
          ref="tinymce"
          api-key="u5kxoafuxshmhtkcz1kpkxq5ng5mqkywa8sxaaa0uwf9xwfh"
          v-model="params.content"
          :init="init" />
      </div>
      <div class="other">
        <h3>封面图片和导语</h3>
        <div class="temp">
          <a-upload
            name="file"
            action="api/uploadfile"
            list-type="picture-card"
            class="avatar-uploader"
            :multiple="true"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            @change="handleChange('test')">
            <img
              alt="fileImg"
              class="fileCss"
              v-if="params.mainImage"
              :src="params.mainImage" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                选择图片
              </div>
            </div>
          </a-upload>
          <a-textarea
            v-model="params.briefIntro"
            placeholder="导语，选填"
            :auto-size="{ minRows: 4, maxRows: 4 }"/>
        </div>
      </div>
      <div class="btn">
        <span v-if="params.status === 1">「 文章已发布 」</span>
        <a-button
          type="primary"
          @click="save">保存</a-button>
        <a-button
          ghost
          type="primary"
          @click="preview">预览</a-button>
        <a-button
          ghost
          type="primary"
          v-if="params.status !== 1 && params.articleId"
          @click="release(params.articleId)">发布</a-button>
      </div>
    </div>
    <div
      class="middle preview"
      v-show="previewIsShow">
      <h2>预览</h2>
      <div
        class="text"
        v-html="params.content"></div>
      <div class="btn">
        <a-button
          ghost
          type="primary"
          @click="previewIsShow = false">关闭</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import editor from '@tinymce/tinymce-vue';
import upload from '@/mixins/upload';
import edit from '@/mixins/edit';
import api from '@/views/api';

export default {
  name: 'Edit',
  mixins: [upload, edit],
  components: { editor },
  data() {
    return {
      loading: false,
      previewIsShow: false,
      params: {
        articleId: null, // 文章id
        title: '', // 文章标题
        author: '', // 文章作者
        mainImage: '', // 封面
        briefIntro: '', // 导语
        content: '', // 内容
        status: null, // 文章状态
      },
      init: {
        language: 'zh_CN',
        // menubar: false, // 顶部菜单栏显示
        // plugins: [
        //   'advlist autolink lists link image charmap print preview anchor',
        //   'searchreplace visualblocks code fullscreen',
        //   'insertdatetime media table paste code help wordcount',
        // ],
        plugins: ['image'],
        toolbar: `undo redo | formatselect | bold italic |
          alignleft aligncenter alignright alignjustify |
          numlist outdent indent | image`,
        images_upload_url: '/',
        images_upload_handler: this.images_upload_handler,
      },
    };
  },
  created() {
    const id = this.$route.params.id;
    if (id) {
      this.params.articleId = this.$route.params.id;
      this.getInfo();
    }
  },
  methods: {
    async getInfo() {
      const res = await api.info({ articleId: this.params.articleId });
      this.params = Object.assign(this.params, res.data);
    },
    goback() {
      window.history.back(-1);
    },
    preview() {
      this.previewIsShow = true;
    },
    async save() {
      if (!this.params.title) {
        this.$message.error('请输入标题');
        return;
      }
      if (!this.params.content) {
        this.$message.error('请输入内容');
        return;
      }
      if (!this.params.mainImage) {
        this.$message.error('请上传封面');
        return;
      }
      let res = null;
      if (this.params.articleId) {
        // 编辑文章
        res = await api.updateArticle(this.params);
        console.log('res', res);
      } else {
        // 新增文章
        res = await api.createArticle(this.params);
        res && (this.params.articleId = res.data.articleId);
      }
      res && this.$message.success(res.msg);
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  position: relative;
  background: #f8f8f8;
  .preview {
    z-index: 100;
    padding: 50px;
    display: flex;
    position: absolute;
    background: #fff;
    border-radius: 10px;
    flex-direction: column;
    width: 70%; height: 80%;
    border: solid 2px #000;
    .text {
      flex: 1;
      padding: 20px 30px;
      overflow-y: auto;
      overflow-x: hidden;
      margin-bottom: 50px;
      border: dashed 1px #ccc;
    }
    .btn { text-align: right; }
  }
  .goback {
    position: absolute;
    bottom: 50px; right: 50px;
  }
  .form {
    display: flex;
    background: #fff;
    border-radius: 10px;
    flex-direction: column;
    box-shadow: 2px 6px 20px 0 rgba(0, 0, 0, 0.1);
    top: 20px; left: 20%; right: 20%; bottom: 40px;
    .title {
      height: 110px;
      display: flex;
      align-items: center;
      span {
        width: 300px;
        color: #000;
        font-size: 36px;
        font-weight: bold;
        text-align: right;
      }
      .ant-input {
        border: 0;
        padding: 50px;
        margin-right: 50px;
        font-size: 36px;
        border-bottom: dashed 1px #ccc;
        &:focus { box-shadow: none; }
      }
    }
    .tinymce {
      flex: 1;
      display: flex;
      margin-bottom: 30px;
    }
    .other {
      display: flex;
      margin: 0 50px;
      padding-top : 50px;
      flex-direction: column;
      border-top: dashed 1px #ddd;
      h3 { margin-bottom: 30px; color: #666; }
      .temp {
        display: flex;
        justify-content: space-between;
        .avatar-uploader {
          // width: 224px;
          width: auto;
          margin-right: 30px;
          .fileCss { max-height: 150px; max-width: 367px;  }
        }
        .ant-input{ flex: 1; resize: none; }
      }
    }
    .btn {
      display: flex;
      padding: 50px;
      position: relative;
      justify-content: flex-end;
      span {
        color: #f90;
        position: absolute;
        bottom: 50px; left: 40px;
      }
      .ant-btn { margin-left: 40px; padding: 0 30Px; }
    }
  }
}
</style>
