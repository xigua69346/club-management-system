// 高校社团信息管理系统 API 服务
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.ARK_API_KEY || "ark-76ef5953-5420-4304-ad4e-44128e001052-68194";
const TEXT_MODEL = "ep-20260429172654-8n967";
const IMAGE_MODEL = "doubao-seedream-4-0-250828";

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILES = {
  activitySignups: path.join(DATA_DIR, 'activitySignups.json'),
  clubs: path.join(DATA_DIR, 'clubs.json'),
  members: path.join(DATA_DIR, 'members.json'),
  activities: path.join(DATA_DIR, 'activities.json'),
  materials: path.join(DATA_DIR, 'materials.json'),
  users: path.join(DATA_DIR, 'users.json'),
  aiHistory: path.join(DATA_DIR, 'aiHistory.json'),
  posts: path.join(DATA_DIR, 'posts.json'),
  notices: path.join(DATA_DIR, 'notices.json'),
  approvalRequests: path.join(DATA_DIR, 'approvalRequests.json')
};

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
    { id: 1, content: '今天参加了编程大赛，收获满满！', author: '张三', club: '计算机协会', likes: 12, comments: ['太棒了！', '恭喜恭喜'], createdAt: '2024-12-01 18:30' },
    { id: 2, content: '诗歌朗诵会圆满结束，感谢大家支持！', author: '李四', club: '文学社', likes: 25, comments: ['期待下次', '朗诵很棒'], createdAt: '2024-11-15 21:30' },
    { id: 3, content: '篮球友谊赛即将开始，欢迎观赛！', author: '王五', club: '篮球队', likes: 18, comments: ['一定到！'], createdAt: '2024-12-10 14:00' }
  ],
  notices: [
    { id: 1, title: '社团招新开始啦！', content: '新学期社团招新活动将于下周一正式开始，欢迎同学踊跃报名。', author: 'admin', createdAt: '2024-09-01', type: '系统通知' },
    { id: 2, title: '编程大赛获奖名单', content: '恭喜以下同学获奖：一等奖：张三，二等奖：李四，三等奖：王五', author: '张三', createdAt: '2024-12-02', type: '活动通知' },
    { id: 3, title: '安全提醒', content: '近期请注意校园安全，保管好个人物品。', author: 'admin', createdAt: '2024-11-20', type: '系统通知' }
  ],
  approvalRequests: []
};

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function initDataFiles() {
  Object.keys(DATA_FILES).forEach((key) => {
    if (!fs.existsSync(DATA_FILES[key])) {
      fs.writeFileSync(DATA_FILES[key], JSON.stringify(defaultData[key], null, 2));
    }
  });
}
initDataFiles();

function readDataFile(key) {
  try {
    if (!fs.existsSync(DATA_FILES[key])) {
      return [];
    }
    const data = fs.readFileSync(DATA_FILES[key], 'utf8');
    return JSON.parse(data);
  } catch (e) {
    console.error(`Failed to read ${key} data:`, e);
    return [];
  }
}

function writeDataFile(key, data) {
  try {
    fs.writeFileSync(DATA_FILES[key], JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    console.error(`Failed to write ${key} data:`, e);
    return false;
  }
}

app.get('/api/data/:type', (req, res) => {
  const { type } = req.params;
  if (DATA_FILES[type]) {
    const data = readDataFile(type);
    res.json(data);
  } else {
    res.status(404).json({ error: 'Data type not found' });
  }
});

app.put('/api/data/:type', (req, res) => {
  const { type } = req.params;
  const { data } = req.body;
  if (DATA_FILES[type]) {
    const success = writeDataFile(type, data);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Failed to write data' });
    }
  } else {
    res.status(404).json({ error: 'Data type not found' });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await axios.post("https://ark.cn-beijing.volces.com/api/v3/chat/completions", {
      model: TEXT_MODEL,
      messages: [{ role: "user", content: message }]
    }, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error("聊天API错误：", err.response?.data || err.message);
    res.status(500).json({
      error: "请求失败",
      detail: err.response?.data || err.message
    });
  }
});

app.post("/api/generate-poster", async (req, res) => {
  try {
    const { prompt, width = 1024, height = 1024 } = req.body;
    if (!prompt) return res.status(400).json({ error: '缺少prompt' });

    let size = "2K";
    if (width === 1024 && height === 1536) size = "1024x1536";
    else if (width === 1536 && height === 1024) size = "1536x1024";

    const response = await axios.post("https://ark.cn-beijing.volces.com/api/v3/images/generations", {
      model: IMAGE_MODEL,
      prompt: prompt,
      size: size,
      sequential_image_generation: "disabled",
      response_format: "url",
      watermark: false
    }, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const imageUrl = response.data.data?.[0]?.url;
    if (!imageUrl) throw new Error('未获取到图片URL');
    res.json({ success: true, image_url: imageUrl });
  } catch (err) {
    console.error("海报生成错误：", err.response?.data || err.message);
    res.status(500).json({
      error: "生成失败",
      detail: err.response?.data || err.message
    });
  }
});

app.listen(3001, () => {
  console.log("服务已启动：http://localhost:3001");
});
