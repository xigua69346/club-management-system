<template>
  <div class="add-member">
    <div class="card">
      <h2>添加成员</h2>
      <form @submit.prevent="addMember">

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
export default {
  name: 'AddMember',
  data() {
    return {
      member: {
        name: '',
        gender: '',
        major: '',
        club: '',
        role: '',
        contact: ''
      },
      clubs: []
    }
  },
  mounted() {
    // 加载社团数据
    this.loadClubs();
  },
  methods: {
    loadClubs() {
      // 从localStorage读取社团数据
      const clubsData = localStorage.getItem('clubs');
      if (clubsData) {
        this.clubs = JSON.parse(clubsData);
      } else {
        // 初始社团数据
        const initialClubs = [
          { id: 1, name: '计算机协会', category: '学术科技', establishmentDate: '2020-09-01', leader: '张三', advisor: '王老师', memberCount: 120, status: '正常' },
          { id: 2, name: '文学社', category: '文化艺术', establishmentDate: '2019-09-01', leader: '李四', advisor: '李老师', memberCount: 80, status: '正常' },
          { id: 3, name: '篮球队', category: '体育健身', establishmentDate: '2018-09-01', leader: '王五', advisor: '张老师', memberCount: 30, status: '正常' },
          { id: 4, name: '志愿者协会', category: '公益服务', establishmentDate: '2021-09-01', leader: '赵六', advisor: '刘老师', memberCount: 150, status: '正常' },
          { id: 5, name: '摄影社', category: '文化艺术', establishmentDate: '2022-09-01', leader: '孙七', advisor: '陈老师', memberCount: 60, status: '正常' }
        ];
        // 保存初始社团数据到localStorage
        localStorage.setItem('clubs', JSON.stringify(initialClubs));
        this.clubs = initialClubs;
      }
    },
    addMember() {
      // 从localStorage读取现有成员数据
      const membersData = localStorage.getItem('members');
      let members = [];
      if (membersData) {
        members = JSON.parse(membersData);
      }
      
      // 自动生成唯一ID
      const memberId = 'M' + Date.now() + Math.floor(Math.random() * 1000);
      
      // 添加新成员
      const newMember = {
        id: memberId,
        name: this.member.name,
        gender: this.member.gender,
        major: this.member.major,
        club: this.member.club,
        role: this.member.role,
        contact: this.member.contact,
        status: '活跃'
      };
      members.push(newMember);
      
      // 保存更新后的成员数据到localStorage
      localStorage.setItem('members', JSON.stringify(members));
      
      alert('成员添加成功！');
      this.$router.push('/members');
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