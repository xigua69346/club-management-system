<template>
  <div class="clubs">
    <div class="card">
      <h2>社团管理</h2>
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="搜索社团..."
        />
        <select v-model="categoryFilter">
          <option value="">全部分类</option>
          <option value="学术科技">学术科技</option>
          <option value="文化艺术">文化艺术</option>
          <option value="体育健身">体育健身</option>
          <option value="公益服务">公益服务</option>
          <option value="其他">其他</option>
        </select>
        <select v-model="statusFilter">
          <option value="">全部状态</option>
          <option value="正常">正常</option>
          <option value="待审核">待审核</option>
          <option value="已注销">已注销</option>
        </select>
        <router-link to="/add-club" class="btn btn-primary" v-if="userRole === 'admin'">添加社团</router-link>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>社团名称</th>
            <th>分类</th>
            <th>成立时间</th>
            <th>负责人</th>
            <th>指导老师</th>
            <th>成员数</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="club in filteredClubs" :key="club.id">
            <td>{{ club.name }}</td>
            <td>{{ club.category }}</td>
            <td>{{ club.establishmentDate }}</td>
            <td>{{ club.leader }}</td>
            <td>{{ club.advisor }}</td>
            <td>{{ club.memberCount }}</td>
            <td>{{ club.status }}</td>
            <td>
              <router-link :to="`/edit-club/${club.id}`" class="btn btn-primary" v-if="canEdit(club)">编辑</router-link>
              <button @click="deleteClub(club.id)" class="btn btn-danger" v-if="canEdit(club)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredClubs.length === 0" class="empty-state">
        <p>没有找到社团</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Clubs',
  data() {
    return {
      searchTerm: '',
      categoryFilter: '',
      statusFilter: '',
      clubs: []
    }
  },
  mounted() {
    // 组件挂载时加载社团数据
    this.loadClubs();
    // 监听localStorage变化
    window.addEventListener('storage', this.handleStorageChange);
  },
  beforeUnmount() {
    // 组件卸载时移除监听器
    window.removeEventListener('storage', this.handleStorageChange);
  },
  computed: {
    userInfo() {
      const userInfo = localStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    },
    userRole() {
      return this.userInfo ? this.userInfo.role : '';
    },
    userClub() {
      return this.userInfo ? this.userInfo.club : '';
    },
    filteredClubs() {
      return this.clubs.filter(club => {
        // 系统管理员可以查看所有社团
        if (this.userRole === 'admin') {
          const matchesSearch = club.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                               club.leader.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                               club.advisor.toLowerCase().includes(this.searchTerm.toLowerCase());
          const matchesCategory = !this.categoryFilter || club.category === this.categoryFilter;
          const matchesStatus = !this.statusFilter || club.status === this.statusFilter;
          return matchesSearch && matchesCategory && matchesStatus;
        }
        // 其他角色只能查看自己社团的信息
        else if (this.userRole === 'advisor' || this.userRole === 'leader' || this.userRole === 'member') {
          const matchesClub = club.name === this.userClub;
          const matchesSearch = club.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                               club.leader.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                               club.advisor.toLowerCase().includes(this.searchTerm.toLowerCase());
          const matchesCategory = !this.categoryFilter || club.category === this.categoryFilter;
          const matchesStatus = !this.statusFilter || club.status === this.statusFilter;
          return matchesClub && matchesSearch && matchesCategory && matchesStatus;
        }
        return false;
      });
    }
  },
  methods: {
    canEdit(club) {
      // 系统管理员可以编辑所有社团
      if (this.userRole === 'admin') {
        return true;
      }
      // 社团指导老师和负责人只能编辑自己社团的信息
      else if ((this.userRole === 'advisor' || this.userRole === 'leader') && club.name === this.userClub) {
        return true;
      }
      return false;
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
    handleStorageChange(event) {
      // 当localStorage中的clubs发生变化时，重新加载社团数据
      if (event.key === 'clubs') {
        this.loadClubs();
      }
    },
    deleteClub(id) {
      if (confirm('确定要删除该社团吗？')) {
        const updatedClubs = this.clubs.filter(club => club.id !== id);
        // 保存更新后的社团数据到localStorage
        localStorage.setItem('clubs', JSON.stringify(updatedClubs));
        this.clubs = updatedClubs;
      }
    }
  }
}
</script>

<style scoped>
.clubs {
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