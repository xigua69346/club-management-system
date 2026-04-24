<template>
  <div class="reader-management">
    <div class="card">
      <h2>读者管理</h2>
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="搜索读者..."
        />
        <router-link to="/add-reader" class="btn btn-primary">添加读者</router-link>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>读者ID</th>
            <th>姓名</th>
            <th>性别</th>
            <th>联系电话</th>
            <th>邮箱</th>
            <th>注册时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reader in filteredReaders" :key="reader.id">
            <td>{{ reader.id }}</td>
            <td>{{ reader.name }}</td>
            <td>{{ reader.gender }}</td>
            <td>{{ reader.phone }}</td>
            <td>{{ reader.email }}</td>
            <td>{{ reader.registeredAt }}</td>
            <td>
              <router-link :to="`/edit-reader/${reader.id}`" class="btn btn-primary">编辑</router-link>
              <button @click="deleteReader(reader.id)" class="btn btn-danger">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredReaders.length === 0" class="empty-state">
        <p>没有找到读者</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReaderManagement',
  data() {
    return {
      searchTerm: '',
      readers: [
        { id: 1001, name: '张三', gender: '男', phone: '13800138001', email: 'zhangsan@example.com', registeredAt: '2026-03-01' },
        { id: 1002, name: '李四', gender: '女', phone: '13900139002', email: 'lisi@example.com', registeredAt: '2026-03-02' },
        { id: 1003, name: '王五', gender: '男', phone: '13700137003', email: 'wangwu@example.com', registeredAt: '2026-03-03' }
      ]
    }
  },
  computed: {
    filteredReaders() {
      return this.readers.filter(reader => {
        return reader.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
               reader.phone.includes(this.searchTerm) ||
               reader.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      });
    }
  },
  methods: {
    deleteReader(id) {
      if (confirm('确定要删除该读者吗？')) {
        this.readers = this.readers.filter(reader => reader.id !== id);
      }
    }
  }
}
</script>

<style scoped>
.reader-management {
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