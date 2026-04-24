<template>
  <div class="statistics">
    <div class="card">
      <h2>统计分析</h2>
      
      <div class="filter-container">
        <label for="clubFilter">社团筛选:</label>
        <select id="clubFilter" v-model="clubFilter" @change="updateStatsAndCharts">
          <option value="">全部社团</option>
          <option v-for="club in clubs" :key="club.id" :value="club.name">{{ club.name }}</option>
        </select>
      </div>
      
      <div class="stats-container">
        <div class="stat-card">
          <h3>社团总数</h3>
          <div class="stat-value">{{ stats.totalClubs }}</div>
        </div>
        <div class="stat-card">
          <h3>成员总数</h3>
          <div class="stat-value">{{ stats.totalMembers }}</div>
        </div>
        <div class="stat-card">
          <h3>活动总数</h3>
          <div class="stat-value">{{ stats.totalActivities }}</div>
        </div>
        <div class="stat-card">
          <h3>资料总数</h3>
          <div class="stat-value">{{ stats.totalMaterials }}</div>
        </div>
      </div>
      
      <h3>成员统计</h3>
      <div class="chart-container">
        <div class="chart-item">
          <h4>成员性别比例</h4>
          <div ref="genderChart" class="chart"></div>
        </div>
        <div class="chart-item">
          <h4>成员专业分布</h4>
          <div ref="majorChart" class="chart"></div>
        </div>
        <div class="chart-item">
          <h4>成员活跃度</h4>
          <div ref="activityChart" class="chart"></div>
        </div>
      </div>
      
      <h3>活动统计</h3>
      <div class="chart-container">
        <div class="chart-item full-width">
          <h4>活动数量趋势</h4>
          <div ref="activityTrendChart" class="chart"></div>
        </div>
        <div class="chart-item">
          <h4>活动类型分布</h4>
          <div ref="activityTypeChart" class="chart"></div>
        </div>
        <div class="chart-item">
          <h4>活动参与人数</h4>
          <div ref="participationChart" class="chart"></div>
        </div>
      </div>
      
      <h3>经费统计</h3>
      <div class="chart-container">
        <div class="chart-item full-width">
          <h4>经费收支情况</h4>
          <div ref="budgetChart" class="chart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'Statistics',
  data() {
    return {
      stats: {
        totalClubs: 0,
        totalMembers: 0,
        totalActivities: 0,
        totalMaterials: 0
      },
      clubFilter: '',
      clubs: [],
      genderChart: null,
      majorChart: null,
      activityChart: null,
      activityTrendChart: null,
      activityTypeChart: null,
      participationChart: null,
      budgetChart: null
    }
  },
  mounted() {
    // 组件挂载时加载统计数据
    this.updateStats();
    // 初始化图表
    this.initCharts();
    // 监听localStorage变化
    window.addEventListener('storage', this.handleStorageChange);
  },
  beforeUnmount() {
    // 组件卸载时移除监听器
    window.removeEventListener('storage', this.handleStorageChange);
  },
  computed: {
    userInfo() {
      const userInfo = localStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    },
    userRole() {
      return this.userInfo ? this.userInfo.role : '';
    },
    userClub() {
      return this.userInfo ? this.userInfo.club : '';
    }
  },
  activated() {
    // 组件激活时重新加载数据（当从其他页面切换回统计分析页面时）
    this.updateStats();
    this.updateCharts();
  },
  mounted() {
    // 加载社团数据
    this.loadClubs();
    // 组件挂载时加载统计数据
    this.updateStats();
    // 初始化图表
    this.initCharts();
    // 监听localStorage变化（其他标签页修改时）
    window.addEventListener('storage', this.handleStorageChange);
    // 监听页面可见性变化（同一标签页内切换回来时）
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  },
  beforeUnmount() {
    // 组件卸载时移除监听器
    window.removeEventListener('storage', this.handleStorageChange);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  },
  methods: {
    updateStats() {
      // 从localStorage读取数据并计算统计值
      
      // 社团总数
      const clubsData = localStorage.getItem('clubs');
      if (clubsData) {
        const clubs = JSON.parse(clubsData);
        this.stats.totalClubs = clubs.length;
      } else {
        this.stats.totalClubs = 0;
      }
      
      // 成员总数（只统计非系统管理员的用户，避免重复）
      const usersData = localStorage.getItem('users');
      let totalMembers = 0;
      
      // 只从users中统计（users是主数据源）
      if (usersData) {
        const users = JSON.parse(usersData);
        // 只统计非系统管理员的用户
        let filteredUsers = users.filter(u => u.role !== 'admin');
        
        // 如果有社团筛选
        if (this.clubFilter) {
          filteredUsers = filteredUsers.filter(u => u.club === this.clubFilter);
        }
        
        totalMembers = filteredUsers.length;
      }
      
      this.stats.totalMembers = totalMembers;
      
      // 活动总数
      const activitiesData = localStorage.getItem('activities');
      if (activitiesData) {
        let activities = JSON.parse(activitiesData);
        
        // 如果有社团筛选
        if (this.clubFilter) {
          activities = activities.filter(a => a.club === this.clubFilter);
        }
        
        this.stats.totalActivities = activities.length;
      } else {
        this.stats.totalActivities = 0;
      }
      
      // 资料总数
      const materialsData = localStorage.getItem('materials');
      if (materialsData) {
        let materials = JSON.parse(materialsData);
        
        // 如果有社团筛选
        if (this.clubFilter) {
          materials = materials.filter(m => m.club === this.clubFilter);
        }
        
        this.stats.totalMaterials = materials.length;
      } else {
        this.stats.totalMaterials = 0;
      }
    },
    handleStorageChange(event) {
      // 当localStorage中的数据发生变化时，重新计算统计值并更新图表
      if (['clubs', 'members', 'activities', 'materials', 'users'].includes(event.key)) {
        if (event.key === 'clubs') {
          this.loadClubs();
        }
        this.updateStats();
        this.updateCharts();
      }
    },
    handleVisibilityChange() {
      // 当页面从不可见变为可见时，重新加载数据
      if (!document.hidden) {
        this.loadClubs();
        this.updateStats();
        this.updateCharts();
      }
    },
    loadClubs() {
      // 从localStorage读取社团数据
      const clubsData = localStorage.getItem('clubs');
      if (clubsData) {
        this.clubs = JSON.parse(clubsData);
      } else {
        this.clubs = [];
      }
    },
    updateStatsAndCharts() {
      // 更新统计数据和图表
      this.updateStats();
      this.updateCharts();
    },
    initCharts() {
      // 成员性别比例
      this.genderChart = echarts.init(this.$refs.genderChart);
      
      // 成员专业分布
      this.majorChart = echarts.init(this.$refs.majorChart);
      
      // 成员活跃度
      this.activityChart = echarts.init(this.$refs.activityChart);
      
      // 活动数量趋势
      this.activityTrendChart = echarts.init(this.$refs.activityTrendChart);
      
      // 活动类型分布
      this.activityTypeChart = echarts.init(this.$refs.activityTypeChart);
      
      // 活动参与人数
      this.participationChart = echarts.init(this.$refs.participationChart);
      
      // 经费收支情况
      this.budgetChart = echarts.init(this.$refs.budgetChart);
      
      // 更新图表数据
      this.updateCharts();
      
      // 响应式调整
      window.addEventListener('resize', () => {
        this.genderChart.resize();
        this.majorChart.resize();
        this.activityChart.resize();
        this.activityTrendChart.resize();
        this.activityTypeChart.resize();
        this.participationChart.resize();
        this.budgetChart.resize();
      });
    },
    updateCharts() {
      // 从localStorage读取数据
      const membersData = localStorage.getItem('members');
      const usersData = localStorage.getItem('users');
      const activitiesData = localStorage.getItem('activities');
      
      // 成员数据
      let members = [];
      if (membersData) {
        members = JSON.parse(membersData);
      }
      
      // 从users数据中获取社团负责人和普通成员的专业信息
      if (usersData) {
        const users = JSON.parse(usersData);
        users.forEach(user => {
          // 如果用户有专业字段且不是管理员
          if (user.major && user.role !== 'admin') {
            // 检查是否已经在members中存在
            const existingMember = members.find(m => m.username === user.username);
            if (existingMember) {
              // 更新已有成员的专业信息
              existingMember.major = user.major;
              existingMember.gender = user.gender || existingMember.gender;
              existingMember.contact = user.contact || existingMember.contact;
            } else {
              // 添加新成员（来自users但不在members中的）
              members.push({
                id: 'U' + Date.now() + Math.floor(Math.random() * 1000),
                name: user.username,
                gender: user.gender || '',
                major: user.major,
                club: user.club,
                role: user.role === 'leader' ? '负责人' : (user.role === 'member' ? '普通成员' : user.role),
                contact: user.contact || '',
                status: '活跃'
              });
            }
          }
        });
      }
      
      // 活动数据
      let activities = [];
      if (activitiesData) {
        activities = JSON.parse(activitiesData);
      }
      
      // 应用社团筛选（所有用户）
      if (this.clubFilter) {
        members = members.filter(member => member.club === this.clubFilter);
        activities = activities.filter(activity => activity.club === this.clubFilter);
      }
      
      // 去重处理，根据username或name去重
      const uniqueMembers = [];
      const memberNames = new Set();
      members.forEach(member => {
        const key = member.username || member.name;
        if (key && !memberNames.has(key)) {
          memberNames.add(key);
          uniqueMembers.push(member);
        }
      });
      
      // 更新成员性别比例图表
      this.updateGenderChart(uniqueMembers);
      
      // 更新成员专业分布图表
      this.updateMajorChart(uniqueMembers);
      
      // 更新成员活跃度图表
      this.updateActivityChart(uniqueMembers);
      
      // 更新活动数量趋势图表
      this.updateActivityTrendChart(activities);
      
      // 更新活动类型分布图表
      this.updateActivityTypeChart(activities);
      
      // 更新活动参与人数图表
      this.updateParticipationChart(activities);
      
      // 更新经费收支情况图表
      this.updateBudgetChart(activities);
    },
    updateGenderChart(members) {
      // 统计性别分布
      const genderCount = {
        '男': 0,
        '女': 0
      };
      
      members.forEach(member => {
        if (genderCount.hasOwnProperty(member.gender)) {
          genderCount[member.gender]++;
        }
      });
      
      const genderData = Object.entries(genderCount).map(([name, value]) => ({
        name, value
      }));
      
      this.genderChart.setOption({
        title: {
          text: '成员性别比例',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: '性别',
            type: 'pie',
            radius: '50%',
            data: genderData.length > 0 ? genderData : [{ value: 1, name: '无数据' }],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      });
    },
    updateMajorChart(members) {
      // 统计专业分布
      const majorCount = {};
      
      members.forEach(member => {
        if (member.major) {
          majorCount[member.major] = (majorCount[member.major] || 0) + 1;
        }
      });
      
      const majorData = Object.entries(majorCount).map(([name, value]) => ({
        name, value
      }));
      
      this.majorChart.setOption({
        title: {
          text: '成员专业分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: '专业',
            type: 'pie',
            radius: '50%',
            data: majorData.length > 0 ? majorData : [{ value: 1, name: '无数据' }],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      });
    },
    updateActivityChart(members) {
      // 统计社团成员数量
      const clubCount = {};
      
      members.forEach(member => {
        if (member.club) {
          clubCount[member.club] = (clubCount[member.club] || 0) + 1;
        }
      });
      
      const clubNames = Object.keys(clubCount);
      const clubValues = Object.values(clubCount);
      
      this.activityChart.setOption({
        title: {
          text: '成员活跃度',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: clubNames.length > 0 ? clubNames : ['无数据']
        },
        yAxis: {
          type: 'value',
          name: '活跃度'
        },
        series: [
          {
            name: '活跃度',
            type: 'bar',
            data: clubValues.length > 0 ? clubValues : [0]
          }
        ]
      });
    },
    updateActivityTrendChart(activities) {
      // 统计每月活动数量
      const monthlyCount = {
        '1月': 0, '2月': 0, '3月': 0,
        '4月': 0, '5月': 0, '6月': 0,
        '7月': 0, '8月': 0, '9月': 0,
        '10月': 0, '11月': 0, '12月': 0
      };
      
      activities.forEach(activity => {
        if (activity.startTime) {
          const month = new Date(activity.startTime).getMonth() + 1;
          const monthKey = month + '月';
          if (monthlyCount.hasOwnProperty(monthKey)) {
            monthlyCount[monthKey]++;
          }
        }
      });
      
      const months = Object.keys(monthlyCount);
      const counts = Object.values(monthlyCount);
      
      this.activityTrendChart.setOption({
        title: {
          text: '活动数量趋势',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: months
        },
        yAxis: {
          type: 'value',
          name: '活动数量'
        },
        series: [
          {
            name: '活动数量',
            type: 'line',
            data: counts
          }
        ]
      });
    },
    updateActivityTypeChart(activities) {
      // 统计活动类型分布（这里简化处理，根据活动名称推断类型）
      const typeCount = {
        '讲座': 0,
        '比赛': 0,
        '志愿服务': 0,
        '展览': 0,
        '其他': 0
      };
      
      activities.forEach(activity => {
        const name = activity.name.toLowerCase();
        if (name.includes('讲座')) {
          typeCount['讲座']++;
        } else if (name.includes('比赛') || name.includes('大赛')) {
          typeCount['比赛']++;
        } else if (name.includes('志愿') || name.includes('服务')) {
          typeCount['志愿服务']++;
        } else if (name.includes('展')) {
          typeCount['展览']++;
        } else {
          typeCount['其他']++;
        }
      });
      
      const typeData = Object.entries(typeCount).map(([name, value]) => ({
        name, value
      }));
      
      this.activityTypeChart.setOption({
        title: {
          text: '活动类型分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: '活动类型',
            type: 'pie',
            radius: '50%',
            data: typeData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      });
    },
    updateParticipationChart(activities) {
      // 简化处理，使用活动预算作为参与人数的模拟数据
      const activityNames = activities.slice(0, 5).map(activity => activity.name);
      const participationData = activities.slice(0, 5).map(activity => {
        const budget = parseFloat(activity.budget) || 0;
        return Math.floor(budget / 50); // 简单模拟，预算每50元对应1人
      });
      
      this.participationChart.setOption({
        title: {
          text: '活动参与人数',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: activityNames.length > 0 ? activityNames : ['无数据']
        },
        yAxis: {
          type: 'value',
          name: '参与人数'
        },
        series: [
          {
            name: '参与人数',
            type: 'bar',
            data: participationData.length > 0 ? participationData : [0]
          }
        ]
      });
    },
    updateBudgetChart(activities) {
      // 统计每月经费支出
      const monthlyBudget = {
        '1月': 0, '2月': 0, '3月': 0,
        '4月': 0, '5月': 0, '6月': 0
      };
      
      activities.forEach(activity => {
        if (activity.startTime && activity.budget) {
          const month = new Date(activity.startTime).getMonth() + 1;
          if (month <= 6) { // 只统计前6个月
            const monthKey = month + '月';
            monthlyBudget[monthKey] += parseFloat(activity.budget) || 0;
          }
        }
      });
      
      const months = Object.keys(monthlyBudget);
      const budgets = Object.values(monthlyBudget);
      // 简单模拟收入，收入为支出的1.2倍
      const incomes = budgets.map(budget => budget * 1.2);
      
      this.budgetChart.setOption({
        title: {
          text: '经费收支情况',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['收入', '支出'],
          top: 30
        },
        xAxis: {
          type: 'category',
          data: months
        },
        yAxis: {
          type: 'value',
          name: '金额（元）'
        },
        series: [
          {
            name: '收入',
            type: 'bar',
            data: incomes
          },
          {
            name: '支出',
            type: 'bar',
            data: budgets
          }
        ]
      });
    }
  }
}
</script>

<style scoped>
.statistics {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.filter-container {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-container label {
  font-weight: bold;
}

.filter-container select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.chart-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-item {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem;
}

.chart-item.full-width {
  grid-column: 1 / -1;
}

.chart {
  width: 100%;
  height: 300px;
}

.chart-item h4 {
  margin-bottom: 1rem;
  color: #3498db;
  text-align: center;
}
</style>