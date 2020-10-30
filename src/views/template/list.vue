<template>
<div class="abs wapper">
  <a-list
    item-layout="horizontal"
    :data-source="list">
    <a-list-item
      slot="renderItem"
      slot-scope="item">
      <img
        class="imgcss"
        :src="item.imageUrl" />
      <a-list-item-meta :description="item.desc">
        <a
          slot="title"
          href="javascript:void(0)">{{ item.title }}</a>
      </a-list-item-meta>
      <div class="time">更新于 {{ item.updatedAt.split('T')[0] }}</div>
      <a
        slot="actions"
        @click="del(item.id)">删除</a>
      <a
        slot="actions"
        @click="edit(item.id)">编辑</a>
      <a
        slot="actions"
        @click="release(item.id)">发布</a>
    </a-list-item>
  </a-list>
</div>
</template>

<script>
import edit from '@/mixins/edit';

export default {
  name: 'HomeList',
  props: ['list'],
  mixins: [edit],
};
</script>

<style lang="less" scoped>
.wapper {
  padding: 20px;
  overflow: auto;
  background: #fff;
  border-radius: 10px;
  border: solid 1px #ddd;
  top: 150px; left: 50px; right: 50px; bottom: 150px;
  .ant-list-item {
    .imgcss {
      height: 96px;
      padding-right: 50px;
    }
    .time {
      padding-left: 50px;
    }
  }
}
</style>
