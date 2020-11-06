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
        :src="item.mainImage" />
      <a-list-item-meta :description="item.briefIntro">
        <a
          slot="title"
          href="javascript:void(0)">{{ item.title }}</a>
      </a-list-item-meta>
      <div class="status">{{ item.status === 1 ? '已发布' : '未发布' }}</div>
      <div class="time">更新于 {{ item.updateTime }}</div>
      <div class="btn">
        <a @click="del(item.articleId)">删除</a>
        <a @click="edit(item.articleId)">编辑</a>
        <a
          v-if="item.status === 0"
          @click="release(item.articleId)">发布</a>
      </div>
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
    .btn {
      display: flex;
      width: 320px;
      padding-left: 60px;
      justify-content: space-around;
    }
  }
}
</style>
