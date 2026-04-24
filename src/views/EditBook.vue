<template>
  <div class="edit-book">
    <div class="card">
      <h2>编辑图书</h2>
      <form @submit.prevent="updateBook">
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
  name: 'EditBook',
  data() {
    return {
      book: {
        id: '',
        title: '',
        author: '',
        isbn: '',
        category: '',
        status: ''
      }
    }
  },
  mounted() {
    // 这里可以添加获取图书详情的逻辑，例如调用API
    const id = this.$route.params.id;
    // 模拟数据
    this.book = {
      id: id,
      title: 'JavaScript权威指南',
      author: 'David Flanagan',
      isbn: '9787115275790',
      category: '计算机',
      status: '可借'
    };
  },
  methods: {
    updateBook() {
      // 这里可以添加更新逻辑，例如调用API
      alert('图书更新成功！');
      this.$router.push('/books');
    }
  }
}
</script>

<style scoped>
.edit-book {
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