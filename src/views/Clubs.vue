<template>
  <div class="clubs-container">
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
      <h2>社团管理</h2>
      
      <!-- 新增社团按钮 -->
      <button v-if="currentUser && currentUser.role === '系统管理员'" @click="showAddForm = true" class="add-btn">
        新增社团
      </button>

      <!-- 社团列表 -->
      <div class="clubs-list">
        <table class="clubs-table">
          <thead>
            <tr>
              <th>社团名称</th>
              <th>描述</th>
              <th>负责人</th>
              <th>成员数</th>
              <th v-if="currentUser && currentUser.role === '系统管理员'">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="club in clubs" :key="club.id">
              <td>{{ club.name }}</td>
              <td>{{ club.description }}</td>
              <td>{{ club.leader }}</td>
              <td>{{ club.memberCount }}</td>
              <td v-if="currentUser && currentUser.role === '系统管理员'">
                <button @click="editClub(club)" class="edit-btn">编辑</button>
                <button @click="deleteClub(club.id)" class="delete-btn">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 新增/编辑社团表单 -->
      <div v-if="showAddForm" class="form-overlay">
        <div class="form-container">
          <h3>{{ editingClub ? '编辑社团' : '新增社团' }}</h3>
          <form @submit.prevent="saveClub">
            <div class="form-group">
              <label for="clubName">社团名称</label>
              <input type="text" id="clubName" v-model="clubForm.name" required>
            </div>
            <div class="form-group">
              <label for="clubDescription">描述</label>
              <textarea id="clubDescription" v-model="clubForm.description" required></textarea>
            </div>
            <div class="form-group">
              <label for="clubLeader">负责人</label>
              <input type="text" id="clubLeader" v-model="clubForm.leader" required>
            </div>
            <div class="form-actions">
              <button type="submit" class="save-btn">保存</button>
              <button type="button" @click="showAddForm = false" class="cancel-btn">取消</button>
            </div>
          </form>
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
const clubs = ref([
  {
    id: 1,
    name: '计算机协会',
    description: '专注于计算机技术学习和交流的社团',
    leader: '张三',
    memberCount: 25
  },
  {
    id: 2,
    name: '文学社',
    description: '热爱文学创作和阅读的社团',
    leader: '李四',
    memberCount: 18
  },
  {
    id: 3,
    name: '篮球队',
    description: '致力于篮球运动的社团',
    leader: '王五',
    memberCount: 12
  },
  {
    id: 4,
    name: '足球队',
    description: '专注于足球运动的社团',
    leader: '赵六',
    memberCount: 15
  },
  {
    id: 5,
    name: '辩论社',
    description: '培养辩论能力和逻辑思维的社团',
    leader: '孙七',
    memberCount: 20
  }
])

const showAddForm = ref(false)
const editingClub = ref(null)
const clubForm = ref({
  name: '',
  description: '',
  leader: ''
})

const handleLogout = () => {
  localStorage.removeItem('currentUser')
  router.push('/login')
}

const editClub = (club) => {
  editingClub.value = club
  clubForm.value = { ...club }
  showAddForm.value = true
}

const deleteClub = (id) => {
  if (confirm('确定要删除这个社团吗？')) {
    clubs.value = clubs.value.filter(club => club.id !== id)
  }
}

const saveClub = () => {
  if (editingClub.value) {
    // 编辑现有社团
    const index = clubs.value.findIndex(club => club.id === editingClub.value.id)
    if (index !== -1) {
      clubs.value[index] = { ...clubForm.value, id: editingClub.value.id, memberCount: clubs.value[index].memberCount }
    }
  } else {
    // 新增社团
    const newClub = {
      id: Date.now(),
      ...clubForm.value,
      memberCount: 0
    }
    clubs.value.push(newClub)
  }
  showAddForm.value = false
  editingClub.value = null
  clubForm.value = { name: '', description: '', leader: '' }
}

onMounted(() => {
  // 获取当前登录用户
  const user = localStorage.getItem('currentUser')
  if (user) {
    currentUser.value = JSON.parse(user)
  } else {
    router.push('/login')
  }
})
</script>

<style scoped>
.clubs-container {
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

.add-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 20px;
}

.clubs-list {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.clubs-table {
  width: 100%;
  border-collapse: collapse;
}

.clubs-table th,
.clubs-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.clubs-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.edit-btn,
.delete-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
  font-weight: bold;
}

.edit-btn {
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

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
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