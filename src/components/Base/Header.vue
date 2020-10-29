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
      name: '用户',
      department: '部门',
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
  height: 48px;
  display: flex;
  padding: 0 20px;
  align-items: center;
  border-bottom: 1px solid #e8e8e8;
  .logo { height: 44px; }
  .title {
    font-size: 18px;
    font-weight: 600;
    padding-left: 40px;
    position: relative;
    flex: 1;
    &::before {
      content: ' ';
      width: 2px;
      height: 19px;
      background: #666;
      position: absolute;
      left: 22px; top: 4px;
    }
  }
  .info {
    .svg-icon { font-size: 18px; color: #666; }
    span { padding-left: 5px; font-size: 16px; color: #666; }
  }
}
</style>
