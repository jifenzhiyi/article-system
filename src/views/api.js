import request from '@/utils/request';

// 登录
const login = (data) => request.send('/api/users/login', { method: 'POST', data });

export default {
  login,
};
