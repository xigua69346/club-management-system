<template>
  <div class="edit-reader">
    <div class="card">
      <h2>编辑读者</h2>
      <form @submit.prevent="updateReader">
        <div class="form-group">
          <label for="name">姓名</label>
          <input type="text" id="name" v-model="reader.name" required>
        </div>
        <div class="form-group">
          <label for="gender">性别</label>
          <select id="gender" v-model="reader.gender" required>
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>
        <div class="form-group">
          <label for="phone">联系电话</label>
          <input type="tel" id="phone" v-model="reader.phone" required>
        </div>
        <div class="form-group">
          <label for="email">邮箱</label>
          <input type="email" id="email" v-model="reader.email" required>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">保存</button>
          <router-link to="/reader-management" class="btn btn-secondary">取消</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditReader',
  data() {
    return {
      reader: {
        id: '',
        name: '',
        gender: '',
        phone: '',
        email: ''
      }
    }
  },
  mounted() {
    // 这里可以添加获取读者详情的逻辑，例如调用API
    const id = this.$route.params.id;
    // 模拟数据
    this.reader = {
      id: id,
      name: '张三',
      gender: '男',
      phone: '13800138001',
      email: 'zhangsan@example.com'
    };
  },
  methods: {
    updateReader() {
      // 这里可以添加更新逻辑，例如调用API
      alert('读者信息更新成功！');
      this.$router.push('/reader-management');
    }
  }
}
</script>

<style scoped>
.edit-reader {
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