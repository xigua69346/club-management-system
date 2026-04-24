<template>
  <div class="books">
    <div class="card">
      <h2>图书管理</h2>
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="搜索图书..."
        />
        <select v-model="statusFilter">
          <option value="">全部状态</option>
          <option value="可借">可借</option>
          <option value="借出">借出</option>
        </select>
        <router-link to="/add-book" class="btn btn-primary">添加图书</router-link>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>书名</th>
            <th>作者</th>
            <th>ISBN</th>
            <th>分类</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in filteredBooks" :key="book.id">
            <td>{{ book.id }}</td>
            <td>{{ book.title }}</td>
            <td>{{ book.author }}</td>
            <td>{{ book.isbn }}</td>
            <td>{{ book.category }}</td>
            <td>{{ book.status }}</td>
            <td>
              <router-link :to="`/edit-book/${book.id}`" class="btn btn-primary">编辑</router-link>
              <button @click="deleteBook(book.id)" class="btn btn-danger">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredBooks.length === 0" class="empty-state">
        <p>没有找到图书</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Books',
  data() {
    return {
      searchTerm: '',
      statusFilter: '',
      books: [
        { id: 1, title: 'JavaScript权威指南', author: 'David Flanagan', isbn: '9787115275790', category: '计算机', status: '可借' },
        { id: 2, title: 'Vue.js实战', author: '梁灏', isbn: '9787115416322', category: '计算机', status: '借出' },
        { id: 3, title: '深入理解计算机系统', author: 'Randal E. Bryant', isbn: '9787111447447', category: '计算机', status: '可借' },
        { id: 4, title: '百年孤独', author: '加西亚·马尔克斯', isbn: '9787544717885', category: '文学', status: '可借' },
        { id: 5, title: '活着', author: '余华', isbn: '9787506365437', category: '文学', status: '借出' }
      ]
    }
  },
  computed: {
    filteredBooks() {
      return this.books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                             book.author.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                             book.isbn.includes(this.searchTerm);
        const matchesStatus = !this.statusFilter || book.status === this.statusFilter;
        return matchesSearch && matchesStatus;
      });
    }
  },
  methods: {
    deleteBook(id) {
      if (confirm('确定要删除这本书吗？')) {
        this.books = this.books.filter(book => book.id !== id);
      }
    }
  }
}
</script>

<style scoped>
.books {
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