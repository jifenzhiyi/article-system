<template>
  <div class="home">
    <home-aside />
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
        @on-del="del"
        @on-edit="edit"
        @on-release="release" />
      <home-grid
        v-show="type === 'imgs'"
        :list="list"
        @on-del="del"
        @on-edit="edit"
        @on-release="release" />
      <home-pagination
        :total="total"
        :current="page"
        :pageSize="size"
        @on-change-number="pageChange"
        @on-change-size="sizeChange" />
    </div>
  </div>
</template>

<script>
import homeAside from './template/aside';
import homeTop from './template/top';
import homeList from './template/list';
import homeGrid from './template/grid';
import homePagination from './template/pagination';
import api from './api';

export default {
  name: 'Home',
  components: {
    homeAside,
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
    del(articleId) {
      this.$notice_confirm({
        minfo: '确认删除该文章?',
        func: async () => {
          const res = await api.deleteArticle({ articleId });
          if (res) {
            const index = this.list.findIndex((o) => o.articleId === articleId);
            this.list.splice(index, 1);
          }
        },
      });
    },
    edit(id) {
      this.$router.push(`/edit/${id}`);
    },
    async release(articleId) {
      this.$notice_confirm({
        minfo: '确认发布该文章?',
        func: async () => {
          const res = await api.publishArticle({ articleId });
          res && this.$message.success(res.msg);
          res && this.getList();
        },
      });
    },
    async getList() {
      const res = await api.list('api/articles/queryList', {
        page: this.page,
        size: this.size,
        title: this.title,
        statusList: this.statusList,
      });
      if (res) {
        this.list = res.data.rows;
        this.total = res.data.total;
      }
    },
    onChange(type) {
      this.type = type;
      this.$storage.set(`${window.configName}_type`, type);
    },
    onSearch(val) {
      this.title = val;
      this.getList();
    },
    onStatus(list) {
      this.statusList = list;
      this.getList();
    },
    // 分页跳转
    pageChange(num) {
      this.page = num;
      this.getList();
    },
    // 一页数量更新
    sizeChange(page, size) {
      this.page = page;
      this.size = size;
      this.getList();
    },
  },
};
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    flex: 1;
    padding: 50px;
    position: relative;
    background: #f8f8f8;
  }
}
</style>
