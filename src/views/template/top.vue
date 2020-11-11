<template>
  <div class="abs top">
    <div class="title">图文素材（共 {{count}} 条）</div>
    <div class="filter">
      <span @click="menuShow">{{ title }} <a-icon type="down" /></span>
      <a-menu
        class="menu"
        v-show="isShow">
        <a-menu-item
          v-for="(item, index) in options"
          :key="index">
          <a-checkbox
            :checked="item.isSelect"
            @change="e => onChange(e, item)">{{ item.label }}</a-checkbox>
        </a-menu-item>
      </a-menu>
    </div>
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
  props: ['type', 'count', 'list'],
  watch: {
    statusList: {
      immediate: true,
      handler() {
        this.statusList.length === 2 && (this.title = '全部');
        if (this.statusList.length === 1) {
          this.statusList[0] === 0 ? this.title = '未发布' : this.title = '已发布';
          this.statusList[0] === 0
            ? this.options[1].isSelect = false
            : this.options[0].isSelect = false;
        }
      },
    },
  },
  data() {
    return {
      isShow: false,
      text: '',
      title: '全部',
      options: [
        { value: 0, label: '未发布', isSelect: true },
        { value: 1, label: '已发布', isSelect: true },
      ],
      statusList: this.$storage.get(`${window.configName}_status`) || [0, 1],
    };
  },
  methods: {
    menuShow() {
      this.isShow = !this.isShow;
    },
    onChange(e, item) {
      if (item.isSelect && this.statusList.length === 1) {
        this.$message.warn('最少选中一个状态');
        return;
      }
      item.isSelect = !item.isSelect;
      const index = this.statusList.findIndex((o) => o === item.value);
      item.isSelect ? this.statusList.push(item.value) : this.statusList.splice(index, 1);
      this.$storage.set(`${window.configName}_status`, this.statusList);
      this.$emit('on-status', this.statusList);
    },
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
  .title { width: 320px; }
  .switch {
    flex: 1;
    .anticon {
      cursor: pointer;
      padding-left: 20px;
      &.now { color: red; }
    }
  }
  .filter {
    position: relative;
    margin-right: 10px;
    span {
      width: 160px;
      height: 56px;
      display: flex;
      cursor: pointer;
      font-size: 28px;
      padding-top: 5px;
      align-items: center;
      border-radius: 10px;
      justify-content: center;
      border: dashed 1px #999;
      .anticon { font-size: 24px; padding-left: 10px; }
    }
    .menu {
      z-index: 10;
      position: absolute;
      top: 70px; right: 0;
      border: solid 1px #ccc;
    }
  }
}
</style>
