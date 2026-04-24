<template>
  <div class="edit-club">
    <div class="card">
      <h2>编辑社团</h2>
      <form @submit.prevent="updateClub">
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
          <label for="status">状态</label>
          <select id="status" v-model="club.status" required>
            <option value="正常">正常</option>
            <option value="待审核">待审核</option>
            <option value="已注销">已注销</option>
          </select>
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
  name: 'EditClub',
  data() {
    return {
      club: {
        id: '',
        name: '',
        category: '',
        leader: '',
        leaderContact: '',
        advisor: '',
        status: '',
        description: ''
      }
    }
  },
  mounted() {
    // 这里可以添加获取社团详情的逻辑，例如调用API
    const id = this.$route.params.id;
    // 模拟数据
    this.club = {
      id: id,
      name: '计算机协会',
      category: '学术科技',
      leader: '张三',
      leaderContact: '13800138001',
      advisor: '李老师',
      status: '正常',
      description: '计算机协会是一个专注于计算机技术学习和交流的社团，定期举办技术讲座和编程比赛。'
    };
  },
  methods: {
    updateClub() {
      // 这里可以添加更新逻辑，例如调用API
      alert('社团信息更新成功！');
      this.$router.push('/clubs');
    }
  }
}
</script>

<style scoped>
.edit-club {
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