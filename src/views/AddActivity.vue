<template>
  <div class="add-activity">
    <div class="card">
      <h2>添加活动</h2>
      <form @submit.prevent="addActivity">
        <div class="form-group">
          <label for="name">活动名称</label>
          <input type="text" id="name" v-model="activity.name" required>
        </div>
        <div class="form-group">
          <label for="club">所属社团</label>
          <select id="club" v-model="activity.club" required>
            <option value="">请选择社团</option>
            <option v-for="club in clubs" :key="club.id" :value="club.name">{{ club.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="leader">负责人</label>
          <input type="text" id="leader" v-model="activity.leader" required>
        </div>
        <div class="form-group">
          <label for="startTime">开始时间</label>
          <input type="datetime-local" id="startTime" v-model="activity.startTime" required>
        </div>
        <div class="form-group">
          <label for="endTime">结束时间</label>
          <input type="datetime-local" id="endTime" v-model="activity.endTime" required>
        </div>
        <div class="form-group">
          <label for="location">活动地点</label>
          <input type="text" id="location" v-model="activity.location" required>
        </div>
        <div class="form-group">
          <label for="description">活动描述</label>
          <textarea id="description" v-model="activity.description" rows="4" required></textarea>
        </div>
        <div class="form-group">
          <label for="budget">活动预算</label>
          <input type="number" id="budget" v-model="activity.budget" step="0.01" required>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">提交审批</button>
          <router-link to="/activities" class="btn btn-secondary">取消</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddActivity',
  data() {
    return {
      activity: {
        name: '',
        club: '',
        leader: '',
        startTime: '',
        endTime: '',
        location: '',
        description: '',
        budget: ''
      },
      clubs: []
    }
  },
  mounted() {
    // 组件挂载时加载社团数据
    this.loadClubs();
  },
  methods: {
    loadClubs() {
      // 从localStorage读取社团数据
      const clubsData = localStorage.getItem('clubs');
      if (clubsData) {
        this.clubs = JSON.parse(clubsData);
      } else {
        // 初始社团数据
        const initialClubs = [
          { id: 1, name: '计算机协会', category: '学术科技', establishmentDate: '2020-09-01', leader: '张三', advisor: '王老师', memberCount: 120, status: '正常' },
          { id: 2, name: '文学社', category: '文化艺术', establishmentDate: '2019-09-01', leader: '李四', advisor: '李老师', memberCount: 80, status: '正常' },
          { id: 3, name: '篮球队', category: '体育健身', establishmentDate: '2018-09-01', leader: '王五', advisor: '张老师', memberCount: 30, status: '正常' },
          { id: 4, name: '志愿者协会', category: '公益服务', establishmentDate: '2021-09-01', leader: '赵六', advisor: '刘老师', memberCount: 150, status: '正常' },
          { id: 5, name: '摄影社', category: '文化艺术', establishmentDate: '2022-09-01', leader: '孙七', advisor: '陈老师', memberCount: 60, status: '正常' }
        ];
        // 保存初始社团数据到localStorage
        localStorage.setItem('clubs', JSON.stringify(initialClubs));
        this.clubs = initialClubs;
      }
    },
    addActivity() {
      // 从localStorage读取现有活动数据
      const activitiesData = localStorage.getItem('activities');
      let activities = [];
      if (activitiesData) {
        activities = JSON.parse(activitiesData);
      }
      
      // 生成唯一ID
      const id = Date.now();
      
      // 添加新活动，状态设为待审批
      const newActivity = {
        id: id,
        name: this.activity.name,
        club: this.activity.club,
        leader: this.activity.leader,
        startTime: this.activity.startTime,
        endTime: this.activity.endTime,
        location: this.activity.location,
        description: this.activity.description,
        budget: this.activity.budget,
        status: '待审批'
      };
      activities.push(newActivity);
      
      // 保存更新后的活动数据到localStorage
      localStorage.setItem('activities', JSON.stringify(activities));
      
      alert('活动提交成功，等待审批！');
      this.$router.push('/activities');
    }
  }
}
</script>

<style scoped>
.add-activity {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>