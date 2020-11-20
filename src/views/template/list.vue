<template>
  <div class="abs wapper">
    <a-list
      item-layout="horizontal"
      :data-source="list">
      <a-list-item
        slot="renderItem"
        slot-scope="item">
        <div class="img_s">
          <base-image
            config="h_default"
            :src="item.mainImage" />
        </div>
        <a-list-item-meta :description="item.briefIntro">
          <a
            slot="title"
            class="title"
            href="javascript:void(0)"
            @click="preview(item.articleId)">{{ item.title }}</a>
        </a-list-item-meta>
        <div class="status">
          <span v-if="item.status === 0">未发布</span>
          <div
            v-if="item.status === 1 && item.top === '10'"
            class="btn_list">
            <a-button
              ghost
              type="primary"
              @click="radioChange('1', item)">置顶</a-button>
            <a-button
              ghost
              type="primary"
              @click="radioChange('99', item)">置尾</a-button>
          </div>
          <span
            class="now"
            v-if="item.status === 1 && item.top !== '10'">
            {{ item.top === '1' ? '已置顶' : '已置尾' }}
          </span>
        </div>
        <div class="time">更新于{{ item.updateTime }}</div>
        <div class="btn">
          <a @click="options('delete', item.articleId)">删除</a>
          <a @click="options('edit', item.articleId)">编辑</a>
          <a
            v-if="item.status === 0"
            @click="options('publish', item.articleId)">发布</a>
          <a
            v-if="item.status === 1"
            @click="options('unshelve', item.articleId)">下架</a>
        </div>
      </a-list-item>
    </a-list>
    <preview-vue :content="content" />
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
    min-height: 200px;
    .img_s {
      width: 400px;
      overflow: hidden;
      margin-right: 30px;
      text-align: center;
      border: solid 1px #ddd;
    }
    .title { font-size: 32px; }
    .title:hover { color: #f00; }
    .ant-list-item-meta-content {
      flex: 1;
      overflow: hidden;
      .ant-list-item-meta-description {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }
    .status {
      width: 200px;
      font-size: 30px;
      font-weight: bold;
      text-align: center;
      span.now {
        color: #f02645;
      }
      .btn_list {
        display: flex;
        height: 200px;
        align-items: center;
        flex-direction: column;
        justify-content: space-around;
        .ant-btn {
          width: 150px;
        }
      }
    }
    .time { padding-left: 10px; width: 400px; overflow: hidden; white-space: nowrap; }
    .btn {
      width: 320px;
      display: flex;
      padding-left: 50px;
      a { padding-right: 30px; }
    }
  }
}
</style>
