<template>
  <div class="content">
    <a-button
      type="primary"
      class="goback"
      @click="goback">返回上一页</a-button>
    <div class="abs form">
      <div class="title">
        <a-input
          placeholder="设置文章标题"
          v-model="params.title" />
      </div>
      <div class="tinymce">
        <editor
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
            @change="handleChange">
            <img
              alt="fileImg"
              class="fileCss"
              v-if="params.imageUrl"
              :src="params.imageUrl" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                选择图片
              </div>
            </div>
          </a-upload>
          <a-textarea
            v-model="params.desc"
            placeholder="导语，选填"
            :auto-size="{ minRows: 4, maxRows: 4 }"/>
        </div>
      </div>
      <div class="btn">
        <a-button
          type="primary"
          @click="save">保存</a-button>
        <a-button
          ghost
          type="primary">预览</a-button>
        <a-button
          ghost
          type="primary">发布</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import editor from '@tinymce/tinymce-vue';
import upload from '@/mixins/upload';
import api from '@/views/api';

export default {
  name: 'Edit',
  mixins: [upload],
  components: { editor },
  data() {
    return {
      loading: false,
      params: {
        id: null, // 文章id
        title: '', // 文章标题
        imageUrl: '', // 封面
        desc: '', // 导语
        content: '', // 内容
      },
      init: {
        language: 'zh_CN',
        // menubar: false, // 顶部菜单栏显示
        // plugins: [
        //   'advlist autolink lists link image charmap print preview anchor',
        //   'searchreplace visualblocks code fullscreen',
        //   'insertdatetime media table paste code help wordcount',
        // ],
        plugins: ['image', 'help'],
        toolbar: `undo redo | formatselect | bold italic backcolor |
          alignleft aligncenter alignright alignjustify |
          numlist outdent indent | image help`,
        images_upload_url: '/',
        images_upload_handler: this.images_upload_handler,
      },
    };
  },
  created() {
    const id = this.$route.params.id;
    if (id) {
      this.params.id = this.$route.params.id;
      this.getInfo();
    }
  },
  methods: {
    async getInfo() {
      const res = await api.info(this.params.id);
      this.params = Object.assign(this.params, res.data);
    },
    goback() {
      window.history.back(-1);
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
      if (!this.params.imageUrl) {
        this.$message.error('请上传封面');
        return;
      }
      const res = await api.createArticle(this.params);
      if (res) {
        this.params.id = res.data.id;
        this.$message.success(res.data.msg);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  position: relative;
  background: #f8f8f8;
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
      .ant-input {
        border: 0;
        padding: 50px;
        font-size: 36px;
        &:focus { border: none; box-shadow: none; }
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
      border-top: solid 1px #ddd;
      h3 { margin-bottom: 30px; color: #666; }
      .temp {
        display: flex;
        justify-content: space-between;
        .avatar-uploader {
          // width: 224px;
          width: auto;
          margin-right: 30px;
          .fileCss { width: 100%; }
        }
        .ant-input{ flex: 1; resize: none; }
      }
    }
    .btn {
      display: flex;
      padding: 50px;
      justify-content: flex-end;
      .ant-btn { margin-left: 40px; padding: 0 30Px; }
    }
  }
}
</style>
