<template>
  <div class="borrow">
    <div class="card">
      <h2>图书借阅</h2>
      <form @submit.prevent="borrowBook">
        <div class="form-group">
          <label for="bookId">图书ID</label>
          <input type="text" id="bookId" v-model="borrowData.bookId" required>
        </div>
        <div class="form-group">
          <label for="readerId">读者ID</label>
          <input type="text" id="readerId" v-model="borrowData.readerId" required>
        </div>
        <div class="form-group">
          <label for="borrowDate">借阅日期</label>
          <input type="date" id="borrowDate" v-model="borrowData.borrowDate" required>
        </div>
        <div class="form-group">
          <label for="returnDate">应还日期</label>
          <input type="date" id="returnDate" v-model="borrowData.returnDate" required>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">借阅</button>
          <button type="button" @click="resetForm" class="btn btn-secondary">重置</button>
        </div>
      </form>
    </div>
    
    <div class="card">
      <h2>借阅记录</h2>
      <table class="table">
        <thead>
          <tr>
            <th>借阅ID</th>
            <th>图书ID</th>
            <th>读者ID</th>
            <th>借阅日期</th>
            <th>应还日期</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in borrowRecords" :key="record.id">
            <td>{{ record.id }}</td>
            <td>{{ record.bookId }}</td>
            <td>{{ record.readerId }}</td>
            <td>{{ record.borrowDate }}</td>
            <td>{{ record.returnDate }}</td>
            <td>{{ record.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Borrow',
  data() {
    return {
      borrowData: {
        bookId: '',
        readerId: '',
        borrowDate: new Date().toISOString().split('T')[0],
        returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      borrowRecords: [
        { id: 1, bookId: 1, readerId: 1001, borrowDate: '2026-03-20', returnDate: '2026-03-27', status: '借阅中' },
        { id: 2, bookId: 5, readerId: 1002, borrowDate: '2026-03-22', returnDate: '2026-03-29', status: '借阅中' },
        { id: 3, bookId: 2, readerId: 1003, borrowDate: '2026-03-18', returnDate: '2026-03-25', status: '已归还' }
      ]
    }
  },
  methods: {
    borrowBook() {
      // 这里可以添加借阅逻辑，例如调用API
      alert('图书借阅成功！');
      this.resetForm();
    },
    resetForm() {
      this.borrowData = {
        bookId: '',
        readerId: '',
        borrowDate: new Date().toISOString().split('T')[0],
        returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
    }
  }
}
</script>

<style scoped>
.borrow {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>