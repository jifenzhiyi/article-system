export const NODE_ENV = process.env.NODE_ENV || 'dev';

export const API_LIST = {
  // dev: 'http://localhost:8887/',
  dev: 'http://192.168.188.16:9229/malu/', // 测试地址
  prod: `${window.location.origin}/malu-superuser/`,
};

export const END_POINT = API_LIST[NODE_ENV];
