<template>
  <img
    :class="config"
    :src="src"
    @error="imgError" />
</template>

<script>
export default {
  name: 'BaseImage',
  props: ['src', 'config'],
  methods: {
    imgError(event) {
      const item = event.srcElement;
      item.src = '/null.png';
      item.onerror = null;
    },
  },
};
</script>

<style lang="less" scoped>
img {
  margin-right: 30px;
  &.w100 {
    width: 100%;
  }
  &.h100 {
    height: 100%;
  }
  &.h_default {
    height: 200px;
  }
}
</style>
