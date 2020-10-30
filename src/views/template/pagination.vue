<template>
  <div class="abs list_pagination">
    <a-pagination
      size="small"
      show-size-changer
      show-quick-jumper
      :total="total"
      :page-size="pageSize"
      :show-total="total => `共${total}条`"
      :page-size-options="pageSizeOptions"
      @change="onChange"
      @showSizeChange="onShowSizeChange" />
  </div>
</template>

<script>
export default {
  name: 'HomePagination',
  props: ['total', 'pageSize'],
  data() {
    return {
      pageSizeOptions: ['10', '20', '50', '100'],
    };
  },
  methods: {
    onChange(pageNumber) {
      this.$emit('on-change-number', pageNumber);
    },
    onShowSizeChange(current, pageSize) {
      this.$emit('on-change-size', current, pageSize);
    },
  },
};
</script>

<style lang="less" scoped>
.list_pagination {
  bottom: 50px; left: 50px; right: 50px;
  text-align: center;
}
</style>
