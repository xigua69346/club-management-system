<template>
  <div class="add-book">
    <div class="card">
      <h2>添加图书</h2>
      <form @submit.prevent="addBook">
        <div class="form-group">
          <label for="title">书名</label>
          <input type="text" id="title" v-model="book.title" required>
        </div>
        <div class="form-group">
          <label for="author">作者</label>
          <input type="text" id="author" v-model="book.author" required>
        </div>
        <div class="form-group">
          <label for="isbn">ISBN</label>
          <input type="text" id="isbn" v-model="book.isbn" required>
        </div>
        <div class="form-group">
          <label for="category">分类</label>
          <input type="text" id="category" v-model="book.category" required>
        </div>
        <div class="form-group">
          <label for="status">状态</label>
          <select id="status" v-model="book.status" required>
            <option value="可借">可借</option>
            <option value="借出">借出</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">保存</button>
          <router-link to="/books" class="btn btn-secondary">取消</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddBook',
  data() {
    return {
      book: {
        title: '',
        author: '',
        isbn: '',
        category: '',
        status: '可借'
      }
    }
  },
  methods: {
    addBook() {
      // 这里可以添加保存逻辑，例如调用API
      alert('图书添加成功！');
      this.$router.push('/books');
    }
  }
}
</script>

<style scoped>
.add-book {
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