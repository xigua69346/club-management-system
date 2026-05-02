<template>
  <div class="profile-page">
    <div class="card">
      <h2>👤 个人中心</h2>
      
      <div class="profile-container">
        <div class="avatar-section">
          <div class="avatar-wrapper" @click="showAvatarPicker = true">
            <div class="avatar" :style="avatarStyle">
              {{ userInfo.avatar || '👤' }}
            </div>
            <div class="avatar-overlay">
              <span>修改头像</span>
            </div>
          </div>
          <p class="avatar-hint">点击更换头像</p>
        </div>
        
        <div class="info-section">
          <h3>基本信息</h3>
          
          <div class="info-item">
            <div class="info-label">用户名</div>
            <div class="info-value">{{ userInfo.username }}</div>
            <div class="info-hint">用户名不可修改</div>
          </div>
          
          <div class="info-item">
            <div class="info-label">姓名</div>
            <div class="info-value" v-if="editingField !== 'name'">{{ userInfo.name || '未设置' }}</div>
            <input v-else type="text" v-model="editData.name" class="info-input" @blur="saveField('name')" @keyup.enter="saveField('name')">
            <button class="edit-btn" @click="startEdit('name')" v-if="editingField !== 'name'">✏️</button>
          </div>
          
          <div class="info-item">
            <div class="info-label">性别</div>
            <div class="info-value" v-if="editingField !== 'gender'">{{ userInfo.gender || '未设置' }}</div>
            <select v-else v-model="editData.gender" class="info-input" @blur="saveField('gender')" @change="saveField('gender')">
              <option value="">请选择</option>
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
            <button class="edit-btn" @click="startEdit('gender')" v-if="editingField !== 'gender'">✏️</button>
          </div>
          
          <div class="info-item">
            <div class="info-label">专业</div>
            <div class="info-value" v-if="editingField !== 'major'">{{ userInfo.major || '未设置' }}</div>
            <input v-else type="text" v-model="editData.major" class="info-input" @blur="saveField('major')" @keyup.enter="saveField('major')">
            <button class="edit-btn" @click="startEdit('major')" v-if="editingField !== 'major'">✏️</button>
          </div>
          
          <div class="info-item">
            <div class="info-label">联系方式</div>
            <div class="info-value" v-if="editingField !== 'contact'">{{ userInfo.contact || '未设置' }}</div>
            <input v-else type="text" v-model="editData.contact" class="info-input" @blur="saveField('contact')" @keyup.enter="saveField('contact')">
            <button class="edit-btn" @click="startEdit('contact')" v-if="editingField !== 'contact'">✏️</button>
          </div>
          
          <div class="info-item">
            <div class="info-label">所属社团</div>
            <div class="info-value">{{ userInfo.club || '无' }}</div>
          </div>
          
          <div class="info-item">
            <div class="info-label">角色</div>
            <div class="info-value">{{ roleText }}</div>
          </div>
          
          <div class="info-item">
            <div class="info-label">当前积分</div>
            <div class="info-value">{{ userInfo.points || 0 }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card" v-if="currentRole !== 'admin'">
      <h3>🏢 我的社团</h3>
      <div class="my-clubs">
        <div v-if="myClubs.length > 0" class="club-list">
          <div v-for="(club, index) in myClubs" :key="index" class="club-item">
            <span class="club-name">🏢 {{ club.club }}</span>
            <span class="club-role">{{ club.role }}</span>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>你还没有加入任何社团</p>
        </div>
      </div>
    </div>
    
    <div class="card" v-if="currentRole !== 'admin'">
      <h3>📝 申请新社团</h3>
      <div class="apply-section">
        <div class="form-group">
          <label>选择要申请的社团</label>
          <select v-model="selectedClub">
            <option value="">请选择社团</option>
            <option v-for="club in availableClubs" :key="club.id" :value="club.name">
              {{ club.name }}（当前成员：{{ club.memberCount }}人）
            </option>
          </select>
        </div>
        <button class="btn btn-primary" @click="applyForClub" :disabled="!selectedClub || isApplying">
          {{ isApplying ? '申请中...' : '提交申请' }}
        </button>
      </div>
      
      <div v-if="myApplications.length > 0" class="applications-list">
        <h4>我的申请记录</h4>
        <div v-for="(app, index) in myApplications" :key="index" class="application-item">
          <div class="app-info">
            <span class="app-club">{{ app.club }}</span>
            <span class="app-status" :class="app.status">{{ app.status }}</span>
          </div>
          <div class="app-time">{{ app.time }}</div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <h3>🔐 修改密码</h3>
      <div class="password-form">
        <div class="form-group">
          <label>新密码</label>
          <input type="password" v-model="newPassword" placeholder="请输入新密码（至少6位）">
        </div>
        <div class="form-group">
          <label>确认密码</label>
          <input type="password" v-model="confirmPassword" placeholder="请再次输入新密码">
        </div>
        <button class="btn btn-warning" @click="changePassword" :disabled="!newPassword">
          🔒 修改密码
        </button>
      </div>
    </div>
    
    <div class="avatar-picker-overlay" v-if="showAvatarPicker" @click.self="showAvatarPicker = false">
      <div class="avatar-picker-modal">
        <h3>选择头像</h3>
        <div class="avatar-grid">
          <div 
            v-for="(avatar, index) in avatarOptions" 
            :key="index"
            :class="['avatar-option', { selected: selectedAvatar === avatar }]"
            @click="selectedAvatar = avatar"
          >
            {{ avatar }}
          </div>
        </div>
        <div class="picker-actions">
          <button class="btn btn-primary" @click="confirmAvatar">确定</button>
          <button class="btn btn-secondary" @click="showAvatarPicker = false">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DataStore from '../stores/DataStore';

export default {
  name: 'Profile',
  data() {
    return {
      dataStore: DataStore,
      editingField: '',
      editData: {
        name: '',
        gender: '',
        major: '',
        contact: ''
      },
      newPassword: '',
      confirmPassword: '',
      showAvatarPicker: false,
      selectedAvatar: '',
      selectedClub: '',
      isApplying: false,
      avatarOptions: [
        '👤', '👨', '👩', '🧑', '👴', '👵',
        '👨‍🎓', '👩‍🎓', '👨‍💼', '👩‍💼', '👨‍🔬', '👩‍🔬',
        '👨‍🎤', '👩‍🎤', '👨‍🏫', '👩‍🏫', '👨‍⚕️', '👩‍⚕️',
        '🦸', '🧙', '🧚', '🦊', '🐱', '🐶',
        '🐼', '🦁', '🐨', '🐯', '🦄', '🐲',
        '🌟', '⭐', '🌙', '☀️', '🌈', '🦋',
        '🎮', '🎨', '🎵', '📚', '⚽', '🏀',
        '🍎', '🍕', '🍜', '🎂', '🌸', '🌺'
      ],
      applicationHistory: [],
      currentUser: {}
    }
  },
  computed: {
    userInfo() {
      return this.currentUser;
    },
    avatarStyle() {
      return {
        fontSize: '4rem',
        background: this.getAvatarColor()
      };
    },
    currentRole() {
      // 将中文角色转换为英文，以便判断
      const role = this.userInfo.role;
      const roleMap = {
        '系统管理员': 'admin',
        '社团指导老师': 'advisor',
        '负责人': 'leader',
        '普通成员': 'member',
        'admin': 'admin',
        'advisor': 'advisor',
        'leader': 'leader',
        'member': 'member'
      };
      return roleMap[role] || role;
    },
    roleText() {
      const roleMap = {
        'admin': '系统管理员',
        'advisor': '社团指导老师',
        'leader': '社团负责人',
        'member': '普通成员'
      };
      return roleMap[this.currentRole] || this.userInfo.role;
    },
    myClubs() {
      const members = this.dataStore.getMembers();
      return members.filter(m => m.username === this.userInfo.username && m.status === '活跃');
    },
    availableClubs() {
      const clubs = this.dataStore.getClubs();
      const myClubNames = this.myClubs.map(c => c.club);
      return clubs.filter(c => !myClubNames.includes(c.name));
    },
    myApplications() {
      const approvalRequests = this.dataStore.getApprovalRequests();
      return approvalRequests
        .filter(ar => ar.memberName === this.userInfo.name)
        .map(r => ({
          club: r.club,
          status: r.status,
          time: new Date(r.submittedAt).toLocaleDateString('zh-CN')
        }));
    }
  },
  mounted() {
    this.loadUserData();
    this.loadApplicationHistory();
  },
  methods: {
    loadUserData() {
      const userInfo = localStorage.getItem('userInfo');
      this.currentUser = userInfo ? JSON.parse(userInfo) : {};
      
      if (!this.currentUser.name || !this.currentUser.gender || !this.currentUser.major || !this.currentUser.contact) {
        const members = this.dataStore.getMembers();
        const userMember = members.find(m => m.username === this.currentUser.username);
        if (userMember) {
          const savedAvatar = this.currentUser.avatar;
          this.currentUser = { ...this.currentUser, ...userMember };
          if (savedAvatar) {
            this.currentUser.avatar = savedAvatar;
          }
          localStorage.setItem('userInfo', JSON.stringify(this.currentUser));
        }
      }
      
      this.editData = {
        name: this.currentUser.name || '',
        gender: this.currentUser.gender || '',
        major: this.currentUser.major || '',
        contact: this.currentUser.contact || ''
      };
      this.selectedAvatar = this.currentUser.avatar || '👤';
    },
    
    startEdit(field) {
      this.editingField = field;
      this.editData[field] = this.userInfo[field] || '';
    },
    
    saveField(field) {
      this.editingField = '';
      
      let value = this.editData[field];
      
      if (field === 'name' && !value) {
        alert('姓名不能为空！');
        return;
      }
      
      // 使用DataStore方法更新用户数据
      this.dataStore.updateUser(this.userInfo.username, { [field]: value });
      
      // 同时更新所有社团的成员信息
      const members = this.dataStore.getMembers();
      members.forEach(member => {
        if (member.username === this.userInfo.username) {
          this.dataStore.updateMember(member.id, { [field]: value });
        }
      });
      
      // 更新当前用户对象
      this.currentUser = { ...this.currentUser, [field]: value };
      // 同步到localStorage
      localStorage.setItem('userInfo', JSON.stringify(this.currentUser));
    },
    
    loadApplicationHistory() {
      const approvalRequests = this.dataStore.getApprovalRequests();
      const members = this.dataStore.getMembers();
      
      const userMember = members.find(m => m.username === this.userInfo.username);
      if (userMember) {
        const myRequests = approvalRequests.filter(ar => ar.memberName === userMember.name);
        this.applicationHistory = myRequests.map(r => ({
          club: r.club,
          status: r.status,
          time: new Date(r.submittedAt).toLocaleDateString('zh-CN')
        }));
      }
    },
    
    getAvatarColor() {
      const colors = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
        'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
        'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)',
        'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)'
      ];
      const index = this.userInfo.username ? 
        this.userInfo.username.charCodeAt(0) % colors.length : 0;
      return colors[index];
    },
    
    confirmAvatar() {
      // 使用DataStore方法更新用户头像
      this.dataStore.updateUser(this.currentUser.username, { avatar: this.selectedAvatar });
      
      // 同时更新所有社团的成员头像
      const members = this.dataStore.getMembers();
      members.forEach(member => {
        if (member.username === this.currentUser.username) {
          this.dataStore.updateMember(member.id, { avatar: this.selectedAvatar });
        }
      });
      
      // 更新当前用户对象（直接修改，保持响应式）
      this.currentUser.avatar = this.selectedAvatar;
      // 同步到localStorage
      localStorage.setItem('userInfo', JSON.stringify(this.currentUser));
      
      this.showAvatarPicker = false;
    },
    
    applyForClub() {
      if (!this.selectedClub) {
        alert('请选择要申请的社团！');
        return;
      }
      
      if (this.userInfo.role === 'admin') {
        alert('管理员账号不需要申请社团！');
        return;
      }
      
      if (this.userInfo.role === 'member' && !this.selectedClub) {
        alert('请选择要申请的社团！');
        return;
      }
      
      const club = this.selectedClub;
      const user = this.currentUser;
      
      const members = this.dataStore.getMembers();
      const existingActive = members.find(m => 
        m.username === user.username && m.club === club && m.status === '活跃'
      );
      if (existingActive) {
        alert('您已经是该社团的成员了！');
        return;
      }
      
      const existingPending = members.find(m => 
        m.username === user.username && m.club === club && m.status === '待审核'
      );
      if (existingPending) {
        alert('您已经申请过该社团了，请等待审核！');
        return;
      }
      
      const memberData = {
        username: user.username,
        name: user.name || user.username,
        gender: user.gender || '',
        major: user.major || '',
        club: club,
        role: '普通成员',
        contact: user.contact || '',
        status: '待审核',
        joinDate: new Date().toLocaleString('zh-CN')
      };
      
      const result = this.dataStore.addMember(memberData);
      
      if (result) {
        alert('申请已提交，请等待社团负责人或指导老师审核！');
        this.selectedClub = '';
        location.reload();
      } else {
        alert('申请失败，请稍后重试！');
      }
    },
    
    changePassword() {
      if (!this.newPassword) {
        alert('请输入新密码！');
        return;
      }
      
      if (this.newPassword !== this.confirmPassword) {
        alert('两次输入的密码不一致！');
        return;
      }
      
      if (this.newPassword.length < 6) {
        alert('密码长度至少6位！');
        return;
      }
      
      // 使用DataStore方法更新密码
      this.dataStore.updateUser(this.userInfo.username, { password: this.newPassword });
      
      // 同时更新所有社团成员的密码
      const members = this.dataStore.getMembers();
      members.forEach(member => {
        if (member.username === this.userInfo.username) {
          this.dataStore.updateMember(member.id, { password: this.newPassword });
        }
      });
      
      const currentUser = { ...this.userInfo, password: this.newPassword };
      localStorage.setItem('userInfo', JSON.stringify(currentUser));
      
      this.newPassword = '';
      this.confirmPassword = '';
      alert('密码修改成功！');
    }
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-container {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.avatar-section {
  flex: 0 0 150px;
  text-align: center;
}

.avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}

.avatar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 50%;
  transition: transform 0.3s;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

.avatar-overlay span {
  color: white;
  font-size: 0.85rem;
}

.avatar-hint {
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.5rem;
}

.info-section {
  flex: 1;
  min-width: 280px;
}

.info-section h3 {
  margin-bottom: 1rem;
  color: #333;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  width: 100px;
  color: #666;
  font-weight: 500;
}

.info-value {
  flex: 1;
  color: #333;
}

.info-input {
  flex: 1;
  padding: 0.4rem 0.6rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
}

.info-input:focus {
  outline: none;
  border-color: #667eea;
}

.info-hint {
  font-size: 0.75rem;
  color: #999;
  margin-left: auto;
}

.edit-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.3rem;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.edit-btn:hover {
  opacity: 1;
}

.my-clubs .club-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.club-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
}

.club-name {
  font-weight: 500;
}

.club-role {
  font-size: 0.85rem;
  opacity: 0.9;
}

.apply-section {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  margin-bottom: 1rem;
}

.apply-section .form-group {
  flex: 1;
  margin-bottom: 0;
}

.apply-section select {
  width: 100%;
  padding: 0.6rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  min-height: 44px;
}

.applications-list {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.applications-list h4 {
  margin-bottom: 0.75rem;
  color: #666;
  font-size: 0.9rem;
}

.application-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f9f9f9;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.app-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.app-club {
  font-weight: 500;
}

.app-status {
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.app-status.待审核 {
  background: #fff3cd;
  color: #856404;
}

.app-status.活跃 {
  background: #d4edda;
  color: #155724;
}

.app-status.已拒绝 {
  background: #f8d7da;
  color: #721c24;
}

.app-time {
  font-size: 0.85rem;
  color: #999;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f9f9f9;
  border-radius: 6px;
}

.history-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.history-status {
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.history-status.待审核 {
  background: #fff3cd;
  color: #856404;
}

.history-status.活跃 {
  background: #d4edda;
  color: #155724;
}

.history-status.已拒绝 {
  background: #f8d7da;
  color: #721c24;
}

.history-time {
  font-size: 0.85rem;
  color: #999;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #999;
}

.password-form {
  max-width: 400px;
}

.password-form .form-group {
  margin-bottom: 1rem;
}

.password-form label {
  display: block;
  margin-bottom: 0.3rem;
  color: #666;
  font-size: 0.9rem;
}

.password-form input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
}

.btn-warning {
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s;
}

.btn-warning:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-warning:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.avatar-picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.avatar-picker-modal {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.avatar-picker-modal h3 {
  margin-bottom: 1rem;
  text-align: center;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.avatar-option {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  background: #f5f5f5;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.avatar-option:hover {
  transform: scale(1.1);
  background: #e8e8e8;
}

.avatar-option.selected {
  border-color: #667eea;
  background: #f0f0ff;
}

.picker-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
</style>