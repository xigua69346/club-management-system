<template>
  <div class="add-club">
    <div class="card">
      <h2>添加社团</h2>
      <form @submit.prevent="addClub">
        <div class="form-group">
          <label for="name">社团名称</label>
          <input type="text" id="name" v-model="club.name" required>
        </div>
        <div class="form-group">
          <label for="category">社团分类</label>
          <select id="category" v-model="club.category" required>
            <option value="">请选择分类</option>
            <option value="学术科技">学术科技</option>
            <option value="文化艺术">文化艺术</option>
            <option value="体育健身">体育健身</option>
            <option value="公益服务">公益服务</option>
            <option value="其他">其他</option>
          </select>
        </div>
        <div class="form-group">
          <label for="leader">负责人</label>
          <input type="text" id="leader" v-model="club.leader" required>
        </div>
        <div class="form-group">
          <label for="leaderContact">负责人联系方式</label>
          <input type="text" id="leaderContact" v-model="club.leaderContact" required>
        </div>
        <div class="form-group">
          <label for="advisor">指导老师</label>
          <input type="text" id="advisor" v-model="club.advisor" required>
        </div>
        <div class="form-group">
          <label for="description">社团描述</label>
          <textarea id="description" v-model="club.description" rows="4" required></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">保存</button>
          <router-link to="/clubs" class="btn btn-secondary">取消</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import DataStore from '../stores/DataStore';

export default {
  name: 'AddClub',
  data() {
    return {
      club: {
        name: '',
        category: '',
        leader: '',
        leaderContact: '',
        advisor: '',
        description: ''
      }
    }
  },
  methods: {
    validatePhone(phone) {
      if (!phone) return true;
      return /^1[3-9]\d{9}$/.test(phone);
    },
    validateForm() {
      if (!this.club.name || this.club.name.trim().length < 2) {
        alert('社团名称不能少于2个字符！');
        return false;
      }
      if (this.club.name.length > 20) {
        alert('社团名称不能超过20个字符！');
        return false;
      }
      if (!this.club.category) {
        alert('请选择社团分类！');
        return false;
      }
      if (!this.club.leader || this.club.leader.trim().length < 2) {
        alert('负责人姓名不能少于2个字符！');
        return false;
      }
      if (this.club.leaderContact && !this.validatePhone(this.club.leaderContact)) {
        alert('负责人联系方式格式不正确！');
        return false;
      }
      if (!this.club.advisor || this.club.advisor.trim().length < 2) {
        alert('指导老师姓名不能少于2个字符！');
        return false;
      }
      return true;
    },
    addClub() {
      if (!this.validateForm()) {
        return;
      }
      
      const result = DataStore.addClub({
        name: this.club.name.trim(),
        category: this.club.category,
        leader: this.club.leader.trim(),
        leaderContact: this.club.leaderContact || '',
        advisor: this.club.advisor.trim(),
        description: (this.club.description || '').trim()
      });
      
      if (result) {
        alert('社团添加成功！');
        this.$router.push('/clubs');
      } else {
        alert('添加失败，社团名称可能已存在！');
      }
    }
  }
}
</script>

<style scoped>
.add-club {
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