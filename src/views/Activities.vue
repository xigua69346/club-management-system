<template>
  <div class="activities-container">
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
      <h2>活动管理</h2>
      
      <!-- 新增活动按钮 -->
      <button v-if="currentUser && (currentUser.role === '社团负责人' || currentUser.role === '系统管理员')" @click="showAddForm = true" class="add-btn">
        新增活动
      </button>

      <!-- 活动列表 -->
      <div class="activities-list">
        <table class="activities-table">
          <thead>
            <tr>
              <th>活动名称</th>
              <th>社团</th>
              <th>时间</th>
              <th>地点</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="activity in activities" :key="activity.id">
              <td>{{ activity.name }}</td>
              <td>{{ activity.club }}</td>
              <td>{{ activity.time }}</td>
              <td>{{ activity.location }}</td>
              <td>{{ activity.status }}</td>
              <td>
                <button @click="viewActivity(activity)" class="view-btn">查看</button>
                <button v-if="currentUser && (currentUser.role === '社团负责人' || currentUser.role === '系统管理员')" @click="editActivity(activity)" class="edit-btn">编辑</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 新增/编辑活动表单 -->
      <div v-if="showAddForm" class="form-overlay">
        <div class="form-container">
          <h3>{{ editingActivity ? '编辑活动' : '新增活动' }}</h3>
          <form @submit.prevent="saveActivity">
            <div class="form-group">
              <label for="activityName">活动名称</label>
              <input type="text" id="activityName" v-model="activityForm.name" required>
            </div>
            <div class="form-group">
              <label for="activityClub">社团</label>
              <input type="text" id="activityClub" v-model="activityForm.club" required>
            </div>
            <div class="form-group">
              <label for="activityTime">时间</label>
              <input type="datetime-local" id="activityTime" v-model="activityForm.time" required>
            </div>
            <div class="form-group">
              <label for="activityLocation">地点</label>
              <input type="text" id="activityLocation" v-model="activityForm.location" required>
            </div>
            <div class="form-group">
              <label for="activityDescription">描述</label>
              <textarea id="activityDescription" v-model="activityForm.description" required></textarea>
            </div>
            <div class="form-group">
              <label for="activityStatus">状态</label>
              <select id="activityStatus" v-model="activityForm.status" required>
                <option value="计划中">计划中</option>
                <option value="进行中">进行中</option>
                <option value="已完成">已完成</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="submit" class="save-btn">保存</button>
              <button type="button" @click="showAddForm = false" class="cancel-btn">取消</button>
            </div>
          </form>
        </div>
      </div>

      <!-- 活动详情 -->
      <div v-if="selectedActivity" class="form-overlay">
        <div class="form-container">
          <h3>活动详情</h3>
          <div class="activity-detail">
            <p><strong>活动名称:</strong> {{ selectedActivity.name }}</p>
            <p><strong>社团:</strong> {{ selectedActivity.club }}</p>
            <p><strong>时间:</strong> {{ selectedActivity.time }}</p>
            <p><strong>地点:</strong> {{ selectedActivity.location }}</p>
            <p><strong>状态:</strong> {{ selectedActivity.status }}</p>
            <p><strong>描述:</strong> {{ selectedActivity.description }}</p>
          </div>
          <div class="form-actions">
            <button type="button" @click="selectedActivity = null" class="cancel-btn">关闭</button>
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
const activities = ref([])
const showAddForm = ref(false)
const editingActivity = ref(null)
const selectedActivity = ref(null)
const activityForm = ref({
  name: '',
  club: '',
  time: '',
  location: '',
  description: '',
  status: '计划中'
})

const handleLogout = () => {
  localStorage.removeItem('currentUser')
  router.push('/login')
}

const viewActivity = (activity) => {
  selectedActivity.value = activity
}

const editActivity = (activity) => {
  editingActivity.value = activity
  activityForm.value = { ...activity }
  showAddForm.value = true
}

const saveActivity = () => {
  if (editingActivity.value) {
    // 编辑现有活动
    const index = activities.value.findIndex(activity => activity.id === editingActivity.value.id)
    if (index !== -1) {
      activities.value[index] = { ...activityForm.value, id: editingActivity.value.id }
    }
  } else {
    // 新增活动
    const newActivity = {
      id: Date.now(),
      ...activityForm.value
    }
    activities.value.push(newActivity)
  }
  
  // 保存到localStorage
  localStorage.setItem('activities', JSON.stringify(activities.value))
  
  showAddForm.value = false
  editingActivity.value = null
  activityForm.value = {
    name: '',
    club: '',
    time: '',
    location: '',
    description: '',
    status: '计划中'
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
  
  // 加载活动数据
  const activitiesData = JSON.parse(localStorage.getItem('activities') || '[]')
  activities.value = activitiesData
})
</script>

<style scoped>
.activities-container {
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

.activities-list {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.activities-table {
  width: 100%;
  border-collapse: collapse;
}

.activities-table th,
.activities-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.activities-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.view-btn,
.edit-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
  font-weight: bold;
}

.view-btn {
  background-color: #2196F3;
  color: white;
}

.edit-btn {
  background-color: #4CAF50;
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
.form-group textarea,
.form-group select {
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

.activity-detail {
  margin-bottom: 20px;
}

.activity-detail p {
  margin-bottom: 10px;
  line-height: 1.4;
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