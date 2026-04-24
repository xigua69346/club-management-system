<template>
  <div class="register">
    <div class="card register-card">
      <h2>用户注册</h2>
      <form @submit.prevent="register">

        <div class="form-group">
          <label for="username">用户名</label>
          <input type="text" id="username" v-model="registerData.username" required>
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input type="password" id="password" v-model="registerData.password" required>
        </div>
        <div class="form-group">
          <label for="name">姓名</label>
          <input type="text" id="name" v-model="registerData.name" required>
        </div>
        <div class="form-group">
          <label for="gender">性别</label>
          <select id="gender" v-model="registerData.gender" required>
            <option value="">请选择性别</option>
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>
        <div class="form-group">
          <label for="major">专业</label>
          <input type="text" id="major" v-model="registerData.major" required>
        </div>
        <div class="form-group">
          <label for="club">社团</label>
          <select id="club" v-model="registerData.club" required>
            <option value="">请选择社团</option>
            <option v-for="club in clubs" :key="club.id" :value="club.name">{{ club.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="role">角色</label>
          <select id="role" v-model="registerData.role" required>
            <option value="">请选择角色</option>
            <option value="member">普通成员</option>
          </select>
        </div>
        <div class="form-group">
          <label for="contact">联系方式</label>
          <input type="text" id="contact" v-model="registerData.contact" required>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">注册</button>
          <router-link to="/login" class="btn btn-secondary">返回登录</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      registerData: {
        username: '',
        password: '',
        name: '',
        gender: '',
        major: '',
        club: '',
        role: '',
        contact: ''
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
    register() {
      if (this.registerData.username && this.registerData.password && 
          this.registerData.name && this.registerData.gender && this.registerData.major && 
          this.registerData.club && this.registerData.role && this.registerData.contact) {
        
        // 从localStorage读取现有用户数据
        const usersData = localStorage.getItem('users');
        let users = [];
        if (usersData) {
          users = JSON.parse(usersData);
        }
        
        // 检查用户名是否已存在
        const existingUser = users.find(u => u.username === this.registerData.username);
        if (existingUser) {
          alert('用户名已存在，请使用其他用户名！');
          return;
        }
        
        // 添加新用户到用户列表
        const newUser = {
          username: this.registerData.username,
          password: this.registerData.password,
          role: this.registerData.role,
          club: this.registerData.club,
          gender: this.registerData.gender,
          major: this.registerData.major,
          contact: this.registerData.contact,
          // 只有普通成员需要待审核状态，负责人和指导老师直接活跃
          status: this.registerData.role === 'member' ? '待审核' : '活跃'
        };
        users.push(newUser);
        
        // 保存更新后的用户数据到localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        // 同时更新成员列表（如果需要）
        const membersData = localStorage.getItem('members');
        let members = [];
        if (membersData) {
          members = JSON.parse(membersData);
        }
        
        // 自动生成唯一ID
        const memberId = 'M' + Date.now() + Math.floor(Math.random() * 1000);
        
        // 添加新成员到成员列表
        const newMember = {
          id: memberId,
          name: this.registerData.name,
          gender: this.registerData.gender,
          major: this.registerData.major,
          club: this.registerData.club,
          role: this.registerData.role === 'advisor' ? '社团指导老师' : (this.registerData.role === 'leader' ? '负责人' : '普通成员'),
          contact: this.registerData.contact,
          // 只有普通成员需要待审核状态，负责人和指导老师直接活跃
          status: this.registerData.role === 'member' ? '待审核' : '活跃',
          username: this.registerData.username,
          password: this.registerData.password
        };
        members.push(newMember);
        
        // 保存更新后的成员数据到localStorage
        localStorage.setItem('members', JSON.stringify(members));
        
        // 创建审核请求
        const approvalRequestsData = localStorage.getItem('approvalRequests');
        let approvalRequests = [];
        if (approvalRequestsData) {
          approvalRequests = JSON.parse(approvalRequestsData);
        }
        
        const approvalRequestId = 'AR' + Date.now() + Math.floor(Math.random() * 1000);
        const newApprovalRequest = {
          id: approvalRequestId,
          memberId: memberId,
          memberName: this.registerData.name,
          club: this.registerData.club,
          status: '待审核',
          submittedAt: new Date().toISOString()
        };
        
        approvalRequests.push(newApprovalRequest);
        localStorage.setItem('approvalRequests', JSON.stringify(approvalRequests));
        
        alert('注册成功！请等待社团负责人或指导老师审核。');
        this.$router.push('/login');
      }
    }
  }
}
</script>

<style scoped>
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.register-card {
  width: 100%;
  max-width: 400px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>