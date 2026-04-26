<template>
  <div class="register-container">
    <div class="register-form">
      <h2>注册新账号</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">用户名</label>
          <input type="text" id="username" v-model="registerForm.username" required>
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input type="password" id="password" v-model="registerForm.password" required>
        </div>
        <div class="form-group">
          <label for="name">姓名</label>
          <input type="text" id="name" v-model="registerForm.name" required>
        </div>
        <div class="form-group">
          <label for="club">所属社团</label>
          <select id="club" v-model="registerForm.club" required>
            <option value="">请选择社团</option>
            <option value="计算机协会">计算机协会</option>
            <option value="文学社">文学社</option>
            <option value="篮球队">篮球队</option>
            <option value="足球队">足球队</option>
            <option value="辩论社">辩论社</option>
          </select>
        </div>
        <div class="form-group">
          <label for="role">角色</label>
          <select id="role" v-model="registerForm.role" required>
            <option value="普通成员">普通成员</option>
            <option value="社团负责人">社团负责人</option>
            <option value="社团指导老师">社团指导老师</option>
          </select>
        </div>
        <div class="form-group">
          <label for="major">专业</label>
          <input type="text" id="major" v-model="registerForm.major" required>
        </div>
        <div class="form-group">
          <label for="contact">联系方式</label>
          <input type="text" id="contact" v-model="registerForm.contact" required>
        </div>
        <div class="form-group">
          <label for="gender">性别</label>
          <select id="gender" v-model="registerForm.gender" required>
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>
        <button type="submit" class="register-btn">注册</button>
      </form>
      <div class="login-link">
        已有账号？<router-link to="/login">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const registerForm = ref({
  username: '',
  password: '',
  name: '',
  club: '',
  role: '普通成员',
  major: '',
  contact: '',
  gender: '男',
  status: '待审批'
})

const handleRegister = () => {
  // 从localStorage获取用户数据
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  
  // 检查用户名是否已存在
  if (users.some(u => u.username === registerForm.value.username)) {
    alert('用户名已存在')
    return
  }
  
  // 添加新用户
  users.push(registerForm.value)
  localStorage.setItem('users', JSON.stringify(users))
  
  // 同时添加到成员列表
  const members = JSON.parse(localStorage.getItem('members') || '[]')
  members.push({
    id: Date.now(),
    ...registerForm.value
  })
  localStorage.setItem('members', JSON.stringify(members))
  
  alert('注册成功，等待审批后即可登录')
  router.push('/login')
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.register-form {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.register-form h2 {
  text-align: center;
  margin-bottom: 30px;
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

.register-btn {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.register-btn:hover {
  background-color: #45a049;
}

.login-link {
  margin-top: 20px;
  text-align: center;
  color: #666;
}

.login-link a {
  color: #4CAF50;
  text-decoration: none;
  font-weight: bold;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>