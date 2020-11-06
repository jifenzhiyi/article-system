import request from '@/utils/request';

// 登录
const login = (url, data) => request.send(url, { method: 'POST', data });

// 注册
const register = (url, data) => request.send(url, { method: 'POST', data });

// 列表
const list = (url, data) => request.send(url, { method: 'POST', data });

// 详情
const info = (data) => request.send('/api/articles/queryArticle', { method: 'POST', data });

// 文件检查
const checkfile = (data) => request.send('/api/checkfile', { method: 'POST', data });

// 文件上传
const upload = (data) => request.send('/api/uploadfile', { method: 'POST', data });

// 新建文章
const createArticle = (data) => request.send('/api/articles/save', { method: 'POST', data });

// 更新文章
const updateArticle = (data) => request.send('/api/articles/update', { method: 'POST', data });

// 发布文章
const publishArticle = (data) => request.send('/api/articles/publish', { method: 'POST', data });

// 删除文章
const deleteArticle = (data) => request.send('/api/articles/delete', { method: 'POST', data });

export default {
  login,
  register,
  list,
  info,
  checkfile,
  upload,
  createArticle,
  updateArticle,
  publishArticle,
  deleteArticle,
};
