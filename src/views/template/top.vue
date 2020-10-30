<template>
  <div class="abs top">
    <div class="title">图文素材（共 {{count}} 条）</div>
    <div class="switch">
      <a-tooltip>
        <template slot="title">图文显示</template>
        <a-icon
          type="appstore"
          :class="type === 'imgs' && 'now'"
          @click="typeChange('imgs')" />
      </a-tooltip>
      <a-tooltip>
        <template slot="title">列表显示</template>
        <a-icon
          type="menu"
          :class="type === 'list' && 'now'"
          @click="typeChange('list')" />
      </a-tooltip>
    </div>
    <div class="search">
      <a-input-search
        v-model="text"
        placeholder="根据文章标题搜索"
        style="width: 200px"
        @search="onSearch" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeTop',
  props: ['type', 'count'],
  data() {
    return {
      text: '',
    };
  },
  methods: {
    typeChange(type) {
      this.$emit('on-change', type);
    },
    onSearch() {
      this.$emit('on-search', this.text);
    },
  },
};
</script>

<style lang="less" scoped>
.top {
  top: 50p;
  left: 50px;
  right: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .switch {
    flex: 1;
    .anticon {
      cursor: pointer;
      padding-left: 10px;
      &.now { color: red; }
    }
  }
}
</style>
