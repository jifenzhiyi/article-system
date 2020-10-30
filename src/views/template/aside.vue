<template>
  <aside>
    <a-button
      type="primary"
      icon="plus"
      @click="add">新建文章
    </a-button>
    <div class="label">
      <a-icon type="unordered-list" />
      <span>文章列表</span>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'HomeAside',
  methods: {
    add() {
      this.$router.push('/edit');
    },
  },
};
</script>

<style lang="less" scoped>
aside {
  width: 340px;
  height: 100%;
  display: flex;
  padding: 30px 0;
  align-items: center;
  flex-direction: column;
  border-right: solid 1px #ddd;
  .label {
    width: 100%;
    height: 80px;
    display: flex;
    margin-top: 30px;
    background: #ccc;
    align-items: center;
    justify-content: center;
    .anticon { font-size: 44px; }
    span { margin-left: 20px; font-weight: bold; }
  }
}
</style>
