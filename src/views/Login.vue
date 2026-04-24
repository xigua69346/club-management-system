<template>
  <div class="login">
    <div class="card login-card">
      <h2>登录</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">用户名</label>
          <input type="text" id="username" v-model="loginData.username" required>
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input type="password" id="password" v-model="loginData.password" required>
        </div>
        <div class="form-group">
          <label for="role">角色</label>
          <select id="role" v-model="loginData.role" required @change="onRoleChange">
            <option value="">请选择角色</option>
            <option value="admin">系统管理员</option>
            <option value="advisor">社团指导老师</option>
            <option value="leader">社团负责人</option>
            <option value="member">普通成员</option>
          </select>
        </div>
        <div class="form-group" v-if="loginData.role === 'advisor' || loginData.role === 'leader' || loginData.role === 'member'">
          <label for="club">社团</label>
          <select id="club" v-model="loginData.club" required>
            <option value="">请选择社团</option>
            <option v-for="club in clubs" :key="club.id" :value="club.name">{{ club.name }}</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">登录</button>
        </div>
        <div class="form-links">
          <router-link to="/register" class="register-link">还没有账号？点击注册</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginData: {
        username: '',
        password: '',
        role: '',
        club: ''
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
  computed: {
    users() {
      // 从localStorage读取用户数据
      const usersData = localStorage.getItem('users');
      if (usersData) {
        return JSON.parse(usersData);
      }
      // 初始用户数据 - 只保留系统管理员账号
      const initialUsers = [
        { username: 'admin', password: 'admin123', role: 'admin', club: '' }
      ];
      // 保存初始用户数据到localStorage
      localStorage.setItem('users', JSON.stringify(initialUsers));
      return initialUsers;
    }
  },
  methods: {
    onRoleChange() {
      // 当角色改变时，清空社团选择
      this.loginData.club = '';
    },
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
    login() {
      console.log('开始登录，登录数据:', this.loginData);
      // 验证登录信息
      if (this.loginData.username && this.loginData.password && this.loginData.role) {
        if ((this.loginData.role === 'advisor' || this.loginData.role === 'leader' || this.loginData.role === 'member') && !this.loginData.club) {
          alert('请选择社团！');
          return;
        }
        
        console.log('用户数据:', this.users);
        // 查找用户
        const user = this.users.find(u => 
          u.username === this.loginData.username && 
          u.password === this.loginData.password && 
          u.role === this.loginData.role && 
          (u.club === this.loginData.club || u.role === 'admin')
        );
        
        console.log('找到的用户:', user);
        if (user) {
          // 只有普通成员需要检查状态
          if (user.role === 'member') {
            // 检查用户状态
            if (!user.status || user.status !== '活跃') {
              if (!user.status || user.status === '待审核') {
                alert('您的账号正在审核中，请等待社团负责人或指导老师批准！');
              } else if (user.status === '已拒绝') {
                alert('您的账号已被拒绝加入社团，请联系社团负责人或指导老师！');
              } else {
                alert('您的账号状态异常，请联系系统管理员！');
              }
              return;
            }
          }
          
          // 保存登录信息到localStorage
          localStorage.setItem('userInfo', JSON.stringify(user));
          console.log('登录信息已保存到localStorage');
          alert('登录成功！');
          this.$router.push('/');
        } else {
          alert('账号、密码、角色或社团不匹配，请检查输入！');
        }
      } else {
        console.log('登录信息不完整:', this.loginData);
        alert('请填写完整的登录信息！');
      }
    }
  }
}
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.form-actions {
  margin-top: 1.5rem;
}

.form-links {
  margin-top: 1rem;
  text-align: center;
}

.register-link {
  color: #3498db;
  text-decoration: none;
  font-size: 0.9rem;
}

.register-link:hover {
  text-decoration: underline;
}
</style>