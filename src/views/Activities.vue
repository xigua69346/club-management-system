<template>
  <div class="activities">
    <div class="card">
      <h2>活动管理</h2>
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="搜索活动..."
        />
        <select v-model="clubFilter" v-if="userRole === 'admin'">
          <option value="">全部社团</option>
          <option value="计算机协会">计算机协会</option>
          <option value="文学社">文学社</option>
          <option value="篮球队">篮球队</option>
          <option value="志愿者协会">志愿者协会</option>
          <option value="摄影社">摄影社</option>
        </select>
        <select v-model="statusFilter">
          <option value="">全部状态</option>
          <option value="待审批">待审批</option>
          <option value="已审批">已审批</option>
          <option value="已结束">已结束</option>
        </select>
        <router-link to="/add-activity" class="btn btn-primary" v-if="userRole === 'admin' || userRole === 'leader'">添加活动</router-link>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>活动名称</th>
            <th>社团</th>
            <th>负责人</th>
            <th>开始时间</th>
            <th>结束时间</th>
            <th>地点</th>
            <th>预算</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="activity in filteredActivities" :key="activity.id">
            <td>{{ activity.name }}</td>
            <td>{{ activity.club }}</td>
            <td>{{ activity.leader }}</td>
            <td>{{ activity.startTime }}</td>
            <td>{{ activity.endTime }}</td>
            <td>{{ activity.location }}</td>
            <td>{{ activity.budget }}</td>
            <td>{{ activity.status }}</td>
            <td>
              <router-link :to="`/edit-activity/${activity.id}`" class="btn btn-primary" v-if="canEdit(activity)">编辑</router-link>
              <button @click="deleteActivity(activity.id)" class="btn btn-danger" v-if="canEdit(activity)">删除</button>
              <button @click="generateQRCode(activity.id)" class="btn btn-secondary" v-if="activity.status === '已审批' && canEdit(activity)">生成签到码</button>
              <button @click="approveActivity(activity.id)" class="btn btn-success" v-if="canApprove(activity)">批准</button>
              <button @click="rejectActivity(activity.id)" class="btn btn-warning" v-if="canApprove(activity)">拒绝</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredActivities.length === 0" class="empty-state">
        <p>没有找到活动</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Activities',
  data() {
    return {
      searchTerm: '',
      clubFilter: '',
      statusFilter: '',
      activities: []
    }
  },
  mounted() {
    // 组件挂载时加载活动数据
    this.loadActivities();
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
    },
    filteredActivities() {
      return this.activities.filter(activity => {
        // 系统管理员可以查看所有活动
        if (this.userRole === 'admin') {
          const matchesSearch = activity.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                               activity.location.toLowerCase().includes(this.searchTerm.toLowerCase());
          const matchesClub = !this.clubFilter || activity.club === this.clubFilter;
          const matchesStatus = !this.statusFilter || activity.status === this.statusFilter;
          return matchesSearch && matchesClub && matchesStatus;
        }
        // 其他角色只能查看自己社团的活动
        else if (this.userRole === 'advisor' || this.userRole === 'leader' || this.userRole === 'member') {
          const matchesClub = activity.club === this.userClub;
          const matchesSearch = activity.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                               activity.location.toLowerCase().includes(this.searchTerm.toLowerCase());
          const matchesStatus = !this.statusFilter || activity.status === this.statusFilter;
          return matchesClub && matchesSearch && matchesStatus;
        }
        return false;
      });
    }
  },
  methods: {
    loadActivities() {
      // 从localStorage读取活动数据
      const activitiesData = localStorage.getItem('activities');
      if (activitiesData) {
        this.activities = JSON.parse(activitiesData);
      } else {
        // 初始活动数据
        const initialActivities = [
          { id: 1, name: '编程大赛', club: '计算机协会', leader: '张三', startTime: '2026-04-10 14:00', endTime: '2026-04-10 18:00', location: '教学楼A101', budget: '1000', status: '已审批' },
          { id: 2, name: '文学讲座', club: '文学社', leader: '李四', startTime: '2026-04-12 15:00', endTime: '2026-04-12 17:00', location: '图书馆报告厅', budget: '500', status: '待审批' },
          { id: 3, name: '篮球友谊赛', club: '篮球队', leader: '王五', startTime: '2026-04-15 16:00', endTime: '2026-04-15 18:00', location: '体育馆', budget: '800', status: '已审批' },
          { id: 4, name: '社区服务', club: '志愿者协会', leader: '赵六', startTime: '2026-04-18 09:00', endTime: '2026-04-18 12:00', location: '阳光社区', budget: '300', status: '已审批' },
          { id: 5, name: '摄影展', club: '摄影社', leader: '孙七', startTime: '2026-04-20 10:00', endTime: '2026-04-22 17:00', location: '艺术楼展厅', budget: '1200', status: '待审批' }
        ];
        // 保存初始活动数据到localStorage
        localStorage.setItem('activities', JSON.stringify(initialActivities));
        this.activities = initialActivities;
      }
    },
    handleStorageChange(event) {
      // 当localStorage中的activities发生变化时，重新加载活动数据
      if (event.key === 'activities') {
        this.loadActivities();
      }
    },
    canEdit(activity) {
      // 系统管理员可以编辑所有活动
      if (this.userRole === 'admin') {
        return true;
      }
      // 社团指导老师和负责人只能编辑自己社团的活动
      else if ((this.userRole === 'advisor' || this.userRole === 'leader') && activity.club === this.userClub) {
        return true;
      }
      return false;
    },
    canApprove(activity) {
      // 系统管理员可以审批所有活动
      if (this.userRole === 'admin') {
        return activity.status === '待审批';
      }
      // 社团指导老师只能审批自己社团的待审批活动
      else if (this.userRole === 'advisor' && activity.club === this.userClub) {
        return activity.status === '待审批';
      }
      return false;
    },
    deleteActivity(id) {
      if (confirm('确定要删除该活动吗？')) {
        this.activities = this.activities.filter(activity => activity.id !== id);
        // 保存更新后的活动数据到localStorage
        localStorage.setItem('activities', JSON.stringify(this.activities));
      }
    },
    approveActivity(id) {
      if (confirm('确定要批准该活动吗？')) {
        const activity = this.activities.find(a => a.id === id);
        if (activity) {
          activity.status = '已审批';
          // 保存更新后的活动数据到localStorage
          localStorage.setItem('activities', JSON.stringify(this.activities));
          alert('活动已批准！');
        }
      }
    },
    rejectActivity(id) {
      if (confirm('确定要拒绝该活动吗？')) {
        const activity = this.activities.find(a => a.id === id);
        if (activity) {
          activity.status = '已拒绝';
          // 保存更新后的活动数据到localStorage
          localStorage.setItem('activities', JSON.stringify(this.activities));
          alert('活动已拒绝！');
        }
      }
    },
    generateQRCode(id) {
      // 这里可以添加生成二维码的逻辑
      alert('签到二维码已生成！');
    }
  }
}
</script>

<style scoped>
.activities {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #95a5a6;
}
</style>