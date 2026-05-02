<template>
  <div class="edit-member">
    <div class="card">
      <h2>编辑成员</h2>
      <form @submit.prevent="updateMember">
        <div class="form-group">
          <label for="username">账号</label>
          <input type="text" id="username" v-model="member.username" readonly disabled>
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input type="text" id="password" v-model="member.password" required placeholder="可修改密码">
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
        <div class="form-group">
          <label for="status">状态</label>
          <select id="status" v-model="member.status" required>
            <option value="活跃">活跃</option>
            <option value="待审核">待审核</option>
            <option value="已退社">已退社</option>
          </select>
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
  name: 'EditMember',
  data() {
    return {
      member: {
        id: '',
        username: '',
        password: '',
        name: '',
        gender: '',
        major: '',
        club: '',
        role: '',
        contact: '',
        status: ''
      }
    }
  },
  computed: {
    clubs() {
      return DataStore.getClubs();
    }
  },
  mounted() {
    const id = this.$route.params.id;
    const members = DataStore.getMembers();
    const member = members.find(m => m.id == id);
    
    if (member) {
      this.member = { ...member };
    }
  },
  methods: {
    updateMember() {
      DataStore.updateMember(this.member.id, {
        username: this.member.username,
        password: this.member.password,
        name: this.member.name,
        gender: this.member.gender,
        major: this.member.major,
        club: this.member.club,
        role: this.member.role,
        contact: this.member.contact,
        status: this.member.status
      });
      
      // 同步更新用户信息
      const users = DataStore.getUsers();
      const user = users.find(u => u.username === this.member.username);
      if (user) {
        const roleMap = {
          '负责人': 'leader',
          '社团指导老师': 'advisor',
          '普通成员': 'member'
        };
        DataStore.updateUser(user.id || user.username, {
          password: this.member.password,
          role: roleMap[this.member.role] || user.role,
          club: this.member.club,
          status: this.member.status
        });
      }
      
      alert('成员信息更新成功！');
      this.$router.push('/members');
    }
  }
}
</script>

<style scoped>
.edit-member {
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