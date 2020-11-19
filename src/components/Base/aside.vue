<template>
  <aside>
    <div
      class="one"
      v-for="item in navList"
      :key="item.name">
      <a-button
        type="primary"
        icon="plus"
        @click="add(item)">新建{{ item.name }}
      </a-button>
      <div
        :class="['label', navNow === item.name && 'now']"
        @click="navChange(item)">
        <a-icon type="unordered-list" />
        <span>{{ item.desc }}</span>
      </div>
    </div>
    <div
      v-show="ishow"
      class="tag_add middle">
      <a-icon
        type="close"
        class="close"
        @click="popshow" />
      <h3>新增标签</h3>
      <a-input
        v-model="tag"
        :maxLength="12"
        @pressEnter="save"></a-input>
      <div class="btn">
        <a-button
          type="primary"
          @click="save">提交</a-button>
      </div>
    </div>
  </aside>
</template>

<script>
import api from '@/views/api';

export default {
  name: 'HomeAside',
  data() {
    return {
      tag: '',
      ishow: false,
      navNow: '文章',
      navList: [
        { name: '文章', url: '/home', desc: '文章列表' },
        { name: '标签', url: '/tags', desc: '标签详情' },
      ],
    };
  },
  methods: {
    popshow() {
      this.ishow = !this.ishow;
    },
    navChange(item) {
      this.navNow = item.name;
      item.url !== this.$route.path && this.$router.push(item.url);
    },
    add(item) {
      item.name === '文章' ? this.$router.push('/edit') : this.popshow();
    },
    async save() {
      const res = await api.tagOperate('addTags', { tagValueList: [this.tag] });
      res && this.$store.commit('SET_TAG_CHANGE');
      res && this.$message.success(res.msg);
      res && this.popshow();
      this.tag = '';
    },
  },
};
</script>

<style lang="less" scoped>
aside {
  width: 340px;
  height: 100%;
  border-right: solid 1px #ddd;
  .one {
    width: 100%;
    display: flex;
    padding-top: 30px;
    align-items: center;
    flex-direction: column;
    .label {
      width: 100%;
      height: 80px;
      display: flex;
      cursor: pointer;
      margin-top: 30px;
      align-items: center;
      justify-content: center;
      border: dashed 1px #ddd;
      &.now { background: #ddd; }
      .anticon { font-size: 44px; }
      span { margin-left: 20px; font-weight: bold; }
    }
  }
  .tag_add {
    z-index: 100;
    position: fixed;
    border-radius: 8px;
    background: #fff;
    padding: 50px 100px;
    border: solid 2px #ddd;
    .close {
      padding: 20px;
      cursor: pointer;
      position: absolute;
      top: 20px; right: 20px;
    }
    .btn {
      display: flex;
      padding-top: 20px;
      justify-content: flex-end;
    }
  }
}
</style>
