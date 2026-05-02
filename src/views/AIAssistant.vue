<template>
  <!-- AI辅助生成：豆包AI助手, 2026-04 -->
  <div class="ai-assistant-page">
    <div class="card">
      <h2>🤖 AI助手</h2>
      <p class="subtitle">有什么问题我可以帮你解答！</p>
      
      <div class="chat-container">
        <div class="chat-messages">
          <div class="message assistant-message">
            <div class="avatar">🤖</div>
            <div class="content">
              <p>你好！我是西瓜，你的AI助手。有什么问题我可以帮你解答？</p>
            </div>
          </div>
          
          <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.type]">
            <div class="avatar">{{ msg.type === 'user' ? '👤' : '🤖' }}</div>
            <div class="content">
              <p>{{ msg.content }}</p>
            </div>
          </div>
          
          <div v-if="isLoading" class="message assistant-message">
            <div class="avatar">🤖</div>
            <div class="content">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="input-area">
          <input 
            type="text" 
            v-model="inputMessage" 
            placeholder="输入你的问题..."
            @keyup.enter="sendMessage(inputMessage)"
          />
          <button class="send-btn" @click="sendMessage(inputMessage)" :disabled="!inputMessage || isLoading">
            发送
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// AI辅助生成：豆包AI助手, 2026-04
import DataStore from '../stores/DataStore';

export default {
  name: 'AIAssistant',
  data() {
    return {
      messages: [],
      inputMessage: '',
      isLoading: false,
      currentUser: null,
      dataStore: DataStore
    }
  },
  mounted() {
    this.loadUserInfo();
    this.loadChatHistory();
  },
  methods: {
    loadUserInfo() {
      const userInfo = localStorage.getItem('userInfo');
      this.currentUser = userInfo ? JSON.parse(userInfo) : null;
    },
    getChatStorageKey() {
      if (!this.currentUser?.username) return null;
      return `chatHistory_${this.currentUser.username}`;
    },
    saveChatHistory() {
      const key = this.getChatStorageKey();
      if (key) {
        localStorage.setItem(key, JSON.stringify(this.messages));
      }
    },
    loadChatHistory() {
      const key = this.getChatStorageKey();
      if (key) {
        const savedHistory = localStorage.getItem(key);
        if (savedHistory) {
          try {
            this.messages = JSON.parse(savedHistory);
          } catch (e) {
            console.error('加载聊天记录失败:', e);
            this.messages = [];
          }
        }
      }
    },
    // AI辅助生成：豆包AI助手, 2026-04 - 发送消息并调用AI
    async sendMessage(message) {
      if (!message.trim() || this.isLoading) return;
      
      this.messages.push({ type: 'user', content: message.trim() });
      this.inputMessage = '';
      this.isLoading = true;
      
      try {
        const response = await this.callAI(message.trim());
        this.messages.push({ type: 'assistant', content: response });
        this.saveChatHistory();
      } catch (error) {
        console.error('AI调用失败:', error);
        this.messages.push({ 
          type: 'assistant', 
          content: '抱歉，我暂时无法回答这个问题，请稍后再试。' 
        });
        this.saveChatHistory();
      } finally {
        this.isLoading = false;
      }
    },
    
    // AI辅助生成：豆包AI助手, 2026-04 - 调用AI聊天接口（使用豆包Doubao-1.5-lite-32k模型）
    async callAI(message) {
      const prompt = this.buildPrompt(message);
      
      console.log('=== 开始调用豆包Doubao-1.5-lite-32k ===');
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: prompt
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.choices && result.choices.length > 0) {
          return result.choices[0].message?.content || result.choices[0].text || '收到你的问题了！';
        }
      }
      
      return this.getDefaultResponse(message);
    },
    
    // AI辅助生成：豆包AI助手, 2026-04 - 构建AI对话提示词
    buildPrompt(message) {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const clubs = this.dataStore.getClubs();
      const activities = this.dataStore.getActivities();
      
      let context = `你是一个高校社团信息管理系统的AI助手，名字叫西瓜。当前用户信息：`;
      if (userInfo.username) {
        context += `用户名：${userInfo.username}，角色：${userInfo.role === 'admin' ? '系统管理员' : userInfo.role === 'leader' ? '社团负责人' : userInfo.role === 'advisor' ? '社团指导老师' : '普通成员'}`;
        if (userInfo.club) {
          context += `，所属社团：${userInfo.club}`;
        }
      }
      
      context += `\n\n当前社团列表：${clubs.map(c => c.name).join('、')}`;
      
      const recentActivities = activities.slice(0, 5);
      context += `\n\n近期活动：${recentActivities.map(a => `${a.name}（${a.club}）`).join('、')}`;
      
      context += `\n\n用户问题：${message}`;
      
      return context;
    },
    
    getDefaultResponse(message) {
      const responses = {
        '你叫什么': '我叫西瓜，是来协助你管理高校社团信息系统的AI助手！',
        '社团活动有哪些': '目前有以下社团活动：编程大赛、诗歌朗诵会、校际篮球友谊赛、社区服务日、摄影作品展等。你可以在活动管理页面查看详情。',
        '如何加入社团': '你可以在个人中心点击"申请新社团"，选择想要加入的社团提交申请，等待社团负责人或指导老师审核通过即可。',
        '最近的志愿活动': '近期的志愿活动有社区服务日，由志愿者协会组织。你可以在活动管理页面查看详情并报名参加。',
        '如何发布动态': '登录后进入广场页面，点击发布按钮即可发布动态。',
        '怎么查看积分排行': '点击导航栏的"积分排行"即可查看个人和社团的积分排名。',
        '社团负责人是谁': '各社团负责人：计算机协会-张三、文学社-李四、篮球队-王五、志愿者协会-赵六、摄影社-孙七。',
        '如何申请活动': '社团负责人可以在活动管理页面点击"添加活动"，填写活动信息后提交审批。',
        '资料在哪里下载': '进入资料管理页面，选择你所在社团的资料即可下载。',
        '怎么修改个人信息': '点击导航栏的"个人中心"，可以修改姓名、性别、专业、联系方式等信息。',
        '有哪些培训讲座': '目前系统中有Python编程入门、摄影构图分析等培训资料，你可以在资料管理页面查看。'
      };
      
      for (const [key, value] of Object.entries(responses)) {
        if (message.includes(key)) {
          return value;
        }
      }
      
      return `感谢你的提问！关于"${message}"，你可以在系统中相关模块查看详细信息。如果有其他问题，随时问我！`;
    }
  }
}
</script>

<style scoped>
.ai-assistant-page {
  max-width: 700px;
  margin: 0 auto;
}

.subtitle {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.chat-container {
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
}

.chat-messages {
  padding: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.message {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.message.assistant-message {
  justify-content: flex-start;
}

.message.user {
  justify-content: flex-end;
}

.message.user .content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 4px 12px;
}

.message.assistant-message .content {
  background: white;
  border: 1px solid #eee;
  border-radius: 12px 12px 12px 4px;
}

.avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.content {
  max-width: 70%;
  padding: 0.75rem 1rem;
}

.content p {
  margin: 0;
  line-height: 1.5;
}

.typing-indicator {
  display: flex;
  gap: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.quick-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #eee;
}

.quick-btn {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-btn:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.input-area {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border-top: 1px solid #eee;
  background: white;
}

.input-area input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
}

.input-area input:focus {
  outline: none;
  border-color: #667eea;
}

.send-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s;
}

.send-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>