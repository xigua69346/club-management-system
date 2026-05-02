const NOTIFICATION_TYPES = {
  APPROVAL: 'approval',
  ACTIVITY: 'activity',
  COMMENT: 'comment',
  LIKE: 'like',
  SYSTEM: 'system',
  MESSAGE: 'message'
};

class NotificationService {
  constructor(dataStore) {
    this.dataStore = dataStore;
    this.initDemoNotifications();
  }

  initDemoNotifications() {
    const existing = this._getNotifications();
    if (existing.length < 5) {
      const demoNotifications = [
        {
          id: Date.now() - 3600000,
          type: 'approval',
          title: '入团申请已通过',
          message: '恭喜！您加入「计算机协会」的申请已被批准，现在您是该社团的正式成员。',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          read: false,
          toUser: '张三',
          action: null
        },
        {
          id: Date.now() - 7200000,
          type: 'activity',
          title: '活动审批结果',
          message: '您发起的「编程大赛」活动已通过审批，可以开始筹备了！',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          read: false,
          toUser: '张三',
          action: null
        },
        {
          id: Date.now() - 86400000,
          type: 'system',
          title: '系统维护通知',
          message: '系统将于本周日凌晨2:00-4:00进行维护升级，期间可能影响部分功能使用。',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          read: true,
          toUser: null,
          action: null
        },
        {
          id: Date.now() - 10800000,
          type: 'comment',
          title: '有人评论了您的动态',
          message: '李四 在您的动态下评论：「太棒了！」',
          createdAt: new Date(Date.now() - 10800000).toISOString(),
          read: false,
          toUser: '张三',
          action: null
        },
        {
          id: Date.now() - 14400000,
          type: 'activity',
          title: '新活动提醒',
          message: '「志愿者协会」发布了新活动「社区服务日」，点击查看详情并报名参加！',
          createdAt: new Date(Date.now() - 14400000).toISOString(),
          read: true,
          toUser: '张三',
          action: {
            label: '立即报名',
            type: 'join_activity',
            data: { activityId: 123 },
            actionTaken: false
          }
        },
        {
          id: Date.now() - 172800000,
          type: 'like',
          title: '点赞提醒',
          message: '王五 点赞了您的动态',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          read: true,
          toUser: '张三',
          action: null
        }
      ];
      
      const mergedNotifications = [...demoNotifications, ...existing];
      const uniqueNotifications = mergedNotifications.filter((n, index, self) => 
        index === self.findIndex(t => t.id === n.id)
      );
      
      this._saveNotifications(uniqueNotifications);
    }
  }

  sendNotification(toUser, title, message, type = 'system', action = null) {
    const notification = {
      id: Date.now(),
      type: type,
      title: title,
      message: message,
      createdAt: new Date().toISOString(),
      read: false,
      toUser: toUser,
      action: action
    };
    
    const notifications = this._getNotifications();
    notifications.unshift(notification);
    this._saveNotifications(notifications);
    
    this._dispatchUpdate();
    return notification;
  }

  sendApprovalNotification(username, clubName, approved) {
    const title = approved ? '入团申请已通过' : '入团申请未通过';
    const message = approved 
      ? `恭喜！您加入「${clubName}」的申请已被批准，现在您是该社团的正式成员。`
      : `抱歉，您加入「${clubName}」的申请未通过审核。`;
    
    return this.sendNotification(username, title, message, NOTIFICATION_TYPES.APPROVAL);
  }

  sendActivityApprovalNotification(username, activityName, approved) {
    const title = approved ? '活动审批已通过' : '活动审批未通过';
    const message = approved
      ? `您发起的「${activityName}」活动已通过审批，可以开始筹备了！`
      : `您发起的「${activityName}」活动未通过审批，请修改后重新提交。`;
    
    return this.sendNotification(username, title, message, NOTIFICATION_TYPES.ACTIVITY);
  }

  sendNewActivityNotification(clubName, activityName) {
    const members = this.dataStore.getMembers();
    const clubMembers = members.filter(m => m.club === clubName);
    
    clubMembers.forEach(member => {
      const message = `「${clubName}」发布了新活动「${activityName}」，点击查看详情并报名参加！`;
      this.sendNotification(member.username, '新活动提醒', message, NOTIFICATION_TYPES.ACTIVITY, {
        label: '立即报名',
        type: 'join_activity',
        data: { activityName: activityName },
        actionTaken: false
      });
    });
  }

  sendCommentNotification(postAuthor, commenterName, content) {
    const message = `${commenterName} 在您的动态下评论：「${content}」`;
    return this.sendNotification(postAuthor, '新评论提醒', message, NOTIFICATION_TYPES.COMMENT);
  }

  sendReplyNotification(replyTo, replierName, content) {
    const message = `${replierName} 回复了您的评论：「${content}」`;
    return this.sendNotification(replyTo, '评论回复提醒', message, NOTIFICATION_TYPES.COMMENT);
  }

  sendLikeNotification(postAuthor, likerName) {
    const message = `${likerName} 点赞了您的动态`;
    return this.sendNotification(postAuthor, '点赞提醒', message, NOTIFICATION_TYPES.LIKE);
  }

  sendSystemNotification(title, message) {
    const users = this.dataStore.getUsers();
    users.forEach(user => {
      this.sendNotification(user.username, title, message, NOTIFICATION_TYPES.SYSTEM);
    });
  }

  sendMemberDeletedNotification(username, clubName, deletedBy) {
    const message = `${deletedBy} 将您从「${clubName}」社团中移除了。`;
    return this.sendNotification(username, '成员移除通知', message, NOTIFICATION_TYPES.SYSTEM);
  }

  sendPostDeletedNotification(postAuthor, deletedBy) {
    const message = `${deletedBy} 删除了您的一条动态。`;
    return this.sendNotification(postAuthor, '动态删除通知', message, NOTIFICATION_TYPES.SYSTEM);
  }

  sendActivityDeletedNotification(activityAuthor, activityName, deletedBy) {
    const message = `${deletedBy} 删除了您发起的活动「${activityName}」。`;
    return this.sendNotification(activityAuthor, '活动删除通知', message, NOTIFICATION_TYPES.SYSTEM);
  }

  sendClubDeletedNotification(clubName, deletedBy) {
    const members = this.dataStore.getMembers().filter(m => m.club === clubName);
    members.forEach(member => {
      const message = `${deletedBy} 删除了「${clubName}」社团，您在该社团的成员资格也已取消。`;
      this.sendNotification(member.username, '社团解散通知', message, NOTIFICATION_TYPES.SYSTEM);
    });
  }

  sendMemberJoinedNotification(leaderUsername, newMemberName, clubName) {
    const message = `${newMemberName} 成功加入了「${clubName}」社团。`;
    return this.sendNotification(leaderUsername, '新成员加入', message, NOTIFICATION_TYPES.SYSTEM);
  }

  sendMemberLeftNotification(leaderUsername, memberName, clubName) {
    const message = `${memberName} 离开了「${clubName}」社团。`;
    return this.sendNotification(leaderUsername, '成员退出通知', message, NOTIFICATION_TYPES.SYSTEM);
  }

  getUserNotifications(username) {
    const notifications = this._getNotifications();
    return notifications.filter(n => n.toUser === username || !n.toUser);
  }

  markAsRead(notificationId, username) {
    const notifications = this._getNotifications();
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && notification.toUser === username) {
      notification.read = true;
      this._saveNotifications(notifications);
      this._dispatchUpdate();
    }
  }

  markAllAsRead(username) {
    const notifications = this._getNotifications();
    notifications.forEach(n => {
      if (n.toUser === username || !n.toUser) {
        n.read = true;
      }
    });
    this._saveNotifications(notifications);
    this._dispatchUpdate();
  }

  deleteNotification(notificationId) {
    const notifications = this._getNotifications();
    const filtered = notifications.filter(n => n.id !== notificationId);
    this._saveNotifications(filtered);
    this._dispatchUpdate();
  }

  deleteAllRead(username) {
    const notifications = this._getNotifications();
    const filtered = notifications.filter(n => {
      const isUserNotification = n.toUser === username || !n.toUser;
      return !(isUserNotification && n.read);
    });
    this._saveNotifications(filtered);
    this._dispatchUpdate();
  }

  getUnreadCount(username) {
    const notifications = this.getUserNotifications(username);
    return notifications.filter(n => !n.read).length;
  }

  _getNotifications() {
    const stored = localStorage.getItem('notifications');
    return stored ? JSON.parse(stored) : [];
  }

  _saveNotifications(notifications) {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }

  _dispatchUpdate() {
    window.dispatchEvent(new Event('notifications-updated'));
  }
}

export { NOTIFICATION_TYPES };
export default NotificationService;