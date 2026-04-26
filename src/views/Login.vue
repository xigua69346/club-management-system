<template>
  <div class="login-container">
    <div class="login-form">
      <h2>高校社团信息管理系统</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名</label>
          <input type="text" id="username" v-model="username" required>
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <div class="form-group" v-if="username !== 'admin'">
          <label for="club">所属社团</label>
          <select id="club" v-model="club" required>
            <option value="">请选择社团</option>
            <option value="计算机协会">计算机协会</option>
            <option value="文学社">文学社</option>
            <option value="篮球队">篮球队</option>
            <option value="足球队">足球队</option>
            <option value="辩论社">辩论社</option>
          </select>
        </div>
        <button type="submit" class="login-btn">登录</button>
      </form>
      <div class="register-link">
        还没有账号？<router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const club = ref('')

const handleLogin = () => {
  // 从localStorage获取用户数据
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  
  // 查找匹配的用户
  const user = users.find(u => {
    if (u.username === 'admin') {
      // 系统管理员不需要验证社团
      return u.username === username.value && 
             u.password === password.value
    } else {
      // 其他用户需要验证社团
      return u.username === username.value && 
             u.password === password.value &&
             u.club === club.value
    }
  })
  
  if (user) {
    if (user.status === '待审批') {
      alert('您的账号正在审批中，请等待社团负责人或指导老师批准')
      return
    }
    
    // 保存登录状态
    localStorage.setItem('currentUser', JSON.stringify(user))
    router.push('/home')
  } else {
    alert('用户名、密码或社团选择错误')
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-form {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-form h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
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

.login-btn {
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
}

.login-btn:hover {
  background-color: #45a049;
}

.register-link {
  margin-top: 20px;
  text-align: center;
  color: #666;
}

.register-link a {
  color: #4CAF50;
  text-decoration: none;
  font-weight: bold;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>