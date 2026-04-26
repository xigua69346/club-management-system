<template>
  <div class="home-container">
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
      <!-- 统计卡片 -->
      <div class="stats-cards">
        <div class="stat-card">
          <h3>社团总数</h3>
          <p>{{ clubCount }}</p>
        </div>
        <div class="stat-card">
          <h3>成员总数</h3>
          <p>{{ memberCount }}</p>
        </div>
        <div class="stat-card">
          <h3>活动总数</h3>
          <p>{{ activityCount }}</p>
        </div>
        <div class="stat-card">
          <h3>待审批成员</h3>
          <p>{{ pendingMembersCount }}</p>
        </div>
      </div>

      <!-- 社团列表 -->
      <div class="clubs-section">
        <h2>社团列表</h2>
        <div class="clubs-grid">
          <div v-for="club in clubs" :key="club.id" class="club-card">
            <h3>{{ club.name }}</h3>
            <p>{{ club.description }}</p>
            <div class="club-info">
              <span>负责人: {{ club.leader }}</span>
              <span>成员数: {{ club.memberCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
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

const clubCount = computed(() => clubs.value.length)

const memberCount = computed(() => {
  const members = JSON.parse(localStorage.getItem('members') || '[]')
  return members.filter(m => m.role !== '系统管理员').length
})

const activityCount = computed(() => {
  const activities = JSON.parse(localStorage.getItem('activities') || '[]')
  return activities.length
})

const pendingMembersCount = computed(() => {
  const members = JSON.parse(localStorage.getItem('members') || '[]')
  return members.filter(m => m.status === '待审批').length
})

const handleLogout = () => {
  localStorage.removeItem('currentUser')
  router.push('/login')
}

onMounted(() => {
  // 获取当前登录用户
  const user = localStorage.getItem('currentUser')
  if (user) {
    currentUser.value = JSON.parse(user)
  }
  
  // 初始化默认用户数据
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  if (users.length === 0) {
    const defaultUsers = [
      {
        username: 'admin',
        password: 'admin123',
        name: '系统管理员',
        club: '',
        role: '系统管理员',
        major: '',
        contact: '',
        gender: '男',
        status: '已激活'
      },
      {
        username: 'zhangsan',
        password: '123456',
        name: '张三',
        club: '计算机协会',
        role: '社团负责人',
        major: '计算机科学与技术',
        contact: '13800138001',
        gender: '男',
        status: '已激活'
      },
      {
        username: 'lisi',
        password: '123456',
        name: '李四',
        club: '文学社',
        role: '社团负责人',
        major: '汉语言文学',
        contact: '13800138002',
        gender: '女',
        status: '已激活'
      },
      {
        username: 'wanglaoshi',
        password: '123456',
        name: '王老师',
        club: '计算机协会',
        role: '社团指导老师',
        major: '',
        contact: '13800138003',
        gender: '男',
        status: '已激活'
      }
    ]
    localStorage.setItem('users', JSON.stringify(defaultUsers))
    localStorage.setItem('members', JSON.stringify(defaultUsers))
  }
})
</script>

<style scoped>
.home-container {
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

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card h3 {
  color: #666;
  margin-bottom: 10px;
}

.stat-card p {
  font-size: 24px;
  font-weight: bold;
  color: #4CAF50;
}

.clubs-section h2 {
  margin-bottom: 20px;
  color: #333;
}

.clubs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.club-card {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.club-card:hover {
  transform: translateY(-5px);
}

.club-card h3 {
  color: #333;
  margin-bottom: 10px;
}

.club-card p {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.4;
}

.club-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #888;
}
</style>