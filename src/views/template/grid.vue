<template>
  <div class="abs wapper">
    <a-list
      :grid="{ gutter: 16, column: 4 }"
      :data-source="list">
      <a-list-item
        class="listItem"
        slot="renderItem"
        slot-scope="item">
        <div
          class="imgcss"
          :style="`background: url(${item.mainImage}) center no-repeat;`">
        </div>
        <h4
          class="ellipsis"
          @click="preview(item.articleId)">{{ item.title }}
          <span :class="item.status === 1 && 'now'">
            「 {{ item.status === 1 ? '已发布' : '未发布' }} 」
          </span>
        </h4>
        <p class="ellipsis">{{ item.briefIntro || '无' }}</p>
        <p>更新于 {{ item.updateTime.split(' ')[0] }}</p>
        <div class="abs popup">
          <a-tooltip placement="top">
            <template slot="title">
              <span>删除</span>
            </template>
            <a-icon
              type="delete"
              @click="del(item.articleId)" />
          </a-tooltip>
          <a-tooltip placement="top">
            <template slot="title">
              <span>编辑</span>
            </template>
            <a-icon
              type="form"
              @click="edit(item.articleId)" />
          </a-tooltip>
          <a-tooltip placement="top">
            <template slot="title">
              <span>发布</span>
            </template>
            <a-icon
              type="upload"
              v-show="item.status === 0"
              @click="release(item.articleId)" />
          </a-tooltip>
        </div>
      </a-list-item>
    </a-list>
    <preview-vue :content="content" />
  </div>
</template>

<script>
import edit from '@/mixins/edit';

export default {
  name: 'HomeGrid',
  props: ['list'],
  mixins: [edit],
};
</script>

<style lang="less" scoped>
.wapper {
  top: 150px; left: 50px; right: 50px; bottom: 150px;
  overflow-y: auto;
  overflow-x: hidden;
  .listItem {
    .imgcss {
      height: 200px;
      overflow: hidden;
      margin-bottom: 10px;
      border-bottom: solid 1px #ddd;
      background-size: 50% !important;
    }
    h4 { padding: 0 20px; font-size: 32px; cursor: pointer; }
    h4:hover { color: #f00; }
    h4 span {
      float: right;
      color: #666;
      font-size: 16px;
      &.now { color: #1DA57A; }
    }
    p { padding: 0 20px; margin-bottom: 10px; font-size: 28px;}
    .popup {
      display: none;
      justify-content: flex-end;
      top: 30px; left: 0; right: 30px;
      .anticon {
        padding: 10px;
        cursor: pointer;
        margin-left: 20px;
        border-radius: 50%;
        background: #fff;
        border: solid 1px #ddd;
        &:hover { color: red; border: solid 1px red; }
      }
    }
    &:hover {
      .popup {
        display: flex;
      }
    }
  }
}

</style>
