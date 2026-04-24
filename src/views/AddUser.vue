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
      },
      clubs: []
    }
  },
  mounted() {
    // 组件挂载时加载社团数据
    this.loadClubs();
    // 监听localStorage变化
    window.addEventListener('storage', this.handleStorageChange);
  },
  beforeUnmount() {
    // 组件卸载时移除监听器
    window.removeEventListener('storage', this.handleStorageChange);
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
    handleStorageChange(event) {
      // 当localStorage中的clubs发生变化时，重新加载社团数据
      if (event.key === 'clubs') {
        this.loadClubs();
      }
    },
    onRoleChange() {
      this.userData.club = '';
    },
    addUser() {
      if (this.userData.username && this.userData.password && this.userData.role) {
        if ((this.userData.role === 'advisor' || this.userData.role === 'leader' || this.userData.role === 'member') && !this.userData.club) {
          alert('请选择社团！');
          return;
        }
        
        // 从localStorage读取现有用户数据
        const usersData = localStorage.getItem('users');
        let users = [];
        if (usersData) {
          users = JSON.parse(usersData);
        }
        
        // 检查用户名是否已存在
        const existingUser = users.find(u => u.username === this.userData.username);
        if (existingUser) {
          alert('用户名已存在，请使用其他用户名！');
          return;
        }
        
        // 添加新用户
        const newUser = { ...this.userData };
        // 只有普通成员需要设置为待审核状态
        if (newUser.role === 'member') {
          newUser.status = '待审核';
        } else {
          newUser.status = '活跃';
        }
        users.push(newUser);
        
        // 保存更新后的用户数据到localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('用户添加成功！');
        this.$router.push('/users');
      }
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