import request from '@/utils/request';

// 登录
const login = (url, data) => request.send(url, { method: 'POST', data });

// 注册
const register = (url, data) => request.send(url, { method: 'POST', data });

// 文件检查
const checkfile = (data) => request.send('/api/checkfile', { method: 'POST', data });

// 文件上传
const upload = (data) => request.send('/api/uploadfile', { method: 'POST', data });

// 文章操作接口
// queryList 列表 | queryArticle 详情 | 置顶/置尾 putTop
// save 新建 | update 更新 | publish 发布 | delete 删除 | unshelve 下架
const operation = (config, data) => request.send(`/api/articles/${config}`, { method: 'POST', data });

// 标签操作接口
// addTags 新增 ｜ deleteTags 删除 ｜ queryList 查询 | updateTags 更新标签状态
const tagOperate = (config, data) => request.send(`/api/tags/${config}`, { method: 'POST', data });

export default {
  login,
  register,
  checkfile,
  upload,
  operation,
  tagOperate,
};
