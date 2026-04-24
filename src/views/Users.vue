<template>
  <div class="users">
    <div class="card">
      <h2>用户管理</h2>
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="搜索用户..."
        />
        <select v-model="roleFilter">
          <option value="">全部角色</option>
          <option value="admin">系统管理员</option>
          <option value="advisor">社团指导老师</option>
          <option value="leader">社团负责人</option>
          <option value="member">普通成员</option>
        </select>
        <router-link to="/add-user" class="btn btn-primary">添加用户</router-link>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>用户名</th>
            <th>密码</th>
            <th>角色</th>
            <th>社团</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.username">
            <td>{{ user.username }}</td>
            <td>{{ user.password }}</td>
            <td>{{ getUserRoleText(user.role) }}</td>
            <td>{{ user.club || '-' }}</td>
            <td>
              <router-link :to="`/edit-user/${user.username}`" class="btn btn-primary">编辑</router-link>
              <button @click="deleteUser(user.username)" class="btn btn-danger">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredUsers.length === 0" class="empty-state">
        <p>没有找到用户</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    return {
      searchTerm: '',
      roleFilter: '',
      usersList: []
    }
  },
  computed: {
    filteredUsers() {
      return this.usersList.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(this.searchTerm.toLowerCase());
        const matchesRole = !this.roleFilter || user.role === this.roleFilter;
        return matchesSearch && matchesRole;
      });
    }
  },
  activated() {
    // 组件激活时重新加载数据（当从其他页面切换回用户管理页面时）
    this.loadUsers();
  },
  mounted() {
    // 组件挂载时加载用户数据
    this.loadUsers();
    // 监听localStorage变化（其他标签页修改时）
    window.addEventListener('storage', this.handleStorageChange);
    // 监听页面可见性变化（同一标签页内切换回来时）
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  },
  beforeUnmount() {
    // 组件卸载时移除监听器
    window.removeEventListener('storage', this.handleStorageChange);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  },
  methods: {
    loadUsers() {
      // 从localStorage读取用户数据
      const usersData = localStorage.getItem('users');
      if (usersData) {
        this.usersList = JSON.parse(usersData);
      } else {
        // 初始用户数据 - 系统管理员账号 + 五个社团的负责人和指导老师账号
        const initialUsers = [
          { username: 'admin', password: 'admin123', role: 'admin', club: '' },
          // 计算机协会
          { username: 'zhangsan', password: 'leader123', role: 'leader', club: '计算机协会' },
          { username: 'wanglaoshi', password: 'advisor123', role: 'advisor', club: '计算机协会' },
          // 文学社
          { username: 'lisi', password: 'leader123', role: 'leader', club: '文学社' },
          { username: 'lilaoshi', password: 'advisor123', role: 'advisor', club: '文学社' },
          // 篮球队
          { username: 'wangwu', password: 'leader123', role: 'leader', club: '篮球队' },
          { username: 'zhanglaoshi', password: 'advisor123', role: 'advisor', club: '篮球队' },
          // 志愿者协会
          { username: 'zhaoliu', password: 'leader123', role: 'leader', club: '志愿者协会' },
          { username: 'liulaoshi', password: 'advisor123', role: 'advisor', club: '志愿者协会' },
          // 摄影社
          { username: 'sunqi', password: 'leader123', role: 'leader', club: '摄影社' },
          { username: 'chenlaoshi', password: 'advisor123', role: 'advisor', club: '摄影社' }
        ];
        // 保存初始用户数据到localStorage
        localStorage.setItem('users', JSON.stringify(initialUsers));
        this.usersList = initialUsers;
      }
    },
    handleStorageChange(event) {
      // 当localStorage中的users发生变化时，重新加载用户数据
      if (event.key === 'users') {
        this.loadUsers();
      }
    },
    handleVisibilityChange() {
      // 当页面从不可见变为可见时，重新加载数据
      if (!document.hidden) {
        this.loadUsers();
      }
    },
    getUserRoleText(role) {
      const roleMap = {
        'admin': '系统管理员',
        'advisor': '社团指导老师',
        'leader': '社团负责人',
        'member': '普通成员'
      };
      return roleMap[role] || '';
    },
    deleteUser(username) {
      if (confirm('确定要删除该用户吗？')) {
        const updatedUsers = this.usersList.filter(user => user.username !== username);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        this.loadUsers();
      }
    }
  }
}
</script>

<style scoped>
.users {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #95a5a6;
}
</style>