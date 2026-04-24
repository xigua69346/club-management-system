<template>
  <div class="edit-member">
    <div class="card">
      <h2>编辑成员</h2>
      <form @submit.prevent="updateMember">
        
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
export default {
  name: 'EditMember',
  data() {
    return {
      member: {
        id: '',
        name: '',
        gender: '',
        major: '',
        club: '',
        role: '',
        contact: '',
        status: ''
      },
      clubs: []
    }
  },
  mounted() {
    // 加载社团数据
    this.loadClubs();
    // 从localStorage读取成员数据
    const id = this.$route.params.id;
    
    // 先从members中查找
    let foundMember = null;
    const membersData = localStorage.getItem('members');
    if (membersData) {
      const members = JSON.parse(membersData);
      foundMember = members.find(m => m.id === id);
    }
    
    // 如果在members中找不到，从当前成员列表中查找
    if (!foundMember) {
      // 这里我们需要从Members组件的逻辑中获取成员数据
      // 模拟Members组件的loadMembers逻辑
      const usersData = localStorage.getItem('users');
      if (usersData) {
        const users = JSON.parse(usersData);
        // 尝试根据username查找用户（假设ID中包含username信息）
        let user = null;
        for (const u of users) {
          if (u.role !== 'admin' && id.includes(u.username)) {
            user = u;
            break;
          }
        }
        // 如果根据username找不到，找到第一个非管理员用户
        if (!user) {
          user = users.find(u => u.role !== 'admin');
        }
        if (user) {
          // 尝试从members中查找同名成员，获取性别和联系方式
          let existingMember = null;
          if (membersData) {
            const members = JSON.parse(membersData);
            existingMember = members.find(m => m.name === user.username || m.username === user.username);
          }
          
          foundMember = {
            id: id,
            name: user.username,
            gender: existingMember ? existingMember.gender : '',
            major: user.major || '',
            club: user.club,
            role: user.role === 'advisor' ? '社团指导老师' : (user.role === 'leader' ? '负责人' : '普通成员'),
            contact: existingMember ? existingMember.contact : '',
            status: existingMember ? existingMember.status : '活跃',
            username: user.username
          };
        }
      }
    }
    
    if (foundMember) {
      this.member = foundMember;
    }
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
    updateMember() {
      // 从localStorage读取现有成员数据
      const membersData = localStorage.getItem('members');
      if (membersData) {
        let members = JSON.parse(membersData);
        // 找到并更新成员
        const index = members.findIndex(m => m.id === this.member.id);
        if (index !== -1) {
          members[index] = this.member;
          // 保存更新后的成员数据到localStorage
          localStorage.setItem('members', JSON.stringify(members));
        } else {
          // 如果成员不存在，添加到members中
          members.push(this.member);
          localStorage.setItem('members', JSON.stringify(members));
        }
      } else {
        // 如果members不存在，创建新的members数组
        const members = [this.member];
        localStorage.setItem('members', JSON.stringify(members));
      }
      
      // 同时更新users中的数据（如果用户存在）
      const usersData = localStorage.getItem('users');
      if (usersData) {
        let users = JSON.parse(usersData);
        // 找到对应的用户并更新
        const userIndex = users.findIndex(u => u.username === this.member.username);
        if (userIndex !== -1) {
          // 更新用户数据
          const role = this.member.role === '社团指导老师' ? 'advisor' : (this.member.role === '负责人' ? 'leader' : 'member');
          users[userIndex] = {
            ...users[userIndex],
            major: this.member.major,
            club: this.member.club,
            role: role,
            gender: this.member.gender,
            contact: this.member.contact,
            // 只有普通成员需要待审核状态，负责人和指导老师直接活跃
            status: role === 'member' ? this.member.status : '活跃'
          };
          localStorage.setItem('users', JSON.stringify(users));
        }
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