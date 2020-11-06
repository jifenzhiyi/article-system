import api from '@/views/api';

export default {
  methods: {
    del(id) {
      this.$emit('on-del', id);
    },
    edit(id) {
      this.$emit('on-edit', id);
    },
    async release(articleId) {
      const res = await api.publishArticle({ articleId });
      res && this.$message.success(res.msg);
    },
  },
};
