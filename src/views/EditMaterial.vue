<template>
  <div class="edit-material">
    <div class="card">
      <h2>编辑资料</h2>
      <form @submit.prevent="updateMaterial">
        <div class="form-group">
          <label for="name">资料名称</label>
          <input type="text" id="name" v-model="material.name" required>
        </div>
        <div class="form-group">
          <label for="club">所属社团</label>
          <select id="club" v-model="material.club" required>
            <option value="">请选择社团</option>
            <option value="计算机协会">计算机协会</option>
            <option value="文学社">文学社</option>
            <option value="篮球队">篮球队</option>
            <option value="志愿者协会">志愿者协会</option>
            <option value="摄影社">摄影社</option>
          </select>
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
          <input type="file" id="file" @change="handleFileUpload">
          <p class="file-info">当前文件：{{ material.currentFile }}</p>
        </div>
        <div class="form-group">
          <label for="description">资料描述</label>
          <textarea id="description" v-model="material.description" rows="4" required></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">保存</button>
          <router-link to="/materials" class="btn btn-secondary">取消</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditMaterial',
  data() {
    return {
      material: {
        id: '',
        name: '',
        club: '',
        category: '',
        description: '',
        currentFile: ''
      },
      file: null
    }
  },
  mounted() {
    // 从localStorage读取资料详情
    const id = this.$route.params.id;
    const materialsData = localStorage.getItem('materials');
    if (materialsData) {
      const materials = JSON.parse(materialsData);
      const material = materials.find(m => m.id === id);
      if (material) {
        this.material = {
          id: material.id,
          name: material.name,
          club: material.club,
          category: material.category,
          description: material.description,
          currentFile: material.name
        };
      }
    }
  },
  methods: {
    handleFileUpload(e) {
      this.file = e.target.files[0];
    },
    updateMaterial() {
      // 从localStorage读取现有资料数据
      const materialsData = localStorage.getItem('materials');
      if (materialsData) {
        let materials = JSON.parse(materialsData);
        const index = materials.findIndex(m => m.id === this.material.id);
        if (index !== -1) {
          // 计算文件大小
          let size = materials[index].size;
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
          
          // 更新资料
          materials[index] = {
            ...materials[index],
            name: this.material.name,
            club: this.material.club,
            category: this.material.category,
            description: this.material.description,
            size: size
          };
          
          // 保存到localStorage
          localStorage.setItem('materials', JSON.stringify(materials));
        }
      }
      
      alert('资料信息更新成功！');
      this.$router.push('/materials');
    }
  }
}
</script>

<style scoped>
.edit-material {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.file-info {
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>