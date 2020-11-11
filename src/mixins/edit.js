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
    del(id) {
      this.$emit('on-del', id);
    },
    edit(id) {
      this.$emit('on-edit', id);
    },
    release(articleId) {
      this.$emit('on-release', articleId);
    },
  },
};
