<template>
  <div class="content">
    <home-top
      :type="type"
      :list="list"
      :count="total"
      @on-change="onChange"
      @on-search="onSearch"
      @on-status="onStatus" />
    <home-list
      v-show="type === 'list'"
      :list="list"
      @on-options="options"/>
    <home-grid
      v-show="type === 'imgs'"
      :list="list"
      @on-options="options" />
    <home-pagination
      :total="total"
      :current="page"
      :pageSize="size"
      @on-change-number="pageChange"
      @on-change-size="sizeChange" />
  </div>
</template>

<script>
import homeTop from './template/top';
import homeList from './template/list';
import homeGrid from './template/grid';
import homePagination from './template/pagination';
import api from './api';

export default {
  name: 'Home',
  components: {
    homeTop,
    homeList,
    homeGrid,
    homePagination,
  },
  data() {
    return {
      page: 1, // 当前页
      size: 50, // 显示条数
      columns: [], // 列元素
      list: [], // 列表数据
      total: 0, // 文章总数
      title: '', // 标题搜索
      tagIdList: [], // 文章的分类id列表搜索
      statusList: this.$storage.get(`${window.configName}_status`) || [0, 1],
      type: this.$storage.get(`${window.configName}_type`) || 'list', // imgs 图文模式，list 列表模式
    };
  },
  computed: {
    listFilter() {
      return this.list.filter((one) => one.status);
    },
  },
  created() {
    this.getList();
  },
  methods: {
    async options(obj) {
      const info = { delete: '删除', publish: '发布', unshelve: '下架' };
      const articleId = obj.articleId;
      if (obj.type === 'edit') {
        this.$router.push(`/edit/${articleId}`);
      } else if (obj.type === 'putTop') {
        const res = await api.operation(obj.type, { articleId, top: obj.top });
        res && this.$notice_success({ minfo: obj.top === '1' ? '置顶成功' : '置尾成功' });
        this.getList();
      } else {
        this.$notice_confirm({
          minfo: `确认${info[obj.type]}该文章?`,
          func: async () => {
            const res = await api.operation(obj.type, { articleId });
            res && this.$message.success(res.msg);
            res && this.getList();
          },
        });
      }
    },
    async getList() {
      const res = await api.operation('queryList', {
        page: this.page,
        size: this.size,
        title: this.title,
        statusList: this.statusList,
        tagIdList: this.tagIdList,
      });
      if (res) {
        this.list = res.data.rows.map((one) => {
          one.top = one.top.toString();
          return one;
        });
        this.total = res.data.total;
      }
    },
    onChange(type) {
      this.type = type;
      this.$storage.set(`${window.configName}_type`, type);
    },
    onSearch(obj) {
      obj.type === 'title' && (this.title = obj.val);
      obj.type === 'tagIdList' && (this.tagIdList = obj.val);
      this.getList();
    },
    onStatus(list) {
      this.statusList = list;
      this.getList();
    },
    pageChange(num) {
      this.page = num;
      this.getList();
    },
    sizeChange(page, size) {
      this.page = page;
      this.size = size;
      this.getList();
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  flex: 1;
  padding: 50px;
  position: relative;
  background: #f8f8f8;
}
</style>
