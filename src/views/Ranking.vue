<template>
  <div class="ranking">
    <div class="card">
      <h2>🏆 积分排行榜</h2>
      
      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.value"
          :class="['tab-btn', { active: activeTab === tab.value }]"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>

      <div v-if="activeTab === 'user'" class="ranking-content">
        <div class="top-three">
          <div class="podium second" v-if="userRankings.length >= 2">
            <div class="medal">🥈</div>
            <div class="rank-number">2</div>
            <div class="user-info">
              <div class="avatar">{{ getAvatar(userRankings[1].username) }}</div>
              <span class="username">{{ userRankings[1].username }}</span>
            </div>
            <div class="points">{{ userRankings[1].points }} 积分</div>
          </div>
          
          <div class="podium first" v-if="userRankings.length >= 1">
            <div class="medal">🥇</div>
            <div class="rank-number">1</div>
            <div class="user-info">
              <div class="avatar">{{ getAvatar(userRankings[0].username) }}</div>
              <span class="username">{{ userRankings[0].username }}</span>
            </div>
            <div class="points">{{ userRankings[0].points }} 积分</div>
          </div>
          
          <div class="podium third" v-if="userRankings.length >= 3">
            <div class="medal">🥉</div>
            <div class="rank-number">3</div>
            <div class="user-info">
              <div class="avatar">{{ getAvatar(userRankings[2].username) }}</div>
              <span class="username">{{ userRankings[2].username }}</span>
            </div>
            <div class="points">{{ userRankings[2].points }} 积分</div>
          </div>
        </div>

        <div class="ranking-list">
          <div 
            v-for="(user, index) in userRankings.slice(3)" 
            :key="user.username"
            class="ranking-item"
            :class="{ 'my-rank': user.username === currentUser?.username }"
          >
            <span class="rank">{{ index + 4 }}</span>
            <div class="avatar">{{ getAvatar(user.username) }}</div>
            <div class="info">
              <span class="username">{{ user.username }}</span>
              <span class="club">{{ user.club }}</span>
            </div>
            <div class="points-bar-container">
              <div 
                class="points-bar" 
                :style="{ width: Math.min((user.points / maxUserPoints * 100), 100) + '%' }"
              ></div>
            </div>
            <span class="points">{{ user.points }}</span>
          </div>
        </div>

        <div v-if="userRankings.length === 0" class="empty-state">
          <p>暂无用户积分数据</p>
        </div>
      </div>

      <div v-if="activeTab === 'club'" class="ranking-content">
        <div class="club-ranking-list">
          <div 
            v-for="(club, index) in clubRankings" 
            :key="club.name"
            class="club-ranking-item"
          >
            <span class="rank">{{ index + 1 }}</span>
            <div class="club-badge" :class="club.category">
              {{ getCategoryIcon(club.category) }}
            </div>
            <div class="info">
              <span class="club-name">{{ club.name }}</span>
              <span class="member-count">{{ club.memberCount }} 成员</span>
            </div>
            <div class="points-bar-container">
              <div 
                class="points-bar" 
                :style="{ width: Math.min((club.points / maxClubPoints * 100), 100) + '%' }"
              ></div>
            </div>
            <span class="points">{{ club.points }}</span>
          </div>
        </div>

        <div v-if="clubRankings.length === 0" class="empty-state">
          <p>暂无社团积分数据</p>
        </div>
      </div>

      <div v-if="activeTab === 'user'" class="points-rules">
        <h3>📋 个人积分规则</h3>
        <ul>
          <li>👑 社团负责人：+100 积分</li>
          <li>👨‍🏫 指导老师：+80 积分</li>
          <li>📝 发布动态：+10 积分/条</li>
          <li>❤️ 动态获赞：+5 积分/次</li>
          <li>💬 发表评论：+3 积分/条</li>
          <li>📅 参与活动：+20 积分/次</li>
          <li>🎯 社团活动奖励：+5 积分/活动</li>
          <li>🔝 积分上限：300 分</li>
        </ul>
      </div>

      <div v-if="activeTab === 'club'" class="points-rules">
        <h3>🏛️ 社团积分规则</h3>
        <ul>
          <li>👥 基础积分：成员数 × 10 分</li>
          <li>📅 活动积分：活动数 × 20 分</li>
          <li>📝 动态积分：动态数 × 5 分</li>
          <li>🙋 报名积分：报名人数 × 3 分</li>
          <li>⭐ 优质活动：参与≥20人活动 × 15 分</li>
        </ul>
        <div class="formula-box">
          <span class="formula-label">社团积分 = </span>
          <span class="formula-content">(成员数×10) + (活动数×20) + (动态数×5) + (报名数×3) + (优质活动数×15)</span>
        </div>
      </div>

      <div v-if="currentUser && userRankings.length > 0" class="my-ranking-card">
        <h3>👤 我的排名</h3>
        <div class="my-ranking-info">
          <div class="avatar large">{{ getAvatar(currentUser.username) }}</div>
          <div class="info">
            <span class="username">{{ currentUser.username }}</span>
            <span class="rank-info">当前排名：第 {{ myRank }} 名</span>
          </div>
          <div class="my-points">
            <span class="label">我的积分</span>
            <span class="value">{{ myPoints }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DataStore from '../stores/DataStore';

export default {
  name: 'Ranking',
  data() {
    return {
      dataStore: DataStore,
      activeTab: 'user',
      tabs: [
        { label: '个人排行榜', value: 'user' },
        { label: '社团排行榜', value: 'club' }
      ],
      userRankings: [],
      clubRankings: [],
      userPoints: {}
    }
  },
  computed: {
    currentUser() {
      const userInfo = localStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    },
    maxUserPoints() {
        return 300;
      },
      maxClubPoints() {
        if (this.clubRankings.length === 0) return 100;
        const maxPoints = this.clubRankings[0].points || 0;
        return Math.max(maxPoints, 100);
      },
    myPoints() {
      if (!this.currentUser) return 0;
      return this.userPoints[this.currentUser.username] || 0;
    },
    myRank() {
      if (!this.currentUser) return '-';
      const rank = this.userRankings.findIndex(u => u.username === this.currentUser.username);
      return rank >= 0 ? rank + 1 : '-';
    }
  },
  mounted() {
    this.loadRankingsWithWait();
    window.addEventListener('storage', this.handleStorageChange);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorageChange);
  },
  methods: {
    async loadRankingsWithWait() {
      while (!this.dataStore.store.loaded) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      this.loadRankings();
    },
    loadRankings() {
      this.loadUserPoints();
      this.loadClubPoints();
    },
    loadUserPoints() {
      const users = this.dataStore.getUsers().filter(u => u.role !== 'admin');
      const posts = this.dataStore.getPosts();
      const activities = this.dataStore.getActivities();
      const activitySignups = this.dataStore.getActivitySignups();

      // 从 posts 中提取所有评论
      const comments = posts.flatMap(post => post.comments || []);

      this.userRankings = users.map(user => ({
        username: user.username,
        club: user.club || '',
        points: this.calculateUserPoints(user, posts, comments, activities, activitySignups)
      })).sort((a, b) => b.points - a.points);

      this.userPoints = {};
      this.userRankings.forEach(user => {
        this.userPoints[user.username] = user.points;
      });
    },
    calculateUserPoints(user, posts, comments, activities, activitySignups) {
      let points = 50;

      if (user.role === 'leader') points += 100;
      if (user.role === 'advisor') points += 80;

      const userPosts = posts.filter(p => p.author === user.username);
      points += userPosts.length * 10;

      const likesCount = userPosts.reduce((sum, post) => sum + (post.likes || 0), 0);
      points += likesCount * 5;

      const userComments = comments.filter(c => c.author === user.username);
      points += userComments.length * 3;

      const userActivities = activitySignups.filter(s => s.username === user.username && s.status === '已签到');
      points += userActivities.length * 20;

      const clubActivities = activities.filter(a => a.club === user.club);
      const activityBonus = Math.floor(clubActivities.length * 5);
      points += activityBonus;

      return Math.min(Math.max(0, points), 300);
    },
    loadClubPoints() {
      const clubs = this.dataStore.getClubs();
      const activities = this.dataStore.getActivities();
      const posts = this.dataStore.getPosts();
      const activitySignups = this.dataStore.getActivitySignups();

      this.clubRankings = clubs.map(club => {
        const clubActivities = activities.filter(a => a.club === club.name);
        const clubPosts = posts.filter(p => p.club === club.name);
        const clubSignups = activitySignups.filter(s => activities.some(a => a.club === club.name && a.id === s.activityId));
        
        const basePoints = (club.memberCount || 0) * 10;
        const activityPoints = clubActivities.length * 20;
        const postPoints = clubPosts.length * 5;
        const signupPoints = clubSignups.length * 3;
        const qualityBonus = clubActivities.filter(a => a.participants && a.participants >= 20).length * 15;
        
        return {
          ...club,
          points: basePoints + activityPoints + postPoints + signupPoints + qualityBonus
        };
      }).sort((a, b) => b.points - a.points);
    },
    handleStorageChange() {
      this.loadRankings();
    },
    getAvatar(name) {
      const users = this.dataStore.getUsers();
      const user = users.find(u => u.username === name);
      if (user && user.avatar) {
        return user.avatar;
      }
      const members = this.dataStore.getMembers();
      const member = members.find(m => m.username === name);
      if (member && member.avatar) {
        return member.avatar;
      }
      const avatars = ['👨', '👩', '👴', '👵', '🧑', '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓'];
      const index = name.charCodeAt(0) % avatars.length;
      return avatars[index];
    },
    getCategoryIcon(category) {
      const icons = {
        '学术科技': '🔬',
        '文化艺术': '🎨',
        '体育健身': '⚽',
        '公益服务': '❤️',
        '其他': '📌'
      };
      return icons[category] || '📌';
    }
  }
}
</script>

<style scoped>
.ranking {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.tab-btn.active {
  border-bottom-color: var(--accent-primary);
  color: var(--accent-primary);
  font-weight: bold;
}

.top-three {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.05) 0%, transparent 100%);
  border-radius: 12px;
}

.podium {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.podium.first {
  order: 2;
  transform: scale(1.1);
}

.podium.second {
  order: 1;
}

.podium.third {
  order: 3;
}

.medal {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.rank-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-secondary);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  margin: 0.5rem 0;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.avatar.large {
  width: 60px;
  height: 60px;
  font-size: 1.5rem;
}

.username {
  font-weight: bold;
  color: var(--text-primary);
}

.points {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--accent-primary);
}

.ranking-list,
.club-ranking-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ranking-item,
.club-ranking-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.25) 100%);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 20px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.ranking-item::before,
.club-ranking-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}

.ranking-item:hover,
.club-ranking-item:hover {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2), 0 0 50px rgba(102, 126, 234, 0.3);
}

.ranking-item:hover::before,
.club-ranking-item:hover::before {
  left: 100%;
}

.ranking-item.my-rank {
  border: 2px solid var(--accent-primary);
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.1) 0%, transparent 100%);
}

.rank {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  color: #1C1C1E;
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.9rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.club,
.member-count {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.club-name {
  font-weight: bold;
  color: var(--text-primary);
}

.points-bar-container {
  flex: 2;
  height: 16px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
}

.points-bar {
  height: 100%;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 10px;
  transition: width 0.5s ease;
  position: relative;
}

.points-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.club-badge {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.club-badge.学术科技 {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.club-badge.文化艺术 {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.club-badge.体育健身 {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.club-badge.公益服务 {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
}

.club-badge.其他 {
  background: linear-gradient(135deg, #fa709a, #fee140);
}

.points-rules {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 12px;
}

.points-rules h3 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.points-rules ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.points-rules li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
  color: var(--text-secondary);
}

.points-rules li:last-child {
  border-bottom: none;
}

.formula-box {
  margin-top: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%);
  border-radius: 8px;
  border-left: 3px solid var(--accent-primary);
  font-family: 'Consolas', 'Monaco', monospace;
}

.formula-label {
  font-weight: bold;
  color: var(--accent-primary);
}

.formula-content {
  color: var(--text-primary);
  font-weight: 500;
}

.my-ranking-card {
  margin-top: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.1) 0%, transparent 100%);
  border: 1px solid rgba(52, 152, 219, 0.2);
  border-radius: 12px;
}

.my-ranking-card h3 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.my-ranking-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.my-ranking-info .info {
  flex: 2;
}

.rank-info {
  font-size: 0.9rem;
  color: var(--accent-primary);
}

.my-points {
  text-align: right;
}

.my-points .label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.my-points .value {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--accent-primary);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}
</style>