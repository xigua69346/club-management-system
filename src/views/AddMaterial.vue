<template>
  <div class="add-material">
    <div class="card">
      <h2>添加资料</h2>
      <form @submit.prevent="addMaterial">
        <div class="form-group">
          <label for="name">资料名称</label>
          <input type="text" id="name" v-model="material.name" required>
        </div>
        <div class="form-group">
          <label for="club">所属社团</label>
          <input type="text" id="club" v-model="material.club" readonly required>
        </div>
        <div class="form-group">
          <label for="category">资料分类</label>
          <select id="category" v-model="material.category" required>
            <option value="">请选择分类</option>
            <option value="文档">文档</option>
            <option value="图片">图片</option>
            <option value="视频">视频</option>
            <option value="其他">其他</option>
          </select>
        </div>
        <div class="form-group">
          <label for="file">上传文件</label>
          <input type="file" id="file" @change="handleFileUpload" required>
          <p v-if="isFileLoading" style="color: #666; margin-top: 5px;">文件正在读取中...</p>
        </div>
        <div class="form-group">
          <label for="description">资料描述</label>
          <textarea id="description" v-model="material.description" rows="4" required></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="isFileLoading">上传</button>
          <router-link to="/materials" class="btn btn-secondary">取消</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddMaterial',
  data() {
    return {
      material: {
        name: '',
        club: '',
        category: '',
        description: ''
      },
      file: null,
      userInfo: null,
      fileContent: null,
      isFileLoading: false
    }
  },
  mounted() {
    // 获取用户信息
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      this.userInfo = JSON.parse(userInfo);
      // 设置默认社团为用户所属的社团
      this.material.club = this.userInfo.club || '';
    }
  },
  methods: {
    handleFileUpload(e) {
      this.file = e.target.files[0];
      if (this.file) {
        this.isFileLoading = true;
        // 读取文件内容
        const reader = new FileReader();
        reader.onload = (event) => {
          this.fileContent = event.target.result;
          console.log('文件读取成功，fileContent长度:', this.fileContent.length);
          this.isFileLoading = false;
        };
        reader.onerror = (event) => {
          console.error('文件读取失败:', event.target.error);
          alert('文件读取失败，请重试！');
          this.isFileLoading = false;
        };
        reader.readAsDataURL(this.file);
      }
    },
    addMaterial() {
      // 检查文件大小
      if (this.file) {
        const fileSize = this.file.size;
        if (fileSize > 5 * 1024 * 1024) { // 5MB限制
          alert('文件大小超过5MB，无法上传！');
          return;
        }
      }
      
      // 检查fileContent是否存在
      if (!this.fileContent && this.file) {
        alert('文件正在读取中，请稍候再试！');
        return;
      }
      
      // 从localStorage读取现有资料数据
      const materialsData = localStorage.getItem('materials');
      let materials = [];
      if (materialsData) {
        materials = JSON.parse(materialsData);
      }
      
      // 获取当前用户信息
      const userInfo = localStorage.getItem('userInfo');
      const user = userInfo ? JSON.parse(userInfo) : null;
      
      // 生成唯一ID
      const id = 'M' + Date.now() + Math.floor(Math.random() * 1000);
      
      // 计算文件大小
      let size = '0KB';
      if (this.file) {
        const fileSize = this.file.size;
        if (fileSize < 1024) {
          size = fileSize + 'B';
        } else if (fileSize < 1024 * 1024) {
          size = (fileSize / 1024).toFixed(1) + 'KB';
        } else {
          size = (fileSize / (1024 * 1024)).toFixed(1) + 'MB';
        }
      }
      
      // 创建新资料
      const newMaterial = {
        id: id,
        name: this.material.name,
        club: this.material.club,
        category: this.material.category,
        uploader: user ? user.username : '未知',
        uploadTime: new Date().toLocaleString(),
        size: size,
        description: this.material.description,
        fileContent: this.fileContent
      };
      
      console.log('上传资料:', newMaterial);
      console.log('fileContent存在:', newMaterial.fileContent ? '是' : '否');
      if (newMaterial.fileContent) {
        console.log('fileContent长度:', newMaterial.fileContent.length);
        console.log('fileContent前100个字符:', newMaterial.fileContent.substring(0, 100));
      }
      
      // 添加到资料列表
      materials.push(newMaterial);
      
      try {
        // 保存到localStorage
        localStorage.setItem('materials', JSON.stringify(materials));
        console.log('localStorage保存成功');
        alert('资料上传成功！');
        this.$router.push('/materials');
      } catch (error) {
        alert('上传失败：文件太大，无法保存到本地存储！');
        console.error('localStorage保存失败:', error);
      }
    }
  }
}
</script>

<style scoped>
.add-material {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>