import api from '@/views/api';

export default {
  data() {
    return {
      content: '',
    };
  },
  methods: {
    radioChange(top, item) {
      this.$emit('on-options', { type: 'putTop', articleId: item.articleId, top });
    },
    async preview(articleId) {
      if (articleId) {
        const res = await api.operation('queryArticle', { articleId });
        res && (this.content = res.data.content);
      }
      this.$store.commit('SET_PREVIEW', true);
    },
    options(type, articleId) {
      this.$emit('on-options', { type, articleId });
    },
  },
};
