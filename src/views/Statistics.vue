<template>
  <div class="statistics-container">
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
      <h2>统计分析</h2>
      
      <!-- 筛选器 -->
      <div class="filter-section">
        <select v-model="filterClub" class="filter-select">
          <option value="">所有社团</option>
          <option value="计算机协会">计算机协会</option>
          <option value="文学社">文学社</option>
          <option value="篮球队">篮球队</option>
          <option value="足球队">足球队</option>
          <option value="辩论社">辩论社</option>
        </select>
      </div>

      <!-- 统计图表 -->
      <div class="charts-section">
        <div class="chart-card">
          <h3>社团成员分布</h3>
          <div ref="memberDistributionChart" class="chart"></div>
        </div>
        <div class="chart-card">
          <h3>社团活动统计</h3>
          <div ref="activityChart" class="chart"></div>
        </div>
      </div>

      <!-- 详细统计数据 -->
      <div class="stats-details">
        <h3>详细统计数据</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">总成员数</span>
            <span class="stat-value">{{ totalMembers }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">已激活成员</span>
            <span class="stat-value">{{ activeMembers }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">待审批成员</span>
            <span class="stat-value">{{ pendingMembers }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">总活动数</span>
            <span class="stat-value">{{ totalActivities }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'

const router = useRouter()
const currentUser = ref(null)
const filterClub = ref('')
const memberDistributionChart = ref(null)
const activityChart = ref(null)
const memberChartInstance = ref(null)
const activityChartInstance = ref(null)

const totalMembers = computed(() => {
  const members = JSON.parse(localStorage.getItem('members') || '[]')
  return members.filter(m => m.role !== '系统管理员').length
})

const activeMembers = computed(() => {
  const members = JSON.parse(localStorage.getItem('members') || '[]')
  return members.filter(m => m.status === '已激活' && m.role !== '系统管理员').length
})

const pendingMembers = computed(() => {
  const members = JSON.parse(localStorage.getItem('members') || '[]')
  return members.filter(m => m.status === '待审批').length
})

const totalActivities = computed(() => {
  const activities = JSON.parse(localStorage.getItem('activities') || '[]')
  return activities.length
})

const handleLogout = () => {
  localStorage.removeItem('currentUser')
  router.push('/login')
}

const initMemberDistributionChart = () => {
  if (memberDistributionChart.value) {
    memberChartInstance.value = echarts.init(memberDistributionChart.value)
    
    const members = JSON.parse(localStorage.getItem('members') || '[]')
    const clubMembers = {}
    
    members.forEach(member => {
      if (member.club && member.role !== '系统管理员') {
        if (!clubMembers[member.club]) {
          clubMembers[member.club] = 0
        }
        clubMembers[member.club]++
      }
    })
    
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: Object.keys(clubMembers)
      },
      series: [
        {
          name: '成员分布',
          type: 'pie',
          radius: '50%',
          data: Object.entries(clubMembers).map(([club, count]) => ({
            value: count,
            name: club
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    
    memberChartInstance.value.setOption(option)
  }
}

const initActivityChart = () => {
  if (activityChart.value) {
    activityChartInstance.value = echarts.init(activityChart.value)
    
    const activities = JSON.parse(localStorage.getItem('activities') || '[]')
    const clubActivities = {}
    
    activities.forEach(activity => {
      if (activity.club) {
        if (!clubActivities[activity.club]) {
          clubActivities[activity.club] = 0
        }
        clubActivities[activity.club]++
      }
    })
    
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: Object.keys(clubActivities)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '活动数量',
          type: 'bar',
          data: Object.values(clubActivities),
          itemStyle: {
            color: '#4CAF50'
          }
        }
      ]
    }
    
    activityChartInstance.value.setOption(option)
  }
}

watch(filterClub, () => {
  // 筛选功能实现
  initMemberDistributionChart()
  initActivityChart()
})

onMounted(() => {
  // 获取当前登录用户
  const user = localStorage.getItem('currentUser')
  if (user) {
    currentUser.value = JSON.parse(user)
  } else {
    router.push('/login')
  }
  
  // 初始化图表
  setTimeout(() => {
    initMemberDistributionChart()
    initActivityChart()
  }, 100)
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    memberChartInstance.value?.resize()
    activityChartInstance.value?.resize()
  })
})
</script>

<style scoped>
.statistics-container {
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
  margin-bottom: 20px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.chart-card {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-card h3 {
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.chart {
  height: 400px;
}

.stats-details h3 {
  margin-bottom: 20px;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-item {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-label {
  display: block;
  color: #666;
  margin-bottom: 10px;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #4CAF50;
}
</style>