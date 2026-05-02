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
import DataStore from '../stores/DataStore';

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
      }
    }
  },
  computed: {
    clubs() {
      return DataStore.getClubs();
    },
    userInfo() {
      const userInfo = localStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    },
    userRole() {
      return this.userInfo ? this.userInfo.role : '';
    }
  },
  mounted() {
    const id = this.$route.params.id;
    const activities = DataStore.getActivities();
    const activity = activities.find(a => a.id == id);
    
    if (activity) {
      this.activity = { ...activity };
    }
  },
  methods: {
    updateActivity() {
      DataStore.updateActivity(this.activity.id, {
        name: this.activity.name,
        club: this.activity.club,
        leader: this.activity.leader,
        startTime: this.activity.startTime,
        endTime: this.activity.endTime,
        location: this.activity.location,
        description: this.activity.description,
        budget: this.activity.budget,
        status: this.activity.status
      });
      
      alert('活动信息更新成功！');
      this.$router.push('/activities');
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