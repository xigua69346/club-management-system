import { reactive, watch } from 'vue';

// 默认数据
const defaultData = {
  activitySignups: [
    { id: 1, activityId: 1, username: '张三', status: '已签到', signupTime: '2024-12-01 13:30' },
    { id: 2, activityId: 1, username: '小张', status: '已签到', signupTime: '2024-12-01 13:45' },
    { id: 3, activityId: 2, username: '李四', status: '已签到', signupTime: '2024-11-15 18:30' },
    { id: 4, activityId: 4, username: '赵六', status: '已签到', signupTime: '2024-11-25 08:30' },
    { id: 5, activityId: 4, username: '小张', status: '已签到', signupTime: '2024-11-25 08:45' },
    { id: 6, activityId: 3, username: '王五', status: '已报名', signupTime: '2024-12-01 10:00' },
    { id: 7, activityId: 5, username: '孙七', status: '已报名', signupTime: '2024-12-05 09:00' }
  ],
  clubs: [
    { id: 1, name: '计算机协会', category: '学术科技', establishmentDate: '2020-09-01', leader: '张三', advisor: '王老师', memberCount: 2, status: '正常', description: '致力于计算机技术研究与交流' },
    { id: 2, name: '文学社', category: '文化艺术', establishmentDate: '2019-09-01', leader: '李四', advisor: '李老师', memberCount: 2, status: '正常', description: '以文学创作为核心的社团' },
    { id: 3, name: '篮球队', category: '体育健身', establishmentDate: '2018-09-01', leader: '王五', advisor: '张老师', memberCount: 2, status: '正常', description: '推广篮球运动的体育社团' },
    { id: 4, name: '志愿者协会', category: '公益服务', establishmentDate: '2021-09-01', leader: '赵六', advisor: '刘老师', memberCount: 2, status: '正常', description: '组织各类志愿者服务活动' },
    { id: 5, name: '摄影社', category: '文化艺术', establishmentDate: '2022-09-01', leader: '孙七', advisor: '陈老师', memberCount: 2, status: '正常', description: '为摄影爱好者提供交流平台' }
  ],
  members: [
    { id: 1, name: '张三', gender: '男', major: '计算机科学', club: '计算机协会', role: '负责人', contact: '13800138001', status: '活跃', username: '张三', password: '123321', joinDate: '2020-09-01', points: 250, avatar: '👨' },
    { id: 2, name: '王老师', gender: '男', major: '计算机科学', club: '计算机协会', role: '社团指导老师', contact: '13800138002', status: '活跃', username: '王老师', password: '123321', joinDate: '2020-09-01', points: 180, avatar: '👨‍🏫' },
    { id: 3, name: '李四', gender: '女', major: '中文', club: '文学社', role: '负责人', contact: '13800138003', status: '活跃', username: '李四', password: '123321', joinDate: '2019-09-01', points: 220, avatar: '👩' },
    { id: 4, name: '李老师', gender: '女', major: '中文', club: '文学社', role: '社团指导老师', contact: '13800138004', status: '活跃', username: '李老师', password: '123321', joinDate: '2019-09-01', points: 160, avatar: '👩‍🏫' },
    { id: 5, name: '王五', gender: '男', major: '体育', club: '篮球队', role: '负责人', contact: '13800138005', status: '活跃', username: '王五', password: '123321', joinDate: '2018-09-01', points: 190, avatar: '👨' },
    { id: 6, name: '张老师', gender: '男', major: '体育', club: '篮球队', role: '社团指导老师', contact: '13800138006', status: '活跃', username: '张老师', password: '123321', joinDate: '2018-09-01', points: 140, avatar: '👨‍🏫' },
    { id: 7, name: '赵六', gender: '男', major: '社会学', club: '志愿者协会', role: '负责人', contact: '13800138007', status: '活跃', username: '赵六', password: '123321', joinDate: '2021-09-01', points: 230, avatar: '👨' },
    { id: 8, name: '刘老师', gender: '女', major: '社会学', club: '志愿者协会', role: '社团指导老师', contact: '13800138008', status: '活跃', username: '刘老师', password: '123321', joinDate: '2021-09-01', points: 170, avatar: '👩‍🏫' },
    { id: 9, name: '孙七', gender: '女', major: '艺术设计', club: '摄影社', role: '负责人', contact: '13800138009', status: '活跃', username: '孙七', password: '123321', joinDate: '2022-09-01', points: 200, avatar: '👩' },
    { id: 10, name: '陈老师', gender: '男', major: '艺术设计', club: '摄影社', role: '社团指导老师', contact: '13800138010', status: '活跃', username: '陈老师', password: '123321', joinDate: '2022-09-01', points: 150, avatar: '👨‍🏫' },
    { id: 11, name: '小张', gender: '男', major: '软件工程', club: '计算机协会', role: '普通成员', contact: '13800138011', status: '活跃', username: '小张', password: '123321', joinDate: '2024-09-01', points: 50, avatar: '👨‍🎓' },
    { id: 12, name: '小张', gender: '男', major: '软件工程', club: '文学社', role: '普通成员', contact: '13800138011', status: '活跃', username: '小张', password: '123321', joinDate: '2024-10-01', points: 30, avatar: '👨‍🎓' }
  ],
  activities: [
    { id: 1, name: '编程大赛', type: '学术竞赛', club: '计算机协会', description: '一年一度的编程竞赛活动', startTime: '2024-12-01 14:00', endTime: '2024-12-01 18:00', location: '教学楼A栋301', budget: 2000, participants: 50, status: '已完成', createdAt: '2024-11-01' },
    { id: 2, name: '诗歌朗诵会', type: '文艺演出', club: '文学社', description: '展示文学社员风采的诗歌朗诵活动', startTime: '2024-11-15 19:00', endTime: '2024-11-15 21:00', location: '大学生活动中心', budget: 1000, participants: 80, status: '已完成', createdAt: '2024-10-15' },
    { id: 3, name: '校际篮球友谊赛', type: '体育赛事', club: '篮球队', description: '与其他高校的篮球交流比赛', startTime: '2024-12-10 15:00', endTime: '2024-12-10 17:00', location: '学校体育馆', budget: 1500, participants: 20, status: '待审批', createdAt: '2024-11-20' },
    { id: 4, name: '社区服务日', type: '志愿服务', club: '志愿者协会', description: '进入社区开展清洁服务', startTime: '2024-11-25 09:00', endTime: '2024-11-25 12:00', location: '光明社区', budget: 500, participants: 30, status: '已完成', createdAt: '2024-11-10' },
    { id: 5, name: '摄影作品展', type: '文艺演出', club: '摄影社', description: '展示社员优秀摄影作品', startTime: '2024-12-08 10:00', endTime: '2024-12-15 17:00', location: '图书馆展厅', budget: 800, participants: 0, status: '进行中', createdAt: '2024-11-25' }
  ],
  materials: [
    { id: 1, name: 'Python编程入门.pdf', club: '计算机协会', category: '文档', uploader: '张三', uploadTime: '2024-11-01 10:30', size: '2.5MB', description: 'Python编程基础教程' },
    { id: 2, name: '诗歌选集.docx', club: '文学社', category: '文档', uploader: '李四', uploadTime: '2024-11-10 14:20', size: '1.2MB', description: '经典诗歌作品集' },
    { id: 3, name: '篮球训练计划.pdf', club: '篮球队', category: '文档', uploader: '王五', uploadTime: '2024-11-15 09:15', size: '500KB', description: '篮球队日常训练计划' },
    { id: 4, name: '志愿者服务手册.pdf', club: '志愿者协会', category: '文档', uploader: '赵六', uploadTime: '2024-11-18 16:45', size: '800KB', description: '志愿者服务指南' },
    { id: 5, name: '摄影构图分析.pdf', club: '摄影社', category: '文档', uploader: '孙七', uploadTime: '2024-11-20 11:00', size: '3.2MB', description: '摄影构图知识分享' }
  ],
  users: [
    { username: 'admin', password: 'admin123', role: 'admin', club: '', status: '活跃', avatar: '👤' },
    { username: '张三', password: '123321', role: 'leader', club: '计算机协会', status: '活跃', avatar: '👨' },
    { username: '王老师', password: '123321', role: 'advisor', club: '计算机协会', status: '活跃', avatar: '👨‍🏫' },
    { username: '李四', password: '123321', role: 'leader', club: '文学社', status: '活跃', avatar: '👩' },
    { username: '李老师', password: '123321', role: 'advisor', club: '文学社', status: '活跃', avatar: '👩‍🏫' },
    { username: '王五', password: '123321', role: 'leader', club: '篮球队', status: '活跃', avatar: '👨' },
    { username: '张老师', password: '123321', role: 'advisor', club: '篮球队', status: '活跃', avatar: '👨‍🏫' },
    { username: '赵六', password: '123321', role: 'leader', club: '志愿者协会', status: '活跃', avatar: '👨' },
    { username: '刘老师', password: '123321', role: 'advisor', club: '志愿者协会', status: '活跃', avatar: '👩‍🏫' },
    { username: '孙七', password: '123321', role: 'leader', club: '摄影社', status: '活跃', avatar: '👩' },
    { username: '陈老师', password: '123321', role: 'advisor', club: '摄影社', status: '活跃', avatar: '👨‍🏫' },
    { username: '小张', password: '123321', role: 'member', club: '计算机协会', status: '活跃', avatar: '👨‍🎓' }
  ],
  aiHistory: [],
  posts: [
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
  ],
  notices: [
    { id: 1, title: '社团招新开始啦！', content: '新学期社团招新活动将于下周一正式开始，欢迎同学踊跃报名。', author: 'admin', createdAt: '2024-09-01', type: '系统通知' },
    { id: 2, title: '编程大赛获奖名单', content: '恭喜以下同学获奖：一等奖：张三，二等奖：李四，三等奖：王五', author: '张三', createdAt: '2024-12-02', type: '活动通知' },
    { id: 3, title: '安全提醒', content: '近期请注意校园安全，保管好个人物品。', author: 'admin', createdAt: '2024-11-20', type: '系统通知' }
  ],
  approvalRequests: []
};

const API_BASE = '/api/data';

// 加载数据
async function loadFromAPI(key) {
  try {
    const response = await fetch(`${API_BASE}/${key}`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        return data;
      }
    }
  } catch (e) {
    console.error('Failed to load from API:', e);
  }
  return defaultData[key] || [];
}

// 保存数据
async function saveToAPI(key, data) {
  try {
    await fetch(`${API_BASE}/${key}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data })
    });
  } catch (e) {
    console.error('Failed to save to API:', e);
  }
}

const store = reactive({
  activitySignups: [],
  clubs: [],
  members: [],
  activities: [],
  materials: [],
  users: [],
  aiHistory: [],
  posts: [],
  notices: [],
  approvalRequests: [],
  loaded: false
});

// 初始化加载所有数据
async function initStore() {
  store.activitySignups = await loadFromAPI('activitySignups');
  store.clubs = await loadFromAPI('clubs');
  store.members = await loadFromAPI('members');
  store.activities = await loadFromAPI('activities');
  store.materials = await loadFromAPI('materials');
  store.users = await loadFromAPI('users');
  store.aiHistory = await loadFromAPI('aiHistory');
  store.posts = await loadFromAPI('posts');
  store.notices = await loadFromAPI('notices');
  store.approvalRequests = await loadFromAPI('approvalRequests');
  store.loaded = true;
  
  // 设置监听
  watch(() => store.activitySignups, (val) => { saveToAPI('activitySignups', val); window.dispatchEvent(new Event('data-updated')); }, { deep: true });
  watch(() => store.clubs, (val) => { saveToAPI('clubs', val); window.dispatchEvent(new Event('data-updated')); }, { deep: true });
  watch(() => store.members, (val) => { saveToAPI('members', val); window.dispatchEvent(new Event('data-updated')); }, { deep: true });
  watch(() => store.activities, (val) => { saveToAPI('activities', val); window.dispatchEvent(new Event('data-updated')); }, { deep: true });
  watch(() => store.materials, (val) => { saveToAPI('materials', val); window.dispatchEvent(new Event('data-updated')); }, { deep: true });
  watch(() => store.users, (val) => { saveToAPI('users', val); window.dispatchEvent(new Event('data-updated')); }, { deep: true });
  watch(() => store.aiHistory, (val) => { saveToAPI('aiHistory', val); window.dispatchEvent(new Event('data-updated')); }, { deep: true });
  watch(() => store.posts, (val) => { saveToAPI('posts', val); window.dispatchEvent(new Event('data-updated')); }, { deep: true });
  watch(() => store.notices, (val) => { saveToAPI('notices', val); window.dispatchEvent(new Event('data-updated')); }, { deep: true });
  watch(() => store.approvalRequests, (val) => { saveToAPI('approvalRequests', val); window.dispatchEvent(new Event('data-updated')); }, { deep: true });
}

initStore();

const DataStore = {
  store,
  
  getActivitySignups() {
    return store.activitySignups;
  },

  addActivitySignup(signup) {
    const newSignup = {
      ...signup,
      id: Date.now(),
      signupTime: signup.signupTime || new Date().toLocaleString('zh-CN'),
      status: signup.status || '已报名'
    };
    store.activitySignups.push(newSignup);
    return newSignup;
  },

  updateActivitySignup(id, updates) {
    const index = store.activitySignups.findIndex(s => s.id == id);
    if (index !== -1) {
      store.activitySignups[index] = { ...store.activitySignups[index], ...updates };
      return store.activitySignups[index];
    }
    return null;
  },

  deleteActivitySignup(id) {
    const index = store.activitySignups.findIndex(s => s.id == id);
    if (index !== -1) {
      return store.activitySignups.splice(index, 1)[0];
    }
    return null;
  },
  
  getClubs() {
    return store.clubs;
  },

  addClub(club) {
    const newClub = {
      ...club,
      id: Date.now(),
      memberCount: 0,
      status: '正常',
      establishmentDate: club.establishmentDate || new Date().toISOString().split('T')[0]
    };
    store.clubs.push(newClub);
    return newClub;
  },

  updateClub(id, updates) {
    const index = store.clubs.findIndex(c => c.id == id);
    if (index !== -1) {
      store.clubs[index] = { ...store.clubs[index], ...updates };
      return store.clubs[index];
    }
    return null;
  },

  deleteClub(id) {
    const index = store.clubs.findIndex(c => c.id == id);
    if (index !== -1) {
      const deleted = store.clubs.splice(index, 1)[0];
      
      // 级联删除社团相关的所有数据
      store.members = store.members.filter(m => m.club !== deleted.name);
      store.activities = store.activities.filter(a => a.club !== deleted.name);
      store.materials = store.materials.filter(m => m.club !== deleted.name);
      store.posts = store.posts.filter(p => p.club !== deleted.name);
      store.notices = store.notices.filter(n => n.club !== deleted.name);
      
      // 删除该社团关联的用户（如果用户只属于这一个社团）
      const membersInClub = store.members.filter(m => m.club === deleted.name);
      const usernamesInClub = membersInClub.map(m => m.username);
      
      store.users = store.users.filter(u => {
        // 保留admin，以及不在该社团的用户
        if (u.role === 'admin') return true;
        
        // 检查用户是否还在其他社团有成员记录
        const userHasOtherMembership = store.members.some(m => 
          m.username === u.username && m.club !== deleted.name
        );
        
        // 如果用户只属于这个社团，就删除用户
        if (userHasOtherMembership) return true;
        
        // 检查用户是否在这个社团
        if (u.club === deleted.name && !userHasOtherMembership) {
          return false;
        }
        
        return true;
      });
      
      return deleted;
    }
    return null;
  },

  getMembers() {
    return store.members;
  },

  addMember(member) {
    const existingMember = store.members.find(m => m.username === member.username && m.club === member.club);
    if (existingMember) {
      return null;
    }

    const newMember = {
      ...member,
      id: Date.now(),
      joinDate: member.joinDate || new Date().toISOString().split('T')[0],
      status: member.status || '待审核',
      points: member.points || 0
    };
    store.members.push(newMember);

    const club = store.clubs.find(c => c.name === member.club);
    if (club) {
      club.memberCount++;
    }

    return newMember;
  },

  updateMember(id, updates) {
    const index = store.members.findIndex(m => m.id == id);
    if (index !== -1) {
      const oldClub = store.members[index].club;
      store.members[index] = { ...store.members[index], ...updates };

      if (oldClub !== updates.club) {
        const oldClubData = store.clubs.find(c => c.name === oldClub);
        if (oldClubData) oldClubData.memberCount--;

        const newClubData = store.clubs.find(c => c.name === updates.club);
        if (newClubData) newClubData.memberCount++;
      }

      return store.members[index];
    }
    return null;
  },

  deleteMember(id) {
    const index = store.members.findIndex(m => m.id == id);
    if (index !== -1) {
      const deleted = store.members.splice(index, 1)[0];

      const club = store.clubs.find(c => c.name === deleted.club);
      if (club) {
        club.memberCount--;
      }

      return deleted;
    }
    return null;
  },

  getActivities() {
    return store.activities;
  },

  addActivity(activity) {
    const newActivity = {
      ...activity,
      id: Date.now(),
      status: '待审批',
      createdAt: new Date().toISOString()
    };
    store.activities.push(newActivity);
    return newActivity;
  },

  updateActivity(id, updates) {
    const index = store.activities.findIndex(a => a.id == id);
    if (index !== -1) {
      store.activities[index] = { ...store.activities[index], ...updates };
      return store.activities[index];
    }
    return null;
  },

  deleteActivity(id) {
    const index = store.activities.findIndex(a => a.id == id);
    if (index !== -1) {
      return store.activities.splice(index, 1)[0];
    }
    return null;
  },

  getMaterials() {
    return store.materials;
  },

  addMaterial(material) {
    const newMaterial = {
      ...material,
      id: Date.now(),
      uploadTime: new Date().toLocaleString('zh-CN')
    };
    store.materials.push(newMaterial);
    return newMaterial;
  },

  updateMaterial(id, updates) {
    const index = store.materials.findIndex(m => m.id == id);
    if (index !== -1) {
      store.materials[index] = { ...store.materials[index], ...updates };
      return store.materials[index];
    }
    return null;
  },

  deleteMaterial(id) {
    const index = store.materials.findIndex(m => m.id == id);
    if (index !== -1) {
      return store.materials.splice(index, 1)[0];
    }
    return null;
  },

  getUsers() {
    return store.users;
  },

  addUser(user) {
    const existingUser = store.users.find(u => u.username === user.username);
    if (existingUser) {
      return null;
    }

    const newUser = {
      ...user,
      id: Date.now()
    };
    store.users.push(newUser);
    return newUser;
  },

  updateUser(id, updates) {
    const index = store.users.findIndex(u => u.id == id || u.username === id);
    if (index !== -1) {
      store.users[index] = { ...store.users[index], ...updates };
      return store.users[index];
    }
    return null;
  },

  deleteUser(id) {
    const index = store.users.findIndex(u => u.id == id || u.username === id);
    if (index !== -1) {
      const deleted = store.users.splice(index, 1)[0];
      
      // 级联删除该用户的所有成员记录
      const memberIndices = [];
      store.members = store.members.filter(m => {
        if (m.username === deleted.username) {
          // 更新社团成员数
          const club = store.clubs.find(c => c.name === m.club);
          if (club && club.memberCount > 0) {
            club.memberCount--;
          }
          return false;
        }
        return true;
      });
      
      return deleted;
    }
    return null;
  },

  getAIHistory() {
    return store.aiHistory;
  },

  addAIHistory(item) {
    store.aiHistory.unshift({ ...item, time: new Date().toLocaleString('zh-CN') });
    if (store.aiHistory.length > 50) {
      store.aiHistory.pop();
    }
  },

  clearAIHistory() {
    store.aiHistory = [];
  },

  checkUserExists(username) {
    return store.users.some(u => u.username === username);
  },

  checkMemberExists(username, club) {
    return store.members.some(m => m.username === username && m.club === club);
  },

  getPosts() {
    return store.posts;
  },

  addPost(post) {
    const newPost = {
      ...post,
      id: Date.now(),
      likes: 0,
      comments: [],
      createdAt: new Date().toLocaleString('zh-CN')
    };
    store.posts.unshift(newPost);
    return newPost;
  },

  updatePost(id, updates) {
    const index = store.posts.findIndex(p => p.id == id);
    if (index !== -1) {
      store.posts[index] = { ...store.posts[index], ...updates };
      return store.posts[index];
    }
    return null;
  },

  deletePost(id) {
    const index = store.posts.findIndex(p => p.id == id);
    if (index !== -1) {
      return store.posts.splice(index, 1)[0];
    }
    return null;
  },

  getNotices() {
    return store.notices;
  },

  addNotice(notice) {
    const newNotice = {
      ...notice,
      id: Date.now(),
      createdAt: new Date().toLocaleString('zh-CN'),
      type: notice.type || '系统通知'
    };
    store.notices.unshift(newNotice);
    return newNotice;
  },

  updateNotice(id, updates) {
    const index = store.notices.findIndex(n => n.id == id);
    if (index !== -1) {
      store.notices[index] = { ...store.notices[index], ...updates };
      return store.notices[index];
    }
    return null;
  },

  deleteNotice(id) {
    const index = store.notices.findIndex(n => n.id == id);
    if (index !== -1) {
      return store.notices.splice(index, 1)[0];
    }
    return null;
  },

  getApprovalRequests() {
    return store.approvalRequests;
  },

  addApprovalRequest(request) {
    const newRequest = {
      ...request,
      id: 'AR' + Date.now()
    };
    store.approvalRequests.push(newRequest);
    return newRequest;
  },

  updateApprovalRequest(id, updates) {
    const index = store.approvalRequests.findIndex(r => r.id == id);
    if (index !== -1) {
      store.approvalRequests[index] = { ...store.approvalRequests[index], ...updates };
      return store.approvalRequests[index];
    }
    return null;
  },

  deleteApprovalRequest(id) {
    const index = store.approvalRequests.findIndex(r => r.id == id);
    if (index !== -1) {
      return store.approvalRequests.splice(index, 1)[0];
    }
    return null;
  }
};

export default DataStore;
