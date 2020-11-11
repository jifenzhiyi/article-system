import Vue from 'vue';
import Vuex from 'vuex';
import { loadLanguageAsync } from '@/locale';
import storage from '@/utils/storage';
import localInit from './plugins/localInit';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    language: storage.get('scada_lang') || 'zh-CN', // 当前选中的语言
    previewIsShow: false,
  },
  mutations: {
    // 设置语言
    SET_LANG(state, lang) {
      state.language = lang;
    },
    // 预览模块显示/隐藏
    SET_PREVIEW(state, flag) {
      state.previewIsShow = flag;
    },
  },
  actions: {
    SetLang({ commit }, lang) {
      return new Promise((resolve) => {
        commit('SET_LANG', lang);
        loadLanguageAsync(lang);
        resolve();
      });
    },
  },
  plugins: [localInit],
});
