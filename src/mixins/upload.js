import sparkMD5 from 'spark-md5';
import api from '@/views/api';

const CHUNK_SIZE = parseInt(0.1 * 1024 * 1024, 10);

export default {
  data() {
    return {
      token: this.$storage.get(`${window.configName}_usertoken`),
      file: null,
      chunks: [],
      hash: null,
    };
  },
  methods: {
    beforeUpload(file) {
      if (!file) return;
      this.file = file;
      this.chunks = [];
      return false;
    },
    async images_upload_handler(blobInfo, success, failure) {
      const file = blobInfo.blob();
      if (!file) return;
      this.file = file;
      this.chunks = [];
      const img = await this.handleChange('content');
      if (img === '您的账号在异地登录，请重新登录') {
        failure(img);
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
      if (img === '该文件非图片格式' || img === '上传图片大小不能超过2M') {
        failure(img);
      }
      if (img) {
        success(img);
      } else {
        failure('error');
      }
    },
    // 普通上传
    async handleChange(type) {
      if (!this.file) return;
      const isImage = await this.isImage(this.file);
      if (!isImage) {
        this.$message.error('该文件非图片格式');
        return '该文件非图片格式';
      }
      if (this.file.size > 2 * 1024 * 1024) {
        this.$message.error('上传图片大小不能超过2M');
        return '上传图片大小不能超过2M';
      }
      const form = new FormData();
      form.append('accessToken', this.token);
      form.append('project', type);
      form.append('file', this.file);
      const ret = await this.$http.post('/api/images/upload', form);
      if (ret.data && ret.data.code !== '0000') {
        const code = ret.data.code;
        console.log('code', code);
        return code === '2006' ? '您的账号在异地登录，请重新登录' : null;
      }
      if (type !== 'content') {
        this.params.mainImage = ret.data.data.imageUrl;
      }
      let imageUrl = null;
      if (ret) imageUrl = ret.data.data.imageUrl;
      return imageUrl;
    },
    // 分片，断点续传，秒传
    async handleChange2() {
      if (!this.file) return;
      const isImage = await this.isImage(this.file);
      if (!isImage) {
        return;
      }
      const chunks = this.createFileChunk();
      const hash = await this.calculateHashSample(chunks);
      this.hash = hash;
      const res = await api.checkfile({
        hash,
        ext: this.file.name.split('.').pop(),
      });
      const { uploaded, uploadedList, url } = res.data;
      if (uploaded) {
        this.params.mainImage = url;
        return this.$message.success('秒传成功！');
      }
      this.chunks = chunks.map((chunk, index) => {
        const name = `${hash}-${index}`;
        return {
          hash,
          name,
          index,
          chunk: chunk.file,
          progress: uploadedList.indexOf(name) > -1 ? 100 : 0,
        };
      });
      await this.uploadChunks(uploadedList);
    },
    async uploadChunks(uploadedList) {
      const requests = this.chunks
        .filter((chunk) => uploadedList.indexOf(chunk.name) === -1)
        .map((chunk) => {
          const form = new FormData();
          form.append('chunk', chunk.chunk);
          form.append('hash', chunk.hash);
          form.append('name', chunk.name);
          return { form, index: chunk.index, error: 0 };
        });
      await this.sendRequest(requests);
      await this.mergeRequest();
    },
    async mergeRequest() {
      const ret = await this.$http.post('/api/mergefile', {
        ext: this.file.name.split('.').pop(),
        size: CHUNK_SIZE,
        hash: this.hash,
      });
      this.params.mainImage = ret.data.data.url;
    },
    async sendRequest(chunks, limit = 4) {
      return new Promise((resolve, reject) => {
        const len = chunks.length;
        let counter = 0;
        let isStop = false;
        const start = async () => {
          if (isStop) {
            return;
          }
          const task = chunks.shift();
          if (task) {
            const { form, index } = task;
            try {
              await this.$http.post('/api/uploadfile', form);
              if (counter === len - 1) {
                // 最后一个任务
                resolve();
              } else {
                counter++;
                // 启动下一个任务
                start();
              }
            } catch (e) {
              this.chunks[index].progress = -1;
              if (task.error < 3) {
                task.error++;
                chunks.unshift(task);
                start();
              } else {
                // 错误三次
                isStop = true;
                reject();
              }
            }
          }
        };

        while (limit > 0) {
          start();
          limit -= 1;
        }
      });
    },
    blobToString(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const ret = reader.result
            .split('')
            .map((v) => v.charCodeAt())
            .map((v) => v.toString(16).toUpperCase())
            .map((v) => v.padStart(2, '0'))
            .join(' ');
          resolve(ret);
        };
        reader.readAsBinaryString(file);
      });
    },
    async isGif(file) {
      // 前面6个16进制, '47 49 46 38 39 61' or '47 49 46 38 37 61
      const ret = await this.blobToString(file.slice(0, 6));
      const isGif = ret === '47 49 46 38 39 61' || ret === '47 49 46 38 37 61';
      return isGif;
    },
    async isPNG(file) {
      const ret = await this.blobToString(file.slice(0, 8));
      const isPNG = ret === '89 50 4E 47 0D 0A 1A 0A';
      return isPNG;
    },
    async isJPG(file) {
      const len = file.size;
      const start = await this.blobToString(file.slice(0, 2));
      const end = await this.blobToString(file.slice(-2, len));
      const isJPG = start === 'FF D8' && end === 'FF D9';
      return isJPG;
    },
    async isImage(file) {
      return (await this.isGif(file)) || (await this.isPNG(file)) || (await this.isJPG(file));
    },
    createFileChunk(size = CHUNK_SIZE) {
      const chunks = [];
      let cur = 0;
      while (cur < this.file.size) {
        chunks.push({ index: cur, file: this.file.slice(cur, cur + size) });
        cur += size;
      }
      return chunks;
    },
    async calculateHashSample() {
      return new Promise((resolve) => {
        const spark = new sparkMD5.ArrayBuffer();
        const reader = new FileReader();
        const file = this.file;
        const size = file.size;
        const offset = 2 * 1024 * 1024;
        const chunks = [file.slice(0, offset)];
        let cur = offset;
        while (cur < size) {
          if (cur + offset >= size) {
            chunks.push(file.slice(cur, cur + offset));
          } else {
            const mid = cur + offset / 2;
            const end = cur + offset;
            chunks.push(file.slice(cur, cur + 2));
            chunks.push(file.slice(mid, mid + 2));
            chunks.push(file.slice(end - 2, end));
          }
          cur += offset;
        }
        reader.readAsArrayBuffer(new Blob(chunks));
        reader.onload = (e) => {
          spark.append(e.target.result);
          this.hashProgress3 = 100;
          resolve(spark.end());
        };
      });
    },
  },
};
