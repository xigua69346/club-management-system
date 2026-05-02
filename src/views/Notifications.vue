<template>
  <div class="notifications">
    <div class="card">
      <h2>消息通知</h2>
      
      <div class="filter-tabs">
        <button 
          @click="activeFilter = 'all'" 
          :class="['filter-btn', { active: activeFilter === 'all' }]"
        >
          全部
          <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
        </button>
        <button 
          @click="activeFilter = 'unread'" 
          :class="['filter-btn', { active: activeFilter === 'unread' }]"
        >
          未读
          <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
        </button>
        <button 
          @click="activeFilter = 'read'" 
          :class="['filter-btn', { active: activeFilter === 'read' }]"
        >
          已读
        </button>
        <button 
          @click="activeFilter = 'system'" 
          :class="['filter-btn', { active: activeFilter === 'system' }]"
        >
          系统通知
        </button>
      </div>

      <div class="notification-list">
        <div 
          v-for="notification in filteredNotifications" 
          :key="notification.id"
          :class="['notification-item', { unread: !notification.read }]"
          @click="markAsRead(notification.id)"
        >
          <div class="notification-icon">
            <span>{{ getIcon(notification.type) }}</span>
          </div>
          <div class="notification-content">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-message">{{ notification.message }}</div>
            <div class="notification-time">{{ formatTime(notification.createdAt) }}</div>
          </div>
          <div class="notification-action">
            <button 
              v-if="notification.action && !notification.actionTaken" 
              @click.stop="handleAction(notification)"
              class="btn btn-primary action-btn"
            >
              {{ notification.action.label }}
            </button>
            <span v-if="notification.actionTaken" class="action-taken">已处理</span>
          </div>
        </div>
      </div>

      <div v-if="filteredNotifications.length === 0" class="empty-state">
        <p>{{ getEmptyMessage() }}</p>
      </div>

      <div class="batch-actions" v-if="notifications.length > 0">
        <button @click="markAllAsRead" class="btn btn-secondary">
          全部标记为已读
        </button>
        <button @click="deleteAllRead" class="btn btn-danger">
          删除已读通知
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import DataStore from '../stores/DataStore';
import NotificationService from '../utils/NotificationService';

export default {
  name: 'Notifications',
  data() {
    return {
      activeFilter: 'all',
      notifications: [],
      notificationService: new NotificationService(DataStore)
    }
  },
  computed: {
    userInfo() {
      const userInfo = localStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    },
    userId() {
      return this.userInfo ? this.userInfo.username : '';
    },
    unreadCount() {
      return this.filteredNotifications.filter(n => !n.read).length;
    },
    filteredNotifications() {
      let filtered = [...this.notifications];
      
      if (this.activeFilter === 'unread') {
        filtered = filtered.filter(n => !n.read);
      } else if (this.activeFilter === 'read') {
        filtered = filtered.filter(n => n.read);
      } else if (this.activeFilter === 'system') {
        filtered = filtered.filter(n => n.type === 'system');
      }
      
      return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  },
  mounted() {
    this.loadNotifications();
    window.addEventListener('storage', this.handleStorageChange);
    window.addEventListener('notifications-updated', this.handleNotificationUpdate);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorageChange);
    window.removeEventListener('notifications-updated', this.handleNotificationUpdate);
  },
  methods: {
    loadNotifications() {
      if (this.userId) {
        this.notifications = this.notificationService.getUserNotifications(this.userId);
      } else {
        this.notifications = [];
      }
    },
    markAsRead(notificationId) {
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        notification.read = true;
        this.notificationService.markAsRead(notificationId, this.userId);
      }
    },
    markAllAsRead() {
      this.notificationService.markAllAsRead(this.userId);
      this.loadNotifications();
    },
    deleteAllRead() {
      this.notificationService.deleteAllRead(this.userId);
      this.loadNotifications();
    },
    handleAction(notification) {
      if (notification.action) {
        notification.action.actionTaken = true;
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        localStorage.setItem('notifications', JSON.stringify(notifications));
        
        if (notification.action.type === 'join_activity') {
          alert('报名成功！');
        }
      }
    },
    handleStorageChange(event) {
      if (event.key === 'notifications') {
        this.loadNotifications();
      }
    },
    handleNotificationUpdate() {
      this.loadNotifications();
    },
    getIcon(type) {
      const icons = {
        approval: '📋',
        activity: '📅',
        comment: '💬',
        system: '🔔',
        like: '❤️',
        message: '✉️'
      };
      return icons[type] || '📌';
    },
    formatTime(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      
      if (diff < 60000) {
        return '刚刚';
      } else if (diff < 3600000) {
        return `${Math.floor(diff / 60000)}分钟前`;
      } else if (diff < 86400000) {
        return `${Math.floor(diff / 3600000)}小时前`;
      } else if (diff < 604800000) {
        return `${Math.floor(diff / 86400000)}天前`;
      } else {
        return date.toLocaleDateString('zh-CN');
      }
    },
    getEmptyMessage() {
      if (this.activeFilter === 'unread') {
        return '暂无未读通知';
      } else if (this.activeFilter === 'read') {
        return '暂无已读通知';
      } else if (this.activeFilter === 'system') {
        return '暂无系统通知';
      }
      return '暂无通知';
    },
    handleStorageChange(event) {
      if (event.key === 'notifications') {
        this.loadNotifications();
      }
    }
  }
}
</script>

<style scoped>
.notifications {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notifications .card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.25) 100%);
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 8px 32px rgba(102, 126, 234, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 0 30px rgba(102, 126, 234, 0.2);
}

.filter-tabs {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 8px 16px;
  border: none;
  border-radius: 14px;
  background: none;
  color: #1C1C1E;
  cursor: pointer;
  font-size: 15px;
  transition: all 0.25s ease;
}

.filter-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.filter-btn.active {
  background-color: rgba(0, 0, 0, 0.05);
}

.badge {
  background: #FF3B30;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.75rem;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notification-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-left: 4px solid transparent;
  box-shadow: 
    0 4px 20px rgba(102, 126, 234, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.notification-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}

.notification-item:hover::before {
  left: 100%;
}

.notification-item:hover {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.12),
    0 0 60px rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.8);
}

.notification-item.unread {
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.15) 0%, rgba(52, 152, 219, 0.05) 100%);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-left-color: #3498db;
  border-color: rgba(52, 152, 219, 0.2);
}

.notification-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.notification-message {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notification-time {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.notification-action {
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
}

.action-taken {
  color: var(--accent-success);
  font-size: 0.85rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.batch-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}
</style>