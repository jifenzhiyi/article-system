<template>
  <div class="abs wapper">
    <a-list
      :grid="{ gutter: 16, column: 4 }"
      :data-source="list">
      <a-list-item
        class="listItem"
        slot="renderItem"
        slot-scope="item">
        <div class="imgcss">
          <base-image
            config="w100 h100"
            :src="item.mainImage" />
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
              @click="options('delete', item.articleId)" />
          </a-tooltip>
          <a-tooltip placement="top">
            <template slot="title">
              <span>编辑</span>
            </template>
            <a-icon
              type="form"
              @click="options('edit', item.articleId)" />
          </a-tooltip>
          <a-tooltip placement="top">
            <template slot="title">
              <span>发布</span>
            </template>
            <a-icon
              type="upload"
              v-show="item.status === 0"
              @click="options('publish', item.articleId)" />
          </a-tooltip>
          <a-tooltip placement="top">
            <template slot="title">
              <span>下架</span>
            </template>
            <a-icon
              type="download"
              v-show="item.status === 1"
              @click="options('unshelve', item.articleId)" />
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
      width: 100%;
      height: 200px;
      overflow: hidden;
      text-align: center;
      margin-bottom: 10px;
      border-bottom: solid 1px #ddd;
    }
    h4 {
      padding: 0 130px 0 20px;
      font-size: 32px;
      cursor: pointer;
      position: relative;
    }
    h4:hover { color: #f00; }
    h4 span {
      right: 0;
      top: 6px;
      color: #666;
      font-size: 16px;
      position: absolute;
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
