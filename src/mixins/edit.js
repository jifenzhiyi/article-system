export default {
  methods: {
    del(id) {
      this.$emit('on-del', id);
    },
    edit(id) {
      this.$emit('on-edit', id);
    },
    release(id) {
      this.$emit('on-release', id);
    },
  },
};
