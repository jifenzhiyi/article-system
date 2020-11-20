<template>
  <div class="content">
    <h3>标签详情</h3>
    <div class="list">
      <a-tag
        closable
        class="one"
        v-for="item in list"
        :key="item.tagId"
        :color="item.isSelect ? 'red' : 'blue'"
        @close="e => close(e, item.tagId)"
        @dblclick="select(item)">{{ item.tagValue }}</a-tag>
      <p>备注：双击选择是否首页显示(<span class="s1">红色</span>为新闻页展示标签，<span class="s2">蓝色</span>不展示)</p>
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
    async select(item) {
      item.isSelect = !item.isSelect;
      const res = await api.tagOperate('updateTags', {
        tagId: item.tagId,
        tagShow: item.isSelect ? 1 : 0,
      });
      res && this.$message.success(res.msg);
      res && this.getList();
    },
    async getList() {
      const res = await api.tagOperate('queryList', { all: 1 });
      this.list = res.data.map((one) => {
        one.isSelect = one.tagShow === 1;
        return one;
      });
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
      margin-right: 30px;
      margin-bottom: 30px;
    }
    p span {
      &.s1 {color: #f5222d; }
      &.s2 {color: #1890ff; }
    }
  }
}
</style>
