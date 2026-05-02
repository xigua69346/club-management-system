<template>
  <div class="add-member">
    <div class="card">
      <h2>添加成员</h2>
      <form @submit.prevent="addMember">
        <div class="form-group">
          <label for="username">账号</label>
          <input type="text" id="username" v-model="member.username" required placeholder="登录时使用的账号">
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input type="text" id="password" v-model="member.password" required placeholder="登录密码">
        </div>
        <div class="form-group">
          <label for="name">姓名</label>
          <input type="text" id="name" v-model="member.name" required>
        </div>
        <div class="form-group">
          <label for="gender">性别</label>
          <select id="gender" v-model="member.gender" required>
            <option value="">请选择性别</option>
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>
        <div class="form-group">
          <label for="major">专业</label>
          <input type="text" id="major" v-model="member.major" required>
        </div>
        <div class="form-group">
          <label for="club">社团</label>
          <select id="club" v-model="member.club" required>
            <option value="">请选择社团</option>
            <option v-for="club in clubs" :key="club.id" :value="club.name">{{ club.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="role">角色</label>
          <select id="role" v-model="member.role" required>
            <option value="">请选择角色</option>
            <option value="负责人">负责人</option>
            <option value="社团指导老师">社团指导老师</option>
            <option value="普通成员">普通成员</option>
          </select>
        </div>
        <div class="form-group">
          <label for="contact">联系方式</label>
          <input type="text" id="contact" v-model="member.contact" required>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">保存</button>
          <router-link to="/members" class="btn btn-secondary">取消</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import DataStore from '../stores/DataStore';

export default {
  name: 'AddMember',
  data() {
    return {
      member: {
        username: '',
        password: '',
        name: '',
        gender: '',
        major: '',
        club: '',
        role: '',
        contact: '',
        status: '活跃'
      }
    }
  },
  computed: {
    clubs() {
      return DataStore.getClubs();
    }
  },
  methods: {
    validatePhone(phone) {
      if (!phone) return true;
      return /^1[3-9]\d{9}$/.test(phone);
    },
    validateForm() {
      if (!this.member.name || this.member.name.trim().length < 2) {
        alert('姓名不能少于2个字符！');
        return false;
      }
      if (this.member.name.length > 10) {
        alert('姓名不能超过10个字符！');
        return false;
      }
      if (!this.member.gender) {
        alert('请选择性别！');
        return false;
      }
      if (!this.member.major || this.member.major.trim().length < 2) {
        alert('专业不能少于2个字符！');
        return false;
      }
      if (this.member.major.length > 20) {
        alert('专业不能超过20个字符！');
        return false;
      }
      if (!this.member.club) {
        alert('请选择社团！');
        return false;
      }
      if (!this.member.role) {
        alert('请选择角色！');
        return false;
      }
      if (this.member.contact && !this.validatePhone(this.member.contact)) {
        alert('联系方式格式不正确！');
        return false;
      }
      return true;
    },
    addMember() {
      if (!this.validateForm()) {
        return;
      }
      
      // 检查用户名是否已存在
      if (DataStore.checkUserExists(this.member.username)) {
        alert('该账号已被使用，请换一个账号！');
        return;
      }
      
      // 将中文角色转换为英文
      const roleMap = {
        '负责人': 'leader',
        '社团指导老师': 'advisor',
        '普通成员': 'member'
      };
      
      // 添加成员
      const result = DataStore.addMember({
        username: this.member.username.trim(),
        password: this.member.password,
        name: this.member.name.trim(),
        gender: this.member.gender,
        major: this.member.major.trim(),
        club: this.member.club,
        role: this.member.role,
        contact: this.member.contact || '',
        status: '活跃'
      });
      
      if (result) {
        // 创建用户账户
        DataStore.addUser({
          username: this.member.username.trim(),
          password: this.member.password,
          role: roleMap[this.member.role] || 'member',
          club: this.member.club,
          status: '活跃'
        });
        
        alert('成员添加成功！');
        this.$router.push('/members');
      } else {
        alert('添加失败，该成员可能已存在于该社团！');
      }
    }
  }
}
</script>

<style scoped>
.add-member {
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