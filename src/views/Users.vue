<template>
  <div class="users-container">
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
      <h2>用户管理</h2>
      
      <!-- 用户列表 -->
      <div class="users-list">
        <table class="users-table">
          <thead>
            <tr>
              <th>用户名</th>
              <th>姓名</th>
              <th>社团</th>
              <th>角色</th>
              <th>专业</th>
              <th>性别</th>
              <th>联系方式</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.username">
              <td>{{ user.username }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.club }}</td>
              <td>{{ user.role }}</td>
              <td>{{ user.major }}</td>
              <td>{{ user.gender }}</td>
              <td>{{ user.contact }}</td>
              <td>{{ user.status }}</td>
              <td>
                <button @click="editUser(user)" class="edit-btn">编辑</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 编辑用户表单 -->
      <div v-if="showEditForm" class="form-overlay">
        <div class="form-container">
          <h3>编辑用户</h3>
          <form @submit.prevent="saveUser">
            <div class="form-group">
              <label for="username">用户名</label>
              <input type="text" id="username" v-model="userForm.username" disabled>
            </div>
            <div class="form-group">
              <label for="password">密码</label>
              <input type="password" id="password" v-model="userForm.password" placeholder="留空表示不修改">
            </div>
            <div class="form-group">
              <label for="name">姓名</label>
              <input type="text" id="name" v-model="userForm.name" required>
            </div>
            <div class="form-group">
              <label for="club">社团</label>
              <input type="text" id="club" v-model="userForm.club" required>
            </div>
            <div class="form-group">
              <label for="role">角色</label>
              <select id="role" v-model="userForm.role" required>
                <option value="系统管理员">系统管理员</option>
                <option value="社团负责人">社团负责人</option>
                <option value="社团指导老师">社团指导老师</option>
                <option value="普通成员">普通成员</option>
              </select>
            </div>
            <div class="form-group">
              <label for="major">专业</label>
              <input type="text" id="major" v-model="userForm.major" required>
            </div>
            <div class="form-group">
              <label for="gender">性别</label>
              <select id="gender" v-model="userForm.gender" required>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
            <div class="form-group">
              <label for="contact">联系方式</label>
              <input type="text" id="contact" v-model="userForm.contact" required>
            </div>
            <div class="form-group">
              <label for="status">状态</label>
              <select id="status" v-model="userForm.status" required>
                <option value="已激活">已激活</option>
                <option value="待审批">待审批</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="submit" class="save-btn">保存</button>
              <button type="button" @click="showEditForm = false" class="cancel-btn">取消</button>
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
const users = ref([])
const showEditForm = ref(false)
const userForm = ref({})

const handleLogout = () => {
  localStorage.removeItem('currentUser')
  router.push('/login')
}

const editUser = (user) => {
  userForm.value = { ...user }
  showEditForm.value = true
}

const saveUser = () => {
  // 更新users数组
  const usersList = JSON.parse(localStorage.getItem('users') || '[]')
  const userIndex = usersList.findIndex(u => u.username === userForm.value.username)
  if (userIndex !== -1) {
    usersList[userIndex] = userForm.value
    localStorage.setItem('users', JSON.stringify(usersList))
  }
  
  // 更新members数组
  const membersList = JSON.parse(localStorage.getItem('members') || '[]')
  const memberIndex = membersList.findIndex(m => m.username === userForm.value.username)
  if (memberIndex !== -1) {
    membersList[memberIndex] = userForm.value
    localStorage.setItem('members', JSON.stringify(membersList))
  }
  
  // 更新本地用户列表
  const localIndex = users.value.findIndex(u => u.username === userForm.value.username)
  if (localIndex !== -1) {
    users.value[localIndex] = userForm.value
  }
  
  showEditForm.value = false
  alert('用户信息更新成功')
}

onMounted(() => {
  // 获取当前登录用户
  const user = localStorage.getItem('currentUser')
  if (user) {
    currentUser.value = JSON.parse(user)
    if (currentUser.value.role !== '系统管理员') {
      router.push('/')
    }
  } else {
    router.push('/login')
  }
  
  // 加载用户数据
  const usersData = JSON.parse(localStorage.getItem('users') || '[]')
  users.value = usersData
})
</script>

<style scoped>
.users-container {
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

.users-list {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.users-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.edit-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  background-color: #2196F3;
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
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-group input:disabled {
  background-color: #f2f2f2;
  cursor: not-allowed;
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