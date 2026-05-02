<template>
  <div class="square">
    <div class="create-post-card" v-if="isLoggedIn">
      <div class="user-avatar">{{ getAvatar(currentUser.username) }}</div>
      <textarea 
        v-model="newPost.content" 
        placeholder="分享你的想法..."
        rows="3"
        class="post-input"
      ></textarea>
      <div class="post-actions">
        <select v-model="newPost.club" class="club-select">
          <option value="">关联社团（可选）</option>
          <option v-for="club in myClubs" :key="club.name" :value="club.name">{{ club.name }}</option>
        </select>
        <button class="btn btn-primary post-btn" @click="createPost">发布动态</button>
      </div>
    </div>

    <div v-if="!dataStore.store.loaded" class="loading-state">
      <p>加载中...</p>
    </div>

    <div v-else>
      <div class="posts-container">
        <div class="post-card" v-for="post in posts" :key="post.id">
          <div class="post-header">
            <div class="user-info">
              <div class="avatar">{{ getAvatar(post.author) }}</div>
              <div class="user-detail">
                <span class="username">{{ post.author }}</span>
                <span class="post-time">{{ formatTime(post.createdAt) }}</span>
              </div>
            </div>
            <div class="post-header-right">
              <div v-if="post.club" class="post-club">🏛️ {{ post.club }}</div>
              <button v-if="canDeletePost(post)" class="delete-btn" @click="deletePost(post.id)">🗑️</button>
            </div>
          </div>
          <div class="post-content">
            {{ post.content }}
          </div>
          <div v-if="post.image" class="post-image">
            <img :src="post.image" alt="动态图片" />
          </div>
          <div class="post-stats">
            <span class="stat-item" @click="toggleLike(post)">
              <span :class="['like-icon', post.liked ? 'liked' : '']">{{ post.liked ? '❤️' : '🤍' }}</span>
              <span>{{ post.likes }}</span>
            </span>
            <span class="stat-item">💬 {{ post.comments.length }}</span>
            <span class="stat-item">🔗 分享</span>
          </div>
          <div class="comment-section">
            <div class="comments-list" v-if="post.comments && post.comments.length > 0">
              <div v-for="comment in post.comments" :key="comment.id" class="comment-item">
                <span class="comment-author">{{ comment.author }}:</span>
                <span class="comment-content">{{ comment.content }}</span>
              </div>
            </div>
            <div class="comment-input-container">
              <input 
                type="text" 
                :value="getCommentInput(post.id)"
                @input="updateCommentInput(post.id, $event.target.value)"
                placeholder="写下评论..."
                class="comment-input"
                @keyup.enter="addComment(post.id)"
              />
              <button class="btn btn-secondary comment-btn" @click="addComment(post.id)">发送</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="posts.length === 0" class="empty-state">
        <p>暂无动态，快来发布第一条吧！</p>
      </div>
    </div>
  </div>
</template>

<script>
import DataStore from '../stores/DataStore';
import NotificationService from '../utils/NotificationService';

const notificationService = new NotificationService(DataStore);

export default {
  name: 'Square',
  data() {
    return {
      dataStore: DataStore,
      posts: [],
      newPost: {
        content: '',
        club: ''
      },
      commentInputs: {}
    }
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('userInfo');
    },
    currentUser() {
      const userInfo = localStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    },
    myClubs() {
      if (!this.currentUser) return [];
      const members = this.dataStore.getMembers();
      const userMemberships = members.filter(m => m.username === this.currentUser.username);
      const clubNames = [...new Set(userMemberships.map(m => m.club))];
      const allClubs = this.dataStore.getClubs();
      return allClubs.filter(c => clubNames.includes(c.name));
    }
  },
  mounted() {
    this.loadPosts();
    window.addEventListener('storage', this.handleStorageChange);
    window.addEventListener('data-updated', this.handleDataUpdate);
  },
  watch: {
    'dataStore.store.loaded': {
      handler(newVal) {
        if (newVal) {
          this.loadPosts();
        }
      },
      immediate: true
    }
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorageChange);
    window.removeEventListener('data-updated', this.handleDataUpdate);
  },
  methods: {
    handleDataUpdate() {
      this.loadPosts();
    },
    loadPosts() {
      if (!this.dataStore || !this.dataStore.getPosts) {
        console.warn('DataStore not ready yet');
        setTimeout(() => this.loadPosts(), 100);
        return;
      }
      const posts = this.dataStore.getPosts();
      if (posts && posts.length > 0) {
        this.posts = posts;
      } else {
        // 如果API没有数据，使用默认数据
        this.posts = [
          { id: 1, content: '今天参加了编程大赛，收获满满！', author: '张三', club: '计算机协会', likes: 12, comments: [
            { id: 1, author: '李四', content: '太棒了！' },
            { id: 2, author: '王五', content: '恭喜恭喜' }
          ], createdAt: '2024-12-01 18:30', liked: false },
          { id: 2, content: '诗歌朗诵会圆满结束，感谢大家支持！', author: '李四', club: '文学社', likes: 25, comments: [
            { id: 1, author: '张三', content: '期待下次' },
            { id: 2, author: '赵六', content: '朗诵很棒' }
          ], createdAt: '2024-11-15 21:30', liked: false },
          { id: 3, content: '篮球友谊赛即将开始，欢迎观赛！', author: '王五', club: '篮球队', likes: 18, comments: [
            { id: 1, author: '李四', content: '一定到！' }
          ], createdAt: '2024-12-10 14:00', liked: false }
        ];
      }
      // 确保每个post都有正确的数据结构
      this.posts.forEach((post) => {
        if (!Array.isArray(post.comments)) {
          post.comments = [];
        }
        if (!post.liked) post.liked = false;
      });
    },
    handleStorageChange(event) {
      if (event.key === 'posts') {
        this.loadPosts();
      }
    },
    createPost() {
      if (!this.newPost.content.trim()) {
        alert('请输入动态内容！');
        return;
      }

      const post = {
        author: this.currentUser.username,
        content: this.newPost.content,
        club: this.newPost.club || ''
      };

      this.dataStore.addPost(post);
      this.posts = this.dataStore.getPosts();
      this.newPost.content = '';
      this.newPost.club = '';
      alert('发布成功！');
    },
    deletePost(postId) {
      if (confirm('确定要删除这条动态吗？')) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
          const postAuthor = post.author;
          const deletedBy = this.currentUser.name || this.currentUser.username;
          
          // 删除动态
          this.dataStore.deletePost(postId);
          this.loadPosts();
          
          // 如果删除的不是自己的动态，发送通知
          if (postAuthor !== this.currentUser.username) {
            notificationService.sendPostDeletedNotification(postAuthor, deletedBy);
          }
          
          alert('删除成功！');
        }
      }
    },
    canDeletePost(post) {
      if (!this.currentUser) return false;
      // 管理员或作者本人可以删除
      return this.currentUser.role === 'admin' || post.author === this.currentUser.username;
    },
    toggleLike(post) {
      if (!this.currentUser) return;
      
      const wasLiked = post.liked;
      post.liked = !post.liked;
      post.likes += post.liked ? 1 : -1;
      
      // 如果是点赞，发送通知给动态作者
      if (post.liked && !wasLiked && post.author !== this.currentUser.username) {
        notificationService.sendLikeNotification(post.author, this.currentUser.username);
      }
    },
    getCommentInput(postId) {
      return this.commentInputs[postId] || '';
    },
    updateCommentInput(postId, value) {
      this.commentInputs[postId] = value;
    },
    addComment(postId) {
      const content = this.commentInputs[postId];
      if (!content.trim() || !this.currentUser) {
        return;
      }

      const post = this.posts.find(p => p.id === postId);
      if (post) {
        if (!post.comments) post.comments = [];
        const newComment = {
          id: Date.now(),
          author: this.currentUser.username,
          content: content
        };
        post.comments.push(newComment);
        this.commentInputs[postId] = '';
        // 更新到DataStore
        this.dataStore.updatePost(postId, { comments: post.comments });
        
        // 发送通知给动态作者
        if (post.author !== this.currentUser.username) {
          notificationService.sendCommentNotification(post.author, this.currentUser.username, content);
        }
      }
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
    formatTime(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;

      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return '刚刚';
      if (minutes < 60) return `${minutes}分钟前`;
      if (hours < 24) return `${hours}小时前`;
      if (days < 7) return `${days}天前`;
      return date.toLocaleDateString();
    }
  }
}
</script>

<style scoped>
.square {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(180deg, #F5F5F7 0%, #EFEFF1 50%, #F5F5F7 100%);
}

.create-post-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 24px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 
    0 8px 32px rgba(102, 126, 234, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 0 30px rgba(102, 126, 234, 0.2);
}

.user-avatar {
  font-size: 40px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.1), rgba(175, 82, 222, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
}

.post-input {
  width: 100%;
  padding: 14px 16px;
  border: none;
  border-radius: 14px;
  resize: none;
  font-size: 15px;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.6);
  color: #1C1C1E;
}

.post-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.club-input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.6);
  color: #1C1C1E;
}

.club-select {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.6);
  color: #1C1C1E;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238E8E93' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 40px;
}

.post-btn {
  padding: 12px 24px;
}

.posts-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.25) 100%);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 
    0 4px 20px rgba(102, 126, 234, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  position: relative;
}

.post-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}

.post-card:hover::before {
  left: 100%;
}

.post-card:hover {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 
    0 12px 40px rgba(102, 126, 234, 0.2),
    0 0 50px rgba(102, 126, 234, 0.3);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 20px;
}

.user-info {
  display: flex;
  gap: 12px;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.15), rgba(175, 82, 222, 0.15));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.user-detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.username {
  font-weight: 500;
  font-size: 15px;
  color: #1C1C1E;
}

.post-time {
  font-size: 12px;
  color: #8E8E93;
}

.post-club {
  font-size: 12px;
  color: #007AFF;
  background: rgba(0, 122, 255, 0.08);
  padding: 4px 12px;
  border-radius: 20px;
}

.post-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.delete-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  opacity: 0.6;
  transition: all 0.2s;
}

.delete-btn:hover {
  opacity: 1;
  background: rgba(255, 59, 48, 0.1);
}

.post-content {
  padding: 16px 20px;
  color: #1C1C1E;
  font-size: 15px;
  line-height: 1.6;
}

.post-image img {
  width: 100%;
  height: auto;
}

.post-stats {
  display: flex;
  gap: 32px;
  padding: 14px 20px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.01) 100%);
  border-top: 1px solid rgba(0, 0, 0, 0.04);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #8E8E93;
  font-size: 14px;
  transition: all 0.25s ease;
}

.stat-item:hover {
  color: #007AFF;
}

.like-icon {
  font-size: 18px;
  transition: transform 0.2s;
}

.like-icon:hover {
  transform: scale(1.2);
}

.like-icon.liked {
  animation: pulse 0.3s ease;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.comment-section {
  padding: 16px 20px;
  background: linear-gradient(180deg, rgba(0, 122, 255, 0.02) 0%, rgba(0, 0, 0, 0.01) 100%);
  border-top: 1px solid rgba(0, 122, 255, 0.06);
}

.comments-list {
  margin-bottom: 16px;
}

.comment-item {
  display: flex;
  gap: 8px;
  padding: 10px 0;
  border-bottom: 1px solid #E5E5E7;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-author {
  font-weight: 500;
  font-size: 14px;
  color: #007AFF;
}

.comment-content {
  color: #1C1C1E;
  font-size: 14px;
}

.comment-input-container {
  display: flex;
  gap: 8px;
}

.comment-input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.8);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #8E8E93;
  font-size: 15px;
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: #8E8E93;
  font-size: 15px;
}
</style>