<template>
  <div class="edit-activity">
    <div class="card">
      <h2>编辑活动</h2>
      <form @submit.prevent="updateActivity">
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
        <div class="form-group">
          <label for="status">状态</label>
          <select id="status" v-model="activity.status" required :disabled="userRole === 'leader'">
            <option value="待审批">待审批</option>
            <option value="已审批">已审批</option>
            <option value="已拒绝">已拒绝</option>
            <option value="已结束">已结束</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">保存</button>
          <router-link to="/activities" class="btn btn-secondary">取消</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditActivity',
  data() {
    return {
      activity: {
        id: '',
        name: '',
        club: '',
        leader: '',
        startTime: '',
        endTime: '',
        location: '',
        description: '',
        budget: '',
        status: ''
      },
      clubs: []
    }
  },
  computed: {
    userInfo() {
      const userInfo = localStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    },
    userRole() {
      return this.userInfo ? this.userInfo.role : '';
    }
  },
  mounted() {
    // 加载社团数据
    this.loadClubs();
    // 从localStorage读取活动数据
    const id = this.$route.params.id;
    const activitiesData = localStorage.getItem('activities');
    if (activitiesData) {
      const activities = JSON.parse(activitiesData);
      const activity = activities.find(a => a.id == id);
      if (activity) {
        this.activity = { ...activity };
      }
    }
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
    updateActivity() {
      // 从localStorage读取现有活动数据
      const activitiesData = localStorage.getItem('activities');
      if (activitiesData) {
        let activities = JSON.parse(activitiesData);
        // 找到并更新活动
        const activityIndex = activities.findIndex(a => a.id == this.activity.id);
        if (activityIndex !== -1) {
          activities[activityIndex] = this.activity;
          // 保存更新后的活动数据到localStorage
          localStorage.setItem('activities', JSON.stringify(activities));
          alert('活动信息更新成功！');
          this.$router.push('/activities');
        } else {
          alert('活动不存在！');
        }
      }
    }
  }
}
</script>

<style scoped>
.edit-activity {
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