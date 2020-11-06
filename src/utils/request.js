import Vue from 'vue';
import axios from 'axios';
import { END_POINT } from '@/config';
import { Modal } from 'ant-design-vue';
import storage from '@/utils/storage';

// 请求拦截
const defaultRequestInterceptors = (config) => config;
// 响应拦截
const defaultResponseInterceptors = (response) => response;
// 请求开始
const defaultStartLoading = () => {
  console.log('请求开始...');
};
// 请求结束
const defaultStopLoading = () => {
  console.log('请求结束...');
};

class Request {
  constructor(options = {}) {
    this.config = {
      baseURL: options.baseURL,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      params: {},
      data: {},
      timeout: 10000, // 单位毫秒
    };
    if (options.headers) {
      this.config = {
        ...this.config,
        headers: {
          ...this.config.headers,
          ...options.headers,
        },
      };
    }
    this.client = axios.create(this.config);
    Vue.prototype.$http = this.client;
    const requestInterceptors = options.requestInterceptors || defaultRequestInterceptors;
    const responseInterceptors = options.responseInterceptors || defaultResponseInterceptors;
    this.startLoading = defaultStartLoading;
    this.stopLoading = defaultStopLoading;
    this.client.interceptors.request.use(requestInterceptors, (error) => error);
    this.client.interceptors.response.use(responseInterceptors, (error) => responseInterceptors(error.response));
  }

  // 核心请求方法
  send(url, options, params) {
    let newConfig = { ...this.config };
    newConfig = Object.assign(newConfig, options);
    newConfig.url = url;
    const token = storage.get(`${window.configName}_usertoken`);
    if (token) {
      newConfig.method === 'GET' ? (newConfig.params.accessToken = token) : (newConfig.data.accessToken = token);
      // newConfig.headers.Authorization = `Bearer ${token}`;
    }
    newConfig.method === 'GET' ? (newConfig.data = null) : (newConfig.params = null);
    params && params.isLoading && this.startLoading();
    return this.client.request(newConfig).then((res) => {
      params && params.isLoading && this.stopLoading();
      if (res.data && res.status !== 200) {
        // TODO ajax请求失败
        return null;
      }
      if (res.data && res.data.code !== '0000') {
        Modal.error({
          title: '错误信息',
          content: res.data.msg,
          onOk() {
            ['2001', '2006', '2007', '2008'].includes(res.data.code) && (window.location.href = '/login');
          },
        });
        return null;
      }
      return res.data;
    });
  }
}

const responseInterceptors = (response) => {
  if (!response) {
    // TODO 系统正在更新，请稍后访问
    return null;
  }
  const { status } = response;
  if (status !== 200) {
    let message = '';
    switch (status) {
      case 0:
        message = '没有网络';
        break;
      case 400:
        message = '用户名或密码错误';
        break;
      case 401:
        message = '没有访问该页面的权限';
        break;
      case 404:
        message = '接口请求不存在';
        break;
      case 502:
        message = '系统正在更新，请稍后访问';
        break;
      default:
        message = `未知错误 ${status}--请联系上级管理员`;
    }
    return { data: { code: status, message }, status };
  }
  return response;
};

const request = new Request({
  baseURL: END_POINT,
  responseInterceptors,
});

export default request;

// 9999 系统异常
// 1001 请求参数错误
// 2001 您还没有登录！请登录。
// 2003 账号不存在
// 2004 密码输入错误，请重新输出
// 2005 原密码输入错误，请重新输出
// 2006 您的账号在异地登录，请重新登录
// 2007 您的账号异常，请重新登录
// 2008 登录过期，请重新登录！
// 2009 授权失败
// 3001 图片或图片名不能为空
// 3002 保存图片到磁盘失败
// 3003 文件格式不合法
// 3004 图片的项目名不能为空
// 3005 图片信息不可用
// 3101 文章数据未找到
// 0018 表数据内容错误
