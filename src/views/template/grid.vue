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
          :style="`background: url(${item.imageUrl}) center no-repeat;`">
          <!-- <img :src="item.imageUrl" /> -->
        </div>
        <h4 class="ellipsis">{{ item.title }}</h4>
        <p class="ellipsis">{{ item.desc || '无' }}</p>
        <p>更新于 {{ item.updatedAt.split('T')[0] }}</p>
        <div class="abs popup">
          <a-icon
            type="delete"
            @click="del(item.id)" />
          <a-icon
            type="form"
            @click="edit(item.id)" />
          <a-icon
            type="upload"
            @click="release(item.id)" />
        </div>
      </a-list-item>
    </a-list>
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
    h4 { padding: 0 20px; font-size: 32px; }
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
