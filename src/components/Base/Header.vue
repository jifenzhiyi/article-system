<template>
  <header>
    <img
      class="logo"
      src="@/assets/images/logo.png" />
    <div class="title">文章发布系统</div>
    <!--用户设置-->
    <a-dropdown class="info">
      <a
        class="ant-dropdown-link"
        @click="e => e.preventDefault()">
        <svg-icon iconClass="user" />
        <span>{{ name }}</span>
        <span>({{ department }})</span>
      </a>
      <a-menu slot="overlay">
        <a-menu-item>
          <a @click="logout">
            <a-icon
              slot="icon"
              type="logout" /> 退出登录</a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </header>
</template>

<script>
export default {
  name: 'BaseHeader',
  data() {
    return {
      name: this.$storage.get('article-system_username'),
      department: this.$storage.get('article-system_department'),
    };
  },
  methods: {
    logout() {
      this.$notice_confirm({
        minfo: '是否确认退出？',
        func: () => {
          this.$storage.clear();
          this.$router.push('/login');
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
header {
  height: 96px;
  display: flex;
  padding: 0 40px;
  align-items: center;
  border-bottom: 2px solid #e8e8e8;
  .logo { height: 80px; }
  .title {
    font-size: 36px;
    font-weight: 600;
    padding-left: 80px;
    position: relative;
    flex: 1;
    &::before {
      content: ' ';
      width: 2px;
      height: 38px;
      background: #666;
      position: absolute;
      left: 44px; top: 8px;
    }
  }
  .info {
    .svg-icon { font-size: 36px; color: #666; }
    span { padding-left: 10px; font-size: 32px; color: #666; }
  }
}
</style>
