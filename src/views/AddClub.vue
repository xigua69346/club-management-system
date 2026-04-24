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
            <option value="公益志愿">公益志愿</option>
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
    addClub() {
      // 从localStorage读取现有社团数据
      const clubsData = localStorage.getItem('clubs');
      let clubs = [];
      if (clubsData) {
        clubs = JSON.parse(clubsData);
      }
      
      // 生成新社团的ID
      const newId = clubs.length > 0 ? Math.max(...clubs.map(club => club.id)) + 1 : 1;
      
      // 创建新社团对象
      const newClub = {
        id: newId,
        name: this.club.name,
        category: this.club.category,
        establishmentDate: new Date().toISOString().split('T')[0], // 当前日期
        leader: this.club.leader,
        advisor: this.club.advisor,
        memberCount: 0, // 初始成员数为0
        status: '正常' // 初始状态为正常
      };
      
      // 添加新社团到数组
      clubs.push(newClub);
      
      // 保存更新后的社团数据到localStorage
      localStorage.setItem('clubs', JSON.stringify(clubs));
      
      alert('社团添加成功！');
      this.$router.push('/clubs');
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