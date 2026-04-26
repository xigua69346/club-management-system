<template>
  <div class="materials-container">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="navbar-left">
        <h1>高校社团信息管理系统</h1>
      </div>
      <div class="navbar-right">
        <span v-if="currentUser" class="user-info">
          {{ currentUser.name }} ({{ currentUser.role }})
        </span>
        <button v-if="currentUser" @click="handleLogout" class="logout-btn">退出登录</button>
        <router-link v-else to="/login" class="login-btn">登录</router-link>
      </div>
    </nav>

    <!-- 主要内容 -->
    <div class="main-content">
      <h2>资料管理</h2>
      
      <!-- 上传资料按钮 -->
      <button v-if="currentUser && (currentUser.role === '社团负责人' || currentUser.role === '系统管理员')" @click="showUploadForm = true" class="upload-btn">
        上传资料
      </button>

      <!-- 资料列表 -->
      <div class="materials-list">
        <table class="materials-table">
          <thead>
            <tr>
              <th>文件名</th>
              <th>类型</th>
              <th>上传者</th>
              <th>上传时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="material in materials" :key="material.id">
              <td>{{ material.name }}</td>
              <td>{{ material.type }}</td>
              <td>{{ material.uploader }}</td>
              <td>{{ material.uploadTime }}</td>
              <td>
                <button @click="previewMaterial(material)" class="preview-btn">预览</button>
                <button v-if="currentUser && (currentUser.role === '社团负责人' || currentUser.role === '系统管理员')" @click="deleteMaterial(material.id)" class="delete-btn">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 上传资料表单 -->
      <div v-if="showUploadForm" class="form-overlay">
        <div class="form-container">
          <h3>上传资料</h3>
          <form @submit.prevent="uploadMaterial">
            <div class="form-group">
              <label for="materialName">文件名</label>
              <input type="text" id="materialName" v-model="materialForm.name" required>
            </div>
            <div class="form-group">
              <label for="materialFile">文件</label>
              <input type="file" id="materialFile" @change="handleFileUpload" required>
            </div>
            <div class="form-actions">
              <button type="submit" class="upload-btn">上传</button>
              <button type="button" @click="showUploadForm = false" class="cancel-btn">取消</button>
            </div>
          </form>
        </div>
      </div>

      <!-- 预览资料 -->
      <div v-if="selectedMaterial" class="form-overlay">
        <div class="form-container">
          <h3>预览资料</h3>
          <div class="material-preview">
            <h4>{{ selectedMaterial.name }}</h4>
            <div v-if="selectedMaterial.type.includes('image')" class="image-preview">
              <img :src="selectedMaterial.content" alt="预览图片">
            </div>
            <div v-else class="file-preview">
              <p>文件类型: {{ selectedMaterial.type }}</p>
              <p>上传时间: {{ selectedMaterial.uploadTime }}</p>
              <p>上传者: {{ selectedMaterial.uploader }}</p>
              <a :href="selectedMaterial.content" download="{{ selectedMaterial.name }}" class="download-link">下载文件</a>
            </div>
          </div>
          <div class="form-actions">
            <button type="button" @click="selectedMaterial = null" class="cancel-btn">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentUser = ref(null)
const materials = ref([])
const showUploadForm = ref(false)
const selectedMaterial = ref(null)
const materialForm = ref({
  name: '',
  file: null,
  content: ''
})

const handleLogout = () => {
  localStorage.removeItem('currentUser')
  router.push('/login')
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    materialForm.value.file = file
    
    // 读取文件内容
    const reader = new FileReader()
    reader.onload = (e) => {
      materialForm.value.content = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const uploadMaterial = () => {
  if (materialForm.value.file && materialForm.value.content) {
    const newMaterial = {
      id: Date.now(),
      name: materialForm.value.name,
      type: materialForm.value.file.type,
      uploader: currentUser.value.name,
      uploadTime: new Date().toLocaleString(),
      content: materialForm.value.content
    }
    
    materials.value.push(newMaterial)
    localStorage.setItem('materials', JSON.stringify(materials.value))
    
    showUploadForm.value = false
    materialForm.value = { name: '', file: null, content: '' }
    alert('资料上传成功')
  }
}

const previewMaterial = (material) => {
  selectedMaterial.value = material
}

const deleteMaterial = (id) => {
  if (confirm('确定要删除这个资料吗？')) {
    materials.value = materials.value.filter(material => material.id !== id)
    localStorage.setItem('materials', JSON.stringify(materials.value))
  }
}

onMounted(() => {
  // 获取当前登录用户
  const user = localStorage.getItem('currentUser')
  if (user) {
    currentUser.value = JSON.parse(user)
  } else {
    router.push('/login')
  }
  
  // 加载资料数据
  const materialsData = JSON.parse(localStorage.getItem('materials') || '[]')
  materials.value = materialsData
})
</script>

<style scoped>
.materials-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.navbar {
  background-color: #4CAF50;
  color: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-left h1 {
  margin: 0;
  font-size: 20px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  font-weight: bold;
}

.logout-btn,
.login-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  text-decoration: none;
  color: white;
}

.logout-btn {
  background-color: #f44336;
}

.login-btn {
  background-color: #2196F3;
}

.main-content {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.main-content h2 {
  margin-bottom: 20px;
  color: #333;
}

.upload-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 20px;
}

.materials-list {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.materials-table {
  width: 100%;
  border-collapse: collapse;
}

.materials-table th,
.materials-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.materials-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.preview-btn,
.delete-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
  font-weight: bold;
}

.preview-btn {
  background-color: #2196F3;
  color: white;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.form-container {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px;
}

.form-container h3 {
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.material-preview {
  margin-bottom: 20px;
}

.material-preview h4 {
  margin-bottom: 15px;
  color: #333;
}

.image-preview img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 4px;
}

.file-preview {
  line-height: 1.6;
}

.download-link {
  display: inline-block;
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.save-btn,
.cancel-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.save-btn {
  background-color: #4CAF50;
  color: white;
  flex: 1;
}

.cancel-btn {
  background-color: #999;
  color: white;
  flex: 1;
}
</style>