<template>
  <div class="home">
    <div class="card">
      <h2>欢迎使用高校社团信息管理系统</h2>
      <p>本系统为高校社团提供全方位的管理功能，包括社团管理、成员管理、活动管理、资料管理和统计分析等，帮助社团实现信息化管理，提高管理效率。</p>
      <div class="features">
        <div class="feature-item">
          <h3>社团管理</h3>
          <p>社团注册、分类、编辑、注销、审核</p>
        </div>
        <div class="feature-item">
          <h3>成员管理</h3>
          <p>成员报名、审核、分组、退社登记</p>
        </div>
        <div class="feature-item">
          <h3>活动管理</h3>
          <p>活动创建、审批、签到、统计</p>
        </div>
        <div class="feature-item">
          <h3>资料管理</h3>
          <p>资料上传、分类归档、预览下载</p>
        </div>
        <div class="feature-item">
          <h3>统计分析</h3>
          <p>成员统计、活动统计、经费统计</p>
        </div>
        <div class="feature-item">
          <h3>消息通知</h3>
          <p>活动通知、审批结果、系统提醒</p>
        </div>
      </div>
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
    
    <div class="card">
      <h2>社团列表</h2>
      <div class="clubs-list">
        <div class="club-card" v-for="club in clubs" :key="club.id">
          <h3>{{ club.name }}</h3>
          <p><strong>类别：</strong>{{ club.category }}</p>
          <p><strong>成立日期：</strong>{{ club.establishmentDate }}</p>
          <p><strong>负责人：</strong>{{ club.leader }}</p>
          <p><strong>指导老师：</strong>{{ club.advisor }}</p>
          <p><strong>成员数量：</strong>{{ club.memberCount }}</p>
          <p><strong>状态：</strong>{{ club.status }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      stats: {
        totalClubs: 0,
        totalMembers: 0,
        totalActivities: 0,
        totalMaterials: 0
      },
      clubs: []
    }
  },
  mounted() {
    // 组件挂载时加载统计数据和社团数据
    this.updateStats();
    this.loadClubs();
    // 监听localStorage变化
    window.addEventListener('storage', this.handleStorageChange);
  },
  beforeUnmount() {
    // 组件卸载时移除监听器
    window.removeEventListener('storage', this.handleStorageChange);
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
      
      // 成员总数（只统计非系统管理员的用户）
      const usersData = localStorage.getItem('users');
      let totalMembers = 0;
      
      // 只从users中统计（users是主数据源）
      if (usersData) {
        const users = JSON.parse(usersData);
        // 只统计非系统管理员的用户
        totalMembers = users.filter(u => u.role !== 'admin').length;
      }
      
      this.stats.totalMembers = totalMembers;
      
      // 活动总数
      const activitiesData = localStorage.getItem('activities');
      if (activitiesData) {
        const activities = JSON.parse(activitiesData);
        this.stats.totalActivities = activities.length;
      } else {
        this.stats.totalActivities = 0;
      }
      
      // 资料总数
      const materialsData = localStorage.getItem('materials');
      if (materialsData) {
        const materials = JSON.parse(materialsData);
        this.stats.totalMaterials = materials.length;
      } else {
        this.stats.totalMaterials = 0;
      }
    },
    loadClubs() {
      // 从localStorage读取社团数据
      const clubsData = localStorage.getItem('clubs');
      const usersData = localStorage.getItem('users');
      const membersData = localStorage.getItem('members');
      
      let clubs = [];
      
      if (clubsData) {
        clubs = JSON.parse(clubsData);
      } else {
        // 初始社团数据
        const initialClubs = [
          { id: 1, name: '计算机协会', category: '学术科技', establishmentDate: '2020-09-01', leader: '张三', advisor: '王老师', memberCount: 0, status: '正常' },
          { id: 2, name: '文学社', category: '文化艺术', establishmentDate: '2019-09-01', leader: '李四', advisor: '李老师', memberCount: 0, status: '正常' },
          { id: 3, name: '篮球队', category: '体育健身', establishmentDate: '2018-09-01', leader: '王五', advisor: '张老师', memberCount: 0, status: '正常' },
          { id: 4, name: '志愿者协会', category: '公益服务', establishmentDate: '2021-09-01', leader: '赵六', advisor: '刘老师', memberCount: 0, status: '正常' },
          { id: 5, name: '摄影社', category: '文化艺术', establishmentDate: '2022-09-01', leader: '孙七', advisor: '陈老师', memberCount: 0, status: '正常' }
        ];
        // 保存初始社团数据到localStorage
        localStorage.setItem('clubs', JSON.stringify(initialClubs));
        clubs = initialClubs;
      }
      
      // 计算每个社团的实际成员数量
      clubs.forEach(club => {
        let count = 0;
        
        // 从users中统计
        if (usersData) {
          const users = JSON.parse(usersData);
          users.forEach(user => {
            if (user.role !== 'admin' && user.club === club.name && user.status === '活跃') {
              count++;
            }
          });
        }
        
        // 从members中统计
        if (membersData) {
          const members = JSON.parse(membersData);
          members.forEach(member => {
            if (member.club === club.name && member.status === '活跃') {
              count++;
            }
          });
        }
        
        // 去重（避免重复计数）
        const uniqueMembers = new Set();
        if (usersData) {
          const users = JSON.parse(usersData);
          users.forEach(user => {
            if (user.role !== 'admin' && user.club === club.name && user.status === '活跃') {
              uniqueMembers.add(user.username);
            }
          });
        }
        
        if (membersData) {
          const members = JSON.parse(membersData);
          members.forEach(member => {
            if (member.club === club.name && member.status === '活跃') {
              uniqueMembers.add(member.username || member.name);
            }
          });
        }
        
        club.memberCount = uniqueMembers.size;
      });
      
      this.clubs = clubs;
    },
    handleStorageChange(event) {
      // 当localStorage中的数据发生变化时，重新计算统计值和加载社团数据
      if (['clubs', 'members', 'activities', 'materials', 'users'].includes(event.key)) {
        this.updateStats();
        if (event.key === 'clubs') {
          this.loadClubs();
        }
      }
    }
  }
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.feature-item {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.feature-item h3 {
  color: #3498db;
  margin-bottom: 0.5rem;
}

.clubs-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.club-card {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #3498db;
  transition: transform 0.3s, box-shadow 0.3s;
}

.club-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.club-card h3 {
  color: #3498db;
  margin-bottom: 1rem;
}

.club-card p {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}
</style>