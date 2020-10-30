import request from '@/utils/request';

// 登录
const login = (url, data) => request.send(url, { method: 'POST', data });

// 注册
const register = (url, data) => request.send(url, { method: 'POST', data });

// 列表
const list = (url, params) => request.send(url, { params });

// 详情
const info = (id) => request.send(`/api/article/detail?id=${id}`);

// 文件检查
const checkfile = (data) => request.send('/api/checkfile', { method: 'POST', data });

// 文件上传
const upload = (data) => request.send('/api/uploadfile', { method: 'POST', data });

// 新建文章
const createArticle = (data) => request.send('/api/article/edit', { method: 'POST', data });

export default {
  login,
  register,
  list,
  info,
  checkfile,
  upload,
  createArticle,
};
