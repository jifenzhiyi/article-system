<template>
  <div class="content">
    <h3>标签详情</h3>
    <div class="list">
      <a-tag
        closable
        color="red"
        class="one"
        v-for="item in list"
        :key="item.tagId"
        @close="e => close(e, item.tagId)">{{ item.tagValue }}</a-tag>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/views/api';

export default {
  name: 'Tags',
  computed: {
    ...mapState(['tagAdd']),
  },
  watch: {
    tagAdd() {
      this.getList();
    },
  },
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      const res = await api.tagOperate('queryList', { all: 1 });
      this.list = res.data;
    },
    async close(e, tagId) {
      e.preventDefault();
      const res = await api.tagOperate('deleteTags', { tagIdList: [tagId] });
      res && this.$message.success(res.msg);
      res && this.getList();
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  flex: 1;
  padding: 50px;
  background: #f8f8f8;
  .list {
    padding: 50px 50px 30px;
    border-radius: 8px;
    background: #fff;
    border: solid 1px #ddd;
    .one {
      font-size: 32px;
      padding: 10px 20px;
      margin-bottom: 20px;
    }
  }
}
</style>
