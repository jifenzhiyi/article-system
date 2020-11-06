<template>
  <div class="main">
    <div class="middle">
      <img
        class="logo"
        src="@/assets/images/logo.png" />
      <a-form
        id="components-form-demo-normal-login"
        class="login-form"
        :form="form"
        @submit="handleSubmit">
        <h4>马路创新科技 ｜ 文章发布系统</h4>
        <a-form-item>
          <a-input
            v-decorator="[ 'account', { rules: [{ required: true, message: '账号不能为空' }] } ]"
            placeholder="请输入账号">
            <a-icon
              slot="prefix"
              type="user" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[ 'password', { rules: [{ required: true, message: '密码不能为空' }] } ]"
            type="password"
            placeholder="请输入密码">
            <a-icon
              slot="prefix"
              type="lock" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            class="login-form-button">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
// import md5 from 'md5';
import storage from '@/utils/storage';
import api from './api';

export default {
  name: 'Login',
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'normal_login' });
  },
  data() {
    return {
      params: null,
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => !err && this.login(values));
    },
    async login(values) {
      this.params = values;
      const obj = {
        username: values.account,
        password: values.password, // md5(values.password)
      };
      const res = await api.login('/api/users/login', obj);
      if (res) {
        storage.set(`${window.configName}_username`, res.data.name);
        storage.set(`${window.configName}_usertoken`, res.data.accessToken);
        this.$notice_success({
          minfo: '登录成功',
          func: () => this.$router.push('/home'),
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  height: 100%;
  background: url("../assets/images/group.png") no-repeat center;
  .middle {
    text-align: center;
    h4 { padding-bottom: 10px; color: #999; font-size: 18px; }
    .logo {
      height: 120px;
      margin: 0 auto;
    }
    #components-form-demo-normal-login {
      width: 540px;
      padding: 48px;
      margin-top: 30px;
      background: #fff;
      border-radius: 28px;
      box-shadow: 2px 6px 20px 0 rgba(0, 0, 0, 0.1);
      .ant-form-item {
        margin-bottom: 20px;
      }
      .login-form-button {
        width: 100%;
      }
    }
  }
  .register {
    bottom: 0; right: 0;
    width: 100px;
    height: 100px;
  }
}
</style>
