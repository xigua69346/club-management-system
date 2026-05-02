<template>
  <div class="add-user">
    <div class="card">
      <h2>添加用户</h2>
      <form @submit.prevent="addUser">
        <div class="form-group">
          <label for="username">用户名</label>
          <input type="text" id="username" v-model="userData.username" required>
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input type="password" id="password" v-model="userData.password" required>
        </div>
        <div class="form-group">
          <label for="role">角色</label>
          <select id="role" v-model="userData.role" required @change="onRoleChange">
            <option value="">请选择角色</option>
            <option value="admin">系统管理员</option>
            <option value="advisor">社团指导老师</option>
            <option value="leader">社团负责人</option>
            <option value="member">普通成员</option>
          </select>
        </div>
        <div class="form-group">
          <label for="gender">性别</label>
          <select id="gender" v-model="userData.gender">
            <option value="">请选择性别</option>
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>
        <div class="form-group" v-if="userData.role === 'advisor' || userData.role === 'leader' || userData.role === 'member'">
          <label for="club">社团</label>
          <select id="club" v-model="userData.club" required>
            <option value="">请选择社团</option>
            <option v-for="club in clubs" :key="club.id" :value="club.name">{{ club.name }}</option>
          </select>
        </div>
        <div class="form-group" v-if="userData.role === 'leader' || userData.role === 'member'">
          <label for="major">专业</label>
          <input type="text" id="major" v-model="userData.major">
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">添加</button>
          <router-link to="/users" class="btn btn-secondary">取消</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import DataStore from '../stores/DataStore';

export default {
  name: 'AddUser',
  data() {
    return {
      userData: {
        username: '',
        password: '',
        role: '',
        club: '',
        major: '',
        gender: ''
      }
    }
  },
  computed: {
    clubs() {
      return DataStore.getClubs();
    },
    users() {
      return DataStore.getUsers();
    }
  },
  methods: {
    onRoleChange() {
      this.userData.club = '';
    },
    addUser() {
      if (!this.userData.username || !this.userData.password || !this.userData.role) {
        alert('请填写必要信息！');
        return;
      }
      
      if ((this.userData.role === 'advisor' || this.userData.role === 'leader' || this.userData.role === 'member') && !this.userData.club) {
        alert('请选择社团！');
        return;
      }
      
      const existingUser = this.users.find(u => u.username === this.userData.username);
      if (existingUser) {
        alert('用户名已存在，请使用其他用户名！');
        return;
      }
      
      const newUser = { ...this.userData };
      newUser.status = newUser.role === 'member' ? '待审核' : '活跃';
      
      DataStore.addUser(newUser);
      
      alert('用户添加成功！');
      this.$router.push('/users');
    }
  }
}
</script>

<style scoped>
.add-user {
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