<template>
  <div class="add-activity">
    <div class="card">
      <h2>添加活动</h2>
      
      <div class="ai-section">
        <button class="btn btn-secondary" @click="openAIAssistant">🤖 AI文案助手</button>
      </div>
      
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
          <label for="description">活动描述 
            <span class="safe-check" :class="{ 'safe': isSafe, 'unsafe': !isSafe && checked }">
              {{ checked ? (isSafe ? '✅ 内容安全' : '❌ 检测到敏感内容') : '' }}
            </span>
          </label>
          <textarea id="description" v-model="activity.description" rows="4" @input="checkContent" required></textarea>
        </div>
        <div class="form-group">
          <label for="budget">活动预算</label>
          <input type="number" id="budget" v-model="activity.budget" step="0.01" required>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="!isSafe && checked">提交审批</button>
          <router-link to="/activities" class="btn btn-secondary">取消</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import DataStore from '../stores/DataStore';

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
      checked: false,
      isSafe: true,
      sensitiveWords: ['赌博', '诈骗', '暴力', '色情', '非法', '违禁']
    }
  },
  computed: {
    clubs() {
      return DataStore.getClubs();
    }
  },
  methods: {
    openAIAssistant() {
      this.$router.push('/ai-copywriter');
    },
    checkContent() {
      if (!this.activity.description) {
        this.checked = false;
        this.isSafe = true;
        return;
      }
      
      this.checked = true;
      const text = this.activity.description.toLowerCase();
      
      for (const word of this.sensitiveWords) {
        if (text.includes(word.toLowerCase())) {
          this.isSafe = false;
          return;
        }
      }
      
      this.isSafe = true;
    },
    validateForm() {
      if (!this.activity.name || this.activity.name.trim().length < 2) {
        alert('活动名称不能少于2个字符！');
        return false;
      }
      if (this.activity.name.length > 30) {
        alert('活动名称不能超过30个字符！');
        return false;
      }
      if (!this.activity.type) {
        alert('请选择活动类型！');
        return false;
      }
      if (!this.activity.club) {
        alert('请选择所属社团！');
        return false;
      }
      if (!this.activity.startTime) {
        alert('请选择活动开始时间！');
        return false;
      }
      if (!this.activity.endTime) {
        alert('请选择活动结束时间！');
        return false;
      }
      if (new Date(this.activity.endTime) <= new Date(this.activity.startTime)) {
        alert('活动结束时间必须晚于开始时间！');
        return false;
      }
      if (!this.activity.location || this.activity.location.trim().length < 2) {
        alert('活动地点不能少于2个字符！');
        return false;
      }
      if (this.activity.budget && (isNaN(this.activity.budget) || this.activity.budget < 0)) {
        alert('活动预算必须是正数！');
        return false;
      }
      if (this.activity.budget && this.activity.budget > 100000) {
        alert('活动预算不能超过10万元！');
        return false;
      }
      return true;
    },
    addActivity() {
      if (this.checked && !this.isSafe) {
        alert('内容包含敏感词汇，请修改后再提交！');
        return;
      }
      
      if (!this.validateForm()) {
        return;
      }
      
      const result = DataStore.addActivity({
        name: this.activity.name.trim(),
        type: this.activity.type,
        club: this.activity.club,
        leader: this.activity.leader || '',
        startTime: this.activity.startTime,
        endTime: this.activity.endTime,
        location: this.activity.location.trim(),
        description: (this.activity.description || '').trim(),
        budget: this.activity.budget || 0
      });
      
      if (result) {
        alert('活动提交成功，等待审批！');
        this.$router.push('/activities');
      } else {
        alert('添加失败，请检查输入！');
      }
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

.ai-section {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.safe-check {
  margin-left: 0.5rem;
  font-size: 0.85rem;
}

.safe-check.safe {
  color: #27ae60;
}

.safe-check.unsafe {
  color: #e74c3c;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.form-actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>