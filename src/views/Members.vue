<template>
  <div class="members">
    <div class="card">
      <h2>{{ userRole === 'admin' || userRole === 'advisor' || userRole === 'leader' ? '成员管理' : '成员组成' }}</h2>
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="搜索成员..."
        />
        <select v-model="clubFilter" v-if="userRole === 'admin'">
          <option value="">全部社团</option>
          <option v-for="club in clubs" :key="club.id" :value="club.name">{{ club.name }}</option>
        </select>
        <select v-model="roleFilter">
          <option value="">全部角色</option>
          <option value="负责人">负责人</option>
          <option value="社团指导老师">社团指导老师</option>
          <option value="普通成员">普通成员</option>
        </select>
        <router-link to="/add-member" class="btn btn-primary" v-if="userRole === 'admin' || userRole === 'leader'">添加成员</router-link>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>姓名</th>
            <th>性别</th>
            <th>专业</th>
            <th>社团</th>
            <th>角色</th>
            <th>联系方式</th>
            <th>状态</th>
            <th v-if="userRole === 'admin'">账号</th>
            <th v-if="userRole === 'admin'">密码</th>
            <th v-if="userRole === 'admin' || userRole === 'advisor' || userRole === 'leader'">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in filteredMembers" :key="member.id">
            <td>{{ member.name }}</td>
            <td>{{ member.gender }}</td>
            <td>{{ member.major }}</td>
            <td>{{ member.club }}</td>
            <td>{{ member.role }}</td>
            <td>{{ member.contact }}</td>
            <td>{{ member.status }}</td>
            <td v-if="userRole === 'admin'"> {{ member.username || '-' }}</td>
            <td v-if="userRole === 'admin'"> {{ member.password || '-' }}</td>
            <td v-if="userRole === 'admin' || userRole === 'advisor' || userRole === 'leader'">
              <router-link :to="`/edit-member/${member.id}`" class="btn btn-primary" v-if="canEdit(member)">编辑</router-link>
              <button @click="deleteMember(member.id)" class="btn btn-danger" v-if="canEdit(member)">删除</button>
              <button @click="approveMember(member.id)" class="btn btn-success" v-if="canEdit(member) && member.status === '待审核'">同意</button>
              <button @click="rejectMember(member.id)" class="btn btn-warning" v-if="canEdit(member) && member.status === '待审核'">拒绝</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredMembers.length === 0" class="empty-state">
        <p>没有找到成员</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Members',
  data() {
    return {
      searchTerm: '',
      clubFilter: '',
      roleFilter: '',
      members: [],
      clubs: []
    }
  },
  mounted() {
    // 加载社团数据
    this.loadClubs();
    // 加载成员数据
    this.loadMembers();
    // 监听localStorage变化
    window.addEventListener('storage', this.handleStorageChange);
    // 检查用户信息和成员数据
    console.log('用户信息:', this.userInfo);
    console.log('用户角色:', this.userRole);
    console.log('用户社团:', this.userClub);
    console.log('成员数据:', this.members);
    console.log('过滤后的成员数据:', this.filteredMembers);
  },
  beforeRouteEnter(to, from, next) {
    // 进入路由前加载数据
    next(vm => {
      vm.loadMembers();
      vm.loadClubs();
    });
  },
  beforeRouteUpdate(to, from, next) {
    // 路由更新时重新加载数据
    this.loadMembers();
    this.loadClubs();
    next();
  },
  computed: {
    userInfo() {
      const userInfo = localStorage.getItem('userInfo');
      const parsedInfo = userInfo ? JSON.parse(userInfo) : null;
      console.log('获取用户信息:', parsedInfo);
      return parsedInfo;
    },
    userRole() {
      const role = this.userInfo ? this.userInfo.role : '';
      console.log('获取用户角色:', role);
      return role;
    },
    userClub() {
      const club = this.userInfo ? this.userInfo.club : '';
      console.log('获取用户社团:', club);
      return club;
    },
    userName() {
      const name = this.userInfo ? this.userInfo.username : '';
      console.log('获取用户名:', name);
      return name;
    },
    filteredMembers() {
      console.log('开始过滤成员，用户社团:', this.userClub);
      const filtered = this.members.filter(member => {
        console.log('检查成员:', member.name, '社团:', member.club);
        // 系统管理员可以查看所有成员
        if (this.userRole === 'admin') {
          const matchesSearch = member.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                               (member.major && member.major.toLowerCase().includes(this.searchTerm.toLowerCase()));
          const matchesClub = !this.clubFilter || member.club === this.clubFilter;
          const matchesRole = !this.roleFilter || member.role === this.roleFilter;
          return matchesSearch && matchesClub && matchesRole;
        }
        // 社团指导老师和负责人只能查看自己社团的成员
        else if (this.userRole === 'advisor' || this.userRole === 'leader') {
          const matchesClub = member.club === this.userClub;
          console.log('成员社团与用户社团匹配:', matchesClub);
          const matchesSearch = member.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                               (member.major && member.major.toLowerCase().includes(this.searchTerm.toLowerCase()));
          const matchesRole = !this.roleFilter || member.role === this.roleFilter;
          return matchesClub && matchesSearch && matchesRole;
        }
        // 普通成员可以看到自己社团的所有成员，包括自己
        else if (this.userRole === 'member') {
          const matchesClub = member.club === this.userClub;
          console.log('成员社团与用户社团匹配:', matchesClub);
          const matchesSearch = member.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                               (member.major && member.major.toLowerCase().includes(this.searchTerm.toLowerCase()));
          const matchesRole = !this.roleFilter || member.role === this.roleFilter;
          return matchesClub && matchesSearch && matchesRole;
        }
        return false;
      });
      console.log('过滤后的成员数量:', filtered.length);
      return filtered;
    }
  },
  methods: {
    loadMembers() {
      // 从localStorage读取成员数据
      const membersData = localStorage.getItem('members');
      const usersData = localStorage.getItem('users');
      
      console.log('从localStorage读取的成员数据:', membersData);
      
      let parsedMembers = [];
      
      if (membersData) {
        parsedMembers = JSON.parse(membersData);
        console.log('解析后的成员数据:', parsedMembers);
      }
      
      // 从users数据中获取社团负责人和普通成员的补充信息
      if (usersData) {
        const users = JSON.parse(usersData);
        users.forEach(user => {
          // 如果用户不是管理员且状态为活跃
          if (user.role !== 'admin' && user.club && user.status === '活跃') {
            // 检查是否已经在members中存在
            const existingMember = parsedMembers.find(m => m.name === user.username || m.username === user.username);
            if (!existingMember) {
              // 添加新成员（来自users但不在members中的）
              parsedMembers.push({
                id: 'U' + Date.now() + Math.random().toString(36).substr(2, 9),
                name: user.username,
                gender: user.gender || '',
                major: user.major || '',
                club: user.club,
                role: user.role === 'advisor' ? '社团指导老师' : (user.role === 'leader' ? '负责人' : '普通成员'),
                contact: user.contact || '',
                status: user.status || '活跃',
                username: user.username
              });
            }
          }
        });
      }
      
      // 去重处理，根据id字段去重
      const uniqueMembers = [];
      const memberIds = new Set();
      for (const member of parsedMembers) {
        if (!memberIds.has(member.id)) {
          memberIds.add(member.id);
          uniqueMembers.push(member);
        }
      }
      
      console.log('去重后的成员数据:', uniqueMembers);
      this.members = uniqueMembers;
    },
    handleStorageChange(event) {
      // 当localStorage中的数据发生变化时，重新加载成员和社团数据
      if (['members', 'users', 'clubs', 'approvalRequests'].includes(event.key)) {
        this.loadMembers();
        this.loadClubs();
      }
    },
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
    canEdit(member) {
      // 系统管理员可以编辑所有成员
      if (this.userRole === 'admin') {
        return true;
      }
      // 社团指导老师和负责人只能编辑自己社团的成员
      else if ((this.userRole === 'advisor' || this.userRole === 'leader') && member.club === this.userClub) {
        return true;
      }
      return false;
    },
    deleteMember(id) {
      if (confirm('确定要删除该成员吗？')) {
        const updatedMembers = this.members.filter(member => member.id !== id);
        localStorage.setItem('members', JSON.stringify(updatedMembers));
        this.loadMembers();
      }
    },
    approveMember(id) {
      if (confirm('确定要同意该成员加入社团吗？')) {
        // 更新成员状态
        const membersData = localStorage.getItem('members');
        if (membersData) {
          let members = JSON.parse(membersData);
          const memberIndex = members.findIndex(m => m.id === id);
          if (memberIndex !== -1) {
            members[memberIndex].status = '活跃';
            localStorage.setItem('members', JSON.stringify(members));
          }
        }
        
        // 更新用户状态
        const usersData = localStorage.getItem('users');
        if (usersData) {
          let users = JSON.parse(usersData);
          const member = this.members.find(m => m.id === id);
          if (member && member.username) {
            const userIndex = users.findIndex(u => u.username === member.username);
            if (userIndex !== -1) {
              users[userIndex].status = '活跃';
              localStorage.setItem('users', JSON.stringify(users));
            }
          }
        }
        
        // 更新审核请求状态
        const approvalRequestsData = localStorage.getItem('approvalRequests');
        if (approvalRequestsData) {
          let approvalRequests = JSON.parse(approvalRequestsData);
          const requestIndex = approvalRequests.findIndex(r => r.memberId === id);
          if (requestIndex !== -1) {
            approvalRequests[requestIndex].status = '已同意';
            approvalRequests[requestIndex].approvedAt = new Date().toISOString();
            localStorage.setItem('approvalRequests', JSON.stringify(approvalRequests));
          }
        }
        
        this.loadMembers();
      }
    },
    rejectMember(id) {
      if (confirm('确定要拒绝该成员加入社团吗？')) {
        // 从members中删除该成员
        const membersData = localStorage.getItem('members');
        if (membersData) {
          let members = JSON.parse(membersData);
          const updatedMembers = members.filter(m => m.id !== id);
          localStorage.setItem('members', JSON.stringify(updatedMembers));
        }
        
        // 从users中删除该用户
        const usersData = localStorage.getItem('users');
        if (usersData) {
          let users = JSON.parse(usersData);
          const member = this.members.find(m => m.id === id);
          if (member && member.username) {
            const updatedUsers = users.filter(u => u.username !== member.username);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
          }
        }
        
        // 更新审核请求状态
        const approvalRequestsData = localStorage.getItem('approvalRequests');
        if (approvalRequestsData) {
          let approvalRequests = JSON.parse(approvalRequestsData);
          const requestIndex = approvalRequests.findIndex(r => r.memberId === id);
          if (requestIndex !== -1) {
            approvalRequests[requestIndex].status = '已拒绝';
            approvalRequests[requestIndex].approvedAt = new Date().toISOString();
            localStorage.setItem('approvalRequests', JSON.stringify(approvalRequests));
          }
        }
        
        this.loadMembers();
      }
    }
  }
}
</script>

<style scoped>
.members {
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