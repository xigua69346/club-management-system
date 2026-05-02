<template>
  <div class="user-management">
    <div class="card">
      <h2>📢 发送系统公告</h2>
      <div class="announcement-form">
        <input 
          type="text" 
          v-model="announcementTitle" 
          placeholder="公告标题"
          class="form-control"
        />
        <textarea 
          v-model="announcementContent" 
          placeholder="公告内容"
          rows="3"
          class="form-control"
        ></textarea>
        <button @click="sendAnnouncement" class="btn btn-primary">发送公告</button>
      </div>
    </div>

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
          <option value="admin">管理员</option>
          <option value="user">普通用户</option>
        </select>
        <router-link to="/add-user" class="btn btn-primary">添加用户</router-link>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>角色</th>
            <th>邮箱</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.role === 'admin' ? '管理员' : '普通用户' }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.createdAt }}</td>
            <td>
              <router-link :to="`/edit-user/${user.username}`" class="btn btn-primary">编辑</router-link>
              <button @click="deleteUser(user.id)" class="btn btn-danger">删除</button>
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
import DataStore from '../stores/DataStore';
import NotificationService from '../utils/NotificationService';

const notificationService = new NotificationService(DataStore);

export default {
  name: 'UserManagement',
  data() {
    return {
      searchTerm: '',
      roleFilter: '',
      announcementTitle: '',
      announcementContent: '',
      users: [
        { id: 1, username: 'admin', role: 'admin', email: 'admin@example.com', createdAt: '2026-03-01' },
        { id: 2, username: 'user1', role: 'user', email: 'user1@example.com', createdAt: '2026-03-02' },
        { id: 3, username: 'user2', role: 'user', email: 'user2@example.com', createdAt: '2026-03-03' }
      ]
    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                             user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
        const matchesRole = !this.roleFilter || user.role === this.roleFilter;
        return matchesSearch && matchesRole;
      });
    }
  },
  methods: {
    deleteUser(id) {
      if (confirm('确定要删除该用户吗？')) {
        this.users = this.users.filter(user => user.id !== id);
      }
    },
    sendAnnouncement() {
      if (!this.announcementTitle.trim() || !this.announcementContent.trim()) {
        alert('请填写公告标题和内容！');
        return;
      }
      
      notificationService.sendSystemNotification(this.announcementTitle, this.announcementContent);
      alert('公告已发送给所有用户！');
      this.announcementTitle = '';
      this.announcementContent = '';
    }
  }
}
</script>

<style scoped>
.user-management {
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