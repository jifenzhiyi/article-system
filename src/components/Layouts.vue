<template>
  <div class="layouts">
    <base-header />
    <div class="home">
      <base-aside />
      <router-view />
    </div>
  </div>
</template>

<script>
import baseHeader from 'comps/Base/Header';
import baseAside from 'comps/Base/aside';

export default {
  name: 'Layouts',
  components: {
    baseHeader,
    baseAside,
  },
};
</script>

<style lang="less" scoped>
.layouts {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .home {
    width: 100%;
    height: 100%;
    display: flex;
  }
}
</style>
