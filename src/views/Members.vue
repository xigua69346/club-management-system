<template>
  <div class="members-container">
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
      <h2>成员管理</h2>
      
      <!-- 筛选器 -->
      <div class="filter-section">
        <select v-model="filterRole" class="filter-select">
          <option value="">所有角色</option>
          <option value="普通成员">普通成员</option>
          <option value="社团负责人">社团负责人</option>
          <option value="社团指导老师">社团指导老师</option>
        </select>
        <select v-model="filterStatus" class="filter-select">
          <option value="">所有状态</option>
          <option value="已激活">已激活</option>
          <option value="待审批">待审批</option>
        </select>
      </div>

      <!-- 成员列表 -->
      <div class="members-list">
        <table class="members-table">
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
            <tr v-for="member in filteredMembers" :key="member.id || member.username">
              <td>{{ member.username }}</td>
              <td>{{ member.name }}</td>
              <td>{{ member.club }}</td>
              <td>{{ member.role }}</td>
              <td>{{ member.major }}</td>
              <td>{{ member.gender }}</td>
              <td>{{ member.contact }}</td>
              <td>{{ member.status }}</td>
              <td>
                <button v-if="member.status === '待审批' && (currentUser.role === '社团负责人' || currentUser.role === '社团指导老师')" @click="approveMember(member)" class="approve-btn">同意</button>
                <button v-if="member.status === '待审批' && (currentUser.role === '社团负责人' || currentUser.role === '社团指导老师')" @click="rejectMember(member)" class="reject-btn">拒绝</button>
                <button v-if="currentUser.role === '系统管理员' || currentUser.role === '社团负责人' || currentUser.role === '社团指导老师'" @click="editMember(member)" class="edit-btn">编辑</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 编辑成员表单 -->
      <div v-if="showEditForm" class="form-overlay">
        <div class="form-container">
          <h3>编辑成员</h3>
          <form @submit.prevent="saveMember">
            <div class="form-group">
              <label for="username">用户名</label>
              <input type="text" id="username" v-model="memberForm.username" disabled>
            </div>
            <div class="form-group">
              <label for="name">姓名</label>
              <input type="text" id="name" v-model="memberForm.name" required>
            </div>
            <div class="form-group">
              <label for="club">社团</label>
              <input type="text" id="club" v-model="memberForm.club" required>
            </div>
            <div class="form-group">
              <label for="role">角色</label>
              <select id="role" v-model="memberForm.role" required>
                <option value="普通成员">普通成员</option>
                <option value="社团负责人">社团负责人</option>
                <option value="社团指导老师">社团指导老师</option>
              </select>
            </div>
            <div class="form-group">
              <label for="major">专业</label>
              <input type="text" id="major" v-model="memberForm.major" required>
            </div>
            <div class="form-group">
              <label for="gender">性别</label>
              <select id="gender" v-model="memberForm.gender" required>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
            <div class="form-group">
              <label for="contact">联系方式</label>
              <input type="text" id="contact" v-model="memberForm.contact" required>
            </div>
            <div class="form-group">
              <label for="status">状态</label>
              <select id="status" v-model="memberForm.status" required>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentUser = ref(null)
const members = ref([])
const filterRole = ref('')
const filterStatus = ref('')
const showEditForm = ref(false)
const memberForm = ref({})

const filteredMembers = computed(() => {
  let result = [...members.value]
  
  // 按角色筛选
  if (filterRole.value) {
    result = result.filter(member => member.role === filterRole.value)
  }
  
  // 按状态筛选
  if (filterStatus.value) {
    result = result.filter(member => member.status === filterStatus.value)
  }
  
  // 普通成员只能看到除自己以外的成员
  if (currentUser.value && currentUser.value.role === '普通成员') {
    result = result.filter(member => member.username !== currentUser.value.username)
  }
  
  return result
})

const handleLogout = () => {
  localStorage.removeItem('currentUser')
  router.push('/login')
}

const approveMember = (member) => {
  if (confirm('确定要同意这个成员的申请吗？')) {
    member.status = '已激活'
    updateMemberInStorage(member)
  }
}

const rejectMember = (member) => {
  if (confirm('确定要拒绝这个成员的申请吗？')) {
    member.status = '已拒绝'
    updateMemberInStorage(member)
  }
}

const editMember = (member) => {
  memberForm.value = { ...member }
  showEditForm.value = true
}

const saveMember = () => {
  updateMemberInStorage(memberForm.value)
  showEditForm.value = false
  alert('成员信息更新成功')
}

const updateMemberInStorage = (updatedMember) => {
  // 更新members数组
  const membersList = JSON.parse(localStorage.getItem('members') || '[]')
  const memberIndex = membersList.findIndex(m => m.username === updatedMember.username)
  if (memberIndex !== -1) {
    membersList[memberIndex] = updatedMember
    localStorage.setItem('members', JSON.stringify(membersList))
  }
  
  // 更新users数组
  const usersList = JSON.parse(localStorage.getItem('users') || '[]')
  const userIndex = usersList.findIndex(u => u.username === updatedMember.username)
  if (userIndex !== -1) {
    usersList[userIndex] = updatedMember
    localStorage.setItem('users', JSON.stringify(usersList))
  }
  
  // 更新本地成员列表
  const localIndex = members.value.findIndex(m => m.username === updatedMember.username)
  if (localIndex !== -1) {
    members.value[localIndex] = updatedMember
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
  
  // 加载成员数据
  const membersData = JSON.parse(localStorage.getItem('members') || '[]')
  members.value = membersData
})
</script>

<style scoped>
.members-container {
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

.filter-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.members-list {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.members-table {
  width: 100%;
  border-collapse: collapse;
}

.members-table th,
.members-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.members-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.approve-btn,
.reject-btn,
.edit-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
  font-weight: bold;
  font-size: 12px;
}

.approve-btn {
  background-color: #4CAF50;
  color: white;
}

.reject-btn {
  background-color: #f44336;
  color: white;
}

.edit-btn {
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