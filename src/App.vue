<template>
  <div id="app">
    <nav class="navbar">
      <div class="navbar-brand">
        <h1>高校社团信息管理系统</h1>
      </div>
      <div class="navbar-menu">
        <router-link to="/" class="navbar-item">首页</router-link>
        <router-link to="/clubs" class="navbar-item" v-if="isLoggedIn && userRole === 'admin'">社团管理</router-link>
        <router-link to="/users" class="navbar-item" v-if="isLoggedIn && userRole === 'admin'">用户管理</router-link>
        <router-link to="/members" class="navbar-item" v-if="isLoggedIn && (userRole === 'advisor' || userRole === 'leader')">成员管理</router-link>
        <router-link to="/members" class="navbar-item" v-else-if="isLoggedIn && userRole === 'member'">成员组成</router-link>
        <router-link to="/activities" class="navbar-item" v-if="isLoggedIn">活动管理</router-link>
        <router-link to="/materials" class="navbar-item" v-if="isLoggedIn">资料管理</router-link>
        <router-link to="/statistics" class="navbar-item" v-if="isLoggedIn">统计分析</router-link>
        <div class="navbar-item" v-if="isLoggedIn" style="display: flex; align-items: center; gap: 1rem;">
          <span class="user-info">
            {{ userName }} ({{ userRoleText }})
            <span v-if="userRole !== 'admin' && userClub"> - {{ userClub }}</span>
          </span>
          <a href="#" class="navbar-item" @click.prevent="logout">退出登录</a>
        </div>
        <router-link to="/login" class="navbar-item" v-if="!isLoggedIn">登录</router-link>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
    <footer class="footer">
      <p>&copy; 2026 高校社团信息管理系统</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      userInfo: null
    };
  },
  computed: {
    isLoggedIn() {
      return !!this.userInfo;
    },
    userRole() {
      return this.userInfo ? this.userInfo.role : '';
    },
    userName() {
      return this.userInfo ? this.userInfo.username : '';
    },
    userClub() {
      return this.userInfo ? this.userInfo.club : '';
    },
    userRoleText() {
      const roleMap = {
        'admin': '系统管理员',
        'advisor': '社团指导老师',
        'leader': '社团负责人',
        'member': '普通成员'
      };
      return roleMap[this.userRole] || '';
    }
  },
  mounted() {
    // 组件挂载时从localStorage读取用户信息
    this.loadUserInfo();
    // 监听localStorage变化
    window.addEventListener('storage', this.handleStorageChange);
  },
  beforeUnmount() {
    // 组件卸载时移除监听器
    window.removeEventListener('storage', this.handleStorageChange);
  },
  watch: {
    // 监听路由变化，当路由变化时重新加载用户信息
    $route() {
      this.loadUserInfo();
    }
  },
  methods: {
    loadUserInfo() {
      const userInfo = localStorage.getItem('userInfo');
      this.userInfo = userInfo ? JSON.parse(userInfo) : null;
    },
    handleStorageChange(event) {
      // 当localStorage中的userInfo发生变化时，重新加载用户信息
      if (event.key === 'userInfo') {
        this.loadUserInfo();
      }
    },
    logout() {
      localStorage.removeItem('userInfo');
      this.userInfo = null;
      this.$router.push('/login');
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  color: #333;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: #3498db;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar-brand h1 {
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-menu {
  display: flex;
  gap: 1rem;
}

.navbar-item {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.navbar-item:hover {
  background-color: rgba(255,255,255,0.1);
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.footer {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: 2rem;
}

/* 卡片样式 */
.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

/* 按钮样式 */
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background-color: #c0392b;
}

/* 表单样式 */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

/* 表格样式 */
.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.table th,
.table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.table tr:hover {
  background-color: #f5f5f5;
}

/* 搜索和筛选样式 */
.search-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.search-container input,
.search-container select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.search-container input {
  flex: 1;
  min-width: 200px;
}

/* 统计卡片样式 */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1.5rem;
  text-align: center;
}

.stat-card h3 {
  color: #3498db;
  margin-bottom: 0.5rem;
}

.stat-card .stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .navbar-menu {
    margin-top: 1rem;
    flex-wrap: wrap;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .search-container {
    flex-direction: column;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
  }
}
</style>