import api from '@/views/api';

export default {
  data() {
    return {
      content: '',
    };
  },
  methods: {
    async preview(articleId) {
      if (articleId) {
        const res = await api.info({ articleId });
        res && (this.content = res.data.content);
      }
      this.$store.commit('SET_PREVIEW', true);
    },
    options(type, articleId) {
      this.$emit('on-options', { type, articleId });
    },
  },
};
