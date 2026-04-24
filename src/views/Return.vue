<template>
  <div class="return">
    <div class="card">
      <h2>图书归还</h2>
      <form @submit.prevent="returnBook">
        <div class="form-group">
          <label for="borrowId">借阅ID</label>
          <input type="text" id="borrowId" v-model="returnData.borrowId" required>
        </div>
        <div class="form-group">
          <label for="bookId">图书ID</label>
          <input type="text" id="bookId" v-model="returnData.bookId" required>
        </div>
        <div class="form-group">
          <label for="readerId">读者ID</label>
          <input type="text" id="readerId" v-model="returnData.readerId" required>
        </div>
        <div class="form-group">
          <label for="returnDate">归还日期</label>
          <input type="date" id="returnDate" v-model="returnData.returnDate" required>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">归还</button>
          <button type="button" @click="resetForm" class="btn btn-secondary">重置</button>
        </div>
      </form>
    </div>
    
    <div class="card">
      <h2>待归还图书</h2>
      <table class="table">
        <thead>
          <tr>
            <th>借阅ID</th>
            <th>图书ID</th>
            <th>读者ID</th>
            <th>借阅日期</th>
            <th>应还日期</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in pendingReturns" :key="record.id">
            <td>{{ record.id }}</td>
            <td>{{ record.bookId }}</td>
            <td>{{ record.readerId }}</td>
            <td>{{ record.borrowDate }}</td>
            <td>{{ record.returnDate }}</td>
            <td>
              <button @click="fillReturnForm(record)" class="btn btn-primary">归还</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Return',
  data() {
    return {
      returnData: {
        borrowId: '',
        bookId: '',
        readerId: '',
        returnDate: new Date().toISOString().split('T')[0]
      },
      pendingReturns: [
        { id: 1, bookId: 1, readerId: 1001, borrowDate: '2026-03-20', returnDate: '2026-03-27' },
        { id: 2, bookId: 5, readerId: 1002, borrowDate: '2026-03-22', returnDate: '2026-03-29' }
      ]
    }
  },
  methods: {
    returnBook() {
      // 这里可以添加归还逻辑，例如调用API
      alert('图书归还成功！');
      this.resetForm();
    },
    resetForm() {
      this.returnData = {
        borrowId: '',
        bookId: '',
        readerId: '',
        returnDate: new Date().toISOString().split('T')[0]
      };
    },
    fillReturnForm(record) {
      this.returnData = {
        borrowId: record.id.toString(),
        bookId: record.bookId.toString(),
        readerId: record.readerId.toString(),
        returnDate: new Date().toISOString().split('T')[0]
      };
    }
  }
}
</script>

<style scoped>
.return {
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