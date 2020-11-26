<template>
  <div class="content">
    <div
      ref="form"
      class="abs form">
      <div class="title">
        <a-input
          placeholder="设置文章标题(最大字数64)"
          :maxLength="64"
          @focus="inputFocus('title')"
          @blur="inputBlur('title')"
          v-model="params.title" />
        <em v-show="focusArr.title">{{params.title.length}}/64</em>
      </div>
      <div class="title">
        <a-input
          placeholder="设置文章作者(最大字数8)"
          :maxLength="8"
          @focus="inputFocus('author')"
          @blur="inputBlur('author')"
          v-model="params.author" />
        <em v-show="focusArr.author">{{params.author.length}}/8</em>
      </div>
      <div class="tinymce">
        <editor
          ref="tinymce"
          api-key="u5kxoafuxshmhtkcz1kpkxq5ng5mqkywa8sxaaa0uwf9xwfh"
          v-model="params.content"
          :init="init" />
      </div>
      <div class="tags">
        <a-select
          mode="multiple"
          style="width: 100%"
          placeholder="添加标签"
          :filter-option="false"
          :value="params.tagIdList"
          @search="getTags"
          @change="selectChange">
          <a-spin
            size="small"
            v-if="fetching"
            slot="notFoundContent" />
          <a-select-option
            v-for="d in tagsArr"
            :key="d.tagId">
            {{ d.tagValue }}
          </a-select-option>
        </a-select>
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
              :src="params.mainImage"
              @error="imgError" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                选择图片
              </div>
            </div>
          </a-upload>
          <div class="textCss">
            <a-textarea
              v-model="params.briefIntro"
              placeholder="导语，选填 (最大字数120)"
              :maxLength="120"
              :auto-size="{ minRows: 3, maxRows: 3 }"/>
            <em>{{textareaNum}}/120</em>
          </div>
        </div>
      </div>
    </div>
    <preview-vue :content="params.content" />
    <div class="edit_btn">
      <span v-if="params.status === 1">「 文章已发布 」</span>
      <a-button
        type="primary"
        @click="save">保存</a-button>
      <a-button
        ghost
        type="primary"
        @click="preview()">预览</a-button>
      <a-button
        ghost
        type="primary"
        v-if="params.status !== 1 && params.articleId"
        @click="releaseNow(params.articleId)">发布</a-button>
      <a-button
        type="primary"
        @click="goback">返回上一页</a-button>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import editor from '@tinymce/tinymce-vue';
import upload from '@/mixins/upload';
import edit from '@/mixins/edit';
import api from '@/views/api';

export default {
  name: 'Edit',
  mixins: [upload, edit],
  components: { editor },
  computed: {
    textareaNum() {
      return this.params.briefIntro.length;
    },
  },
  data() {
    this.getTags = debounce(this.getTags, 800);
    return {
      tagsArr: [],
      fetching: false,
      loading: false,
      focusArr: {
        title: false,
        author: false,
      },
      params: {
        articleId: null, // 文章id
        title: '', // 文章标题
        author: '', // 文章作者
        mainImage: '', // 封面
        briefIntro: '', // 导语
        content: '', // 内容
        status: null, // 文章状态
        tagIdList: [], // 添加标签
      },
      init: {
        language: 'zh_CN',
        menubar: false, // 顶部菜单栏显示
        // plugins: [
        //   'advlist autolink lists link image charmap print preview anchor',
        //   'searchreplace visualblocks code fullscreen',
        //   'insertdatetime media table paste code help wordcount',
        // ],
        plugins: ['image', 'table', 'code'],
        toolbar: `undo redo | formatselect | bold italic |
          alignleft aligncenter alignright alignjustify |
          numlist outdent indent | image table code forecolor`,
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
    } else {
      this.getTags();
    }
  },
  methods: {
    imgError() {
      this.params.mainImage = '/null.png';
    },
    inputFocus(type) {
      this.focusArr[type] = true;
    },
    inputBlur(type) {
      this.focusArr[type] = false;
    },
    async getInfo() {
      const res = await api.operation('queryArticle', { articleId: this.params.articleId });
      this.params = Object.assign(this.params, res.data);
      this.params.tagIdList = res.data.tagList.map((one) => one.tagId);
      this.getTagsNew(this.params.tagIdList);
    },
    async getTags(tagValue) {
      this.fetching = true;
      const res = await api.tagOperate('queryList', { tagValue, page: 1, size: 5 });
      res && (this.tagsArr = res.data.rows);
      this.fetching = false;
    },
    async getTagsNew(tagIdList) {
      this.fetching = true;
      const res = await api.tagOperate('queryList', { tagIdList });
      res && (this.tagsArr = res.data.rows);
      this.fetching = false;
    },
    selectChange(val) {
      console.log('selectChange val', val);
      this.params.tagIdList = val;
    },
    goback() {
      window.history.back(-1);
    },
    async releaseNow() {
      this.$notice_confirm({
        minfo: '确认发布该文章?',
        func: async () => {
          const res = await api.operation('publish', { articleId: this.params.articleId });
          res && this.$message.success(res.msg);
          res && this.getInfo();
        },
      });
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
      !this.params.briefIntro && (this.params.briefIntro = '无');
      if (this.params.articleId) {
        // 编辑文章
        res = await api.operation('update', this.params);
      } else {
        // 新增文章
        res = await api.operation('save', this.params);
        res && (this.params.articleId = res.data.articleId);
      }
      res && this.$message.success(res.msg);
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  flex: 1;
  position: relative;
  background: #f8f8f8;
  .form {
    display: flex;
    overflow-y: auto;
    overflow-x: hidden;
    background: #fff;
    border-radius: 10px;
    flex-direction: column;
    box-shadow: 2px 6px 20px 0 rgba(0, 0, 0, 0.1);
    top: 100px; left: 15%; right: 15%; bottom: 150px;
    .title {
      height: 110px;
      display: flex;
      margin: 0 50px;
      position: relative;
      align-items: center;
      padding-right: 100px;
      border-bottom: dashed 1px #ccc;
      .ant-input {
        border: 0;
        padding: 50px;
        font-size: 36px;
        &:focus { box-shadow: none; }
      }
      em {
        right: 10px;
        color: #9a9a9a;
        font-style: normal;
        position: absolute;
      }
    }
    .tinymce {
      height: 1000px;
      display: flex;
      margin-bottom: 30px;
    }
    .tags {
      display: flex;
      margin: 0 50px;
      padding: 50px 0;
      border-top: dashed 1px #ddd;
    }
    .other {
      display: flex;
      margin: 0 50px;
      padding : 50px 0 130px;
      flex-direction: column;
      border-top: dashed 1px #ddd;
      h3 { margin-bottom: 30px; color: #666; }
      .temp {
        display: flex;
        position: relative;
        justify-content: space-between;
        .avatar-uploader {
          width: auto;
          margin-right: 20px;
          .fileCss { max-height: 150px; max-width: 367px;  }
        }
        .textCss {
          flex: 1;
          position: relative;
          border-radius: 5px;
          border: solid 1px #ccc;
          .ant-input {
            border: 0;
            resize: none;
            outline: none;
            box-shadow: none;
          }
          em {
            color: #9a9a9a;
            font-style: normal;
            position: absolute;
            bottom: 0; right: 10px;
          }
        }
      }
    }
  }
  .edit_btn {
    display: flex;
    position: fixed;
    padding: 30px 50px;
    background: #fff;
    align-items: center;
    justify-content: flex-end;
    border-top: solid 1px #ddd;
    bottom: 0; left: 0; right: 0;
    span {
      color: #f90;
      position: absolute;
      bottom: 40px; left: 40px;
    }
    .ant-btn { margin-left: 40px; padding: 0 30Px; }
  }
}
</style>
