<template>
  <div
    class="middle preview"
    v-show="previewIsShow">
    <h2>预览</h2>
    <div
      class="text"
      v-html="content"></div>
    <div class="btn">
      <a-button
        ghost
        type="primary"
        @click="preview">关闭</a-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Preview',
  props: ['content'],
  computed: {
    ...mapState(['previewIsShow']),
  },
  methods: {
    preview() {
      this.$store.commit('SET_PREVIEW', false);
    },
  },
};
</script>

<style lang="less" scoped>
.preview {
  z-index: 100;
  padding: 50px;
  display: flex;
  position: fixed;
  background: #fff;
  border-radius: 10px;
  flex-direction: column;
  width: 70%; height: 90%;
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
</style>
