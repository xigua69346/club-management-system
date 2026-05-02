<template>
  <div class="ai-copywriter">
    <div class="card">
      <div class="feature-header">
        <div class="feature-icon">🤖</div>
        <div class="feature-title">
          <h2>AI文案助手</h2>
          <div class="feature-tags">
            <span class="tag">📋 活动策划书</span>
            <span class="tag">📣 宣传文案</span>
          </div>
        </div>
      </div>
      <p class="feature-desc">一键生成专业的活动策划书与宣传文案，让活动筹备更高效</p>
      
      <div class="input-section">
        <div class="form-row">
          <div class="form-group">
            <label for="activityTheme">活动主题</label>
            <input type="text" id="activityTheme" v-model="inputData.theme" placeholder="例如：校园编程大赛、社团文化节">
          </div>
          <div class="form-group">
            <label for="activityType">活动类型</label>
            <select id="activityType" v-model="inputData.type">
              <option value="学术竞赛">学术竞赛</option>
              <option value="文艺演出">文艺演出</option>
              <option value="体育赛事">体育赛事</option>
              <option value="志愿服务">志愿服务</option>
              <option value="培训讲座">培训讲座</option>
              <option value="其他">其他</option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="budget">活动预算（元）</label>
            <input type="number" id="budget" v-model="inputData.budget" placeholder="例如：2000">
          </div>
          <div class="form-group">
            <label for="scale">活动规模（人数）</label>
            <input type="number" id="scale" v-model="inputData.scale" placeholder="例如：100">
          </div>
        </div>
        
        <button class="btn btn-primary generate-btn" @click="generateContent" :disabled="generating">
          {{ generating ? '生成中...' : '✨ 一键生成' }}
        </button>
      </div>
      
      <div class="output-section" v-if="generatedContent">
        <div class="tabs">
          <button 
            v-for="(tab, index) in tabs" 
            :key="index"
            :class="['tab', { active: activeTab === index }]"
            @click="activeTab = index"
          >
            {{ tab.name }}
          </button>
        </div>
        
        <div class="tab-content">
          <div class="content-editor">
            <textarea v-model="currentContent" rows="20"></textarea>
          </div>
          
          <div class="action-buttons">
            <button class="btn btn-secondary" @click="copyContent">📋 复制</button>
            <button class="btn btn-primary" @click="saveContent">💾 保存</button>
          </div>
        </div>
      </div>
      
      <div class="saved-history" v-if="savedItems.length > 0">
        <h3>📚 历史记录</h3>
        <div class="history-list">
          <div class="history-item" v-for="(item, index) in savedItems" :key="index">
            <div class="history-info">
              <h4>{{ item.theme }} ({{ item.type }})</h4>
              <p class="history-meta">{{ item.time }} | 预算: ¥{{ item.budget }} | 规模: {{ item.scale }}人</p>
            </div>
            <div class="history-actions">
              <button class="btn btn-sm btn-secondary" @click="loadItem(item)">加载</button>
              <button class="btn btn-sm btn-danger" @click="deleteItem(index)">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AICopywriter',
  data() {
    return {
      inputData: {
        theme: '',
        type: '学术竞赛',
        budget: '',
        scale: ''
      },
      generating: false,
      generatedContent: null,
      activeTab: 0,
      tabs: [
        { name: '📋 活动策划书', key: 'plan' },
        { name: '📣 宣传文案', key: 'promotion' }
      ],
      savedItems: []
    }
  },
  computed: {
    currentContent: {
      get() {
        if (!this.generatedContent) return '';
        return this.generatedContent[this.tabs[this.activeTab].key] || '';
      },
      set(value) {
        if (this.generatedContent) {
          this.generatedContent[this.tabs[this.activeTab].key] = value;
        }
      }
    }
  },
  mounted() {
    this.loadHistory();
  },
  methods: {
    async generateContent() {
      if (!this.inputData.theme) {
        alert('请输入活动主题！');
        return;
      }
      
      this.generating = true;
      
      try {
        const plan = await this.generatePlanWithDoubao(this.inputData);
        const promotion = await this.generatePromotionWithDoubao(this.inputData);
        
        this.generatedContent = {
          plan,
          promotion,
          theme: this.inputData.theme,
          type: this.inputData.type,
          budget: this.inputData.budget,
          scale: this.inputData.scale,
          time: new Date().toLocaleString('zh-CN')
        };
        
        this.activeTab = 0;
      } catch (error) {
        console.error('生成失败:', error);
        alert('生成失败，请重试！');
      } finally {
        this.generating = false;
      }
    },
    
    async generatePlanWithDoubao(data) {
      const prompt = `请为"${data.theme}"(${data.type})活动生成一份完整的活动策划书，预算${data.budget || 2000}元，规模${data.scale || 100}人。包含：活动概况、活动目标、时间安排、预算明细、人员分工、注意事项等部分。输出格式为markdown。`;
      
      console.log('=== 开始调用豆包Doubao-1.5-lite-32k生成策划书 ===');
      
      try {
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
            const content = result.choices[0].message?.content || result.choices[0].text;
            console.log('策划书生成成功:', content.substring(0, 100) + '...');
            return content;
          }
        }
      } catch (error) {
        console.error('策划书生成失败:', error.message);
      }
      
      return this.generatePlanFallback(data);
    },
    
    async generatePromotionWithDoubao(data) {
      const prompt = `请为"${data.theme}"(${data.type})活动生成一份吸引人的宣传文案，适合在校园公众号、社团群等平台发布。预算${data.budget || 2000}元，规模${data.scale || 100}人。文案要有感染力，能激发同学们的参与热情。`;
      
      console.log('=== 开始调用豆包Doubao-1.5-lite-32k生成宣传文案 ===');
      
      try {
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
            const content = result.choices[0].message?.content || result.choices[0].text;
            console.log('宣传文案生成成功:', content.substring(0, 100) + '...');
            return content;
          }
        }
      } catch (error) {
        console.error('宣传文案生成失败:', error.message);
      }
      
      return this.generatePromotionFallback(data);
    },
    
    generatePlanFallback(data) {
      return `# ${data.theme}活动策划书

## 一、活动概况

- **活动名称**：${data.theme}
- **活动类型**：${data.type}
- **活动时间**：待定
- **活动地点**：待定
- **参与人数**：${data.scale || 100}人

## 二、活动目标

1. 提升社团影响力
2. 增强同学间交流
3. 促进校园文化建设

## 三、时间安排

| 时间节点 | 任务内容 | 负责人 |
|---------|---------|-------|
| 活动前1周 | 宣传推广 | 宣传部长 |
| 活动前3天 | 物资准备 | 后勤部长 |
| 活动当天 | 活动执行 | 全体成员 |

## 四、预算明细

| 项目 | 预算（元） | 备注 |
|-----|----------|-----|
| 场地布置 | 500 | 含装饰、设备 |
| 物资采购 | ${data.budget ? Math.round(data.budget * 0.4) : 800} | 含奖品、材料 |
| 宣传费用 | 200 | 海报、线上推广 |
| 餐饮/零食 | ${data.budget ? Math.round(data.budget * 0.3) : 600} | 根据人数调整 |
| 应急预备 | ${data.budget ? Math.round(data.budget * 0.1) : 200} | 预留机动资金 |
| **总计** | **${data.budget || 2000}** | |

## 五、人员分工

- **总负责人**：统筹全局
- **宣传组**：宣传推广、现场拍照
- **后勤组**：物资采购、场地布置
- **执行组**：现场执行、秩序维护

## 六、注意事项

1. 注意安全，做好应急预案
2. 提前检查设备
3. 安排人员负责拍照记录
4. 活动结束后及时总结

---
*以上为示例方案，可根据实际情况调整*`;
    },
    
    generatePromotionFallback(data) {
      return `# 🎉 ${data.theme}来啦！

亲爱的同学们：

你是否期待一场精彩的${data.type}？现在，${data.theme}活动即将登场！

## 📅 活动信息

- **活动名称**：${data.theme}
- **活动类型**：${data.type}
- **活动规模**：${data.scale || 100}人参与
- **活动地点**：待定

## ✨ 活动亮点

- 🎯 精彩环节，不容错过
- 🏆 丰富奖品，等你来拿
- 🤝 结识新朋友，拓展人脉
- 📸 精美照片，留下美好回忆

## 📋 报名方式

- 报名时间：待定
- 报名方式：待定
- 报名费用：免费（或待定）

## 💡 温馨提示

1. 请提前安排好时间
2. 活动当天请提前到场
3. 如有问题请联系活动负责人

---

**快来加入我们吧！** 期待在活动中与你相遇！

💪 ${data.theme}筹备组
📅 日期：待定

---
*以上为示例文案，可根据实际情况调整*`;
    },
    
    copyContent() {
      navigator.clipboard.writeText(this.currentContent).then(() => {
        alert('已复制到剪贴板！');
      }).catch(err => {
        console.error('复制失败:', err);
        alert('复制失败，请手动复制！');
      });
    },
    
    saveContent() {
      if (!this.generatedContent) return;
      
      this.savedItems.unshift({
        ...this.generatedContent
      });
      
      localStorage.setItem('aiCopywriterHistory', JSON.stringify(this.savedItems));
      alert('保存成功！');
    },
    
    loadHistory() {
      const history = localStorage.getItem('aiCopywriterHistory');
      if (history) {
        try {
          this.savedItems = JSON.parse(history);
        } catch (e) {
          console.error('加载历史记录失败:', e);
        }
      }
    },
    
    loadItem(item) {
      this.inputData = {
        theme: item.theme,
        type: item.type,
        budget: item.budget,
        scale: item.scale
      };
      this.generatedContent = item;
      this.activeTab = 0;
    },
    
    deleteItem(index) {
      if (confirm('确定删除这条记录吗？')) {
        this.savedItems.splice(index, 1);
        localStorage.setItem('aiCopywriterHistory', JSON.stringify(this.savedItems));
      }
    }
  }
}
</script>

<style scoped>
.ai-copywriter {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.feature-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 20px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.feature-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.feature-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.feature-title h2 {
  margin: 0 0 0.75rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1C1C1E;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.feature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.feature-tags .tag {
  padding: 0.35rem 0.85rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #667eea;
  border: 1px solid rgba(102, 126, 234, 0.3);
}

.feature-desc {
  margin-top: 1rem;
  font-size: 1rem;
  color: #6B6B7B;
  text-align: center;
  line-height: 1.6;
}

.ai-note {
  display: none;
}

.ai-copywriter select {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 12px 16px;
  font-size: 15px;
  color: #1C1C1E;
  min-height: 44px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.ai-copywriter select:focus {
  outline: none;
  box-shadow: 0 4px 16px rgba(0, 122, 255, 0.15);
}

.ai-copywriter input[type="text"],
.ai-copywriter input[type="number"] {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 12px 16px;
  font-size: 15px;
  color: #1C1C1E;
  min-height: 44px;
}

.ai-copywriter input[type="text"]:focus,
.ai-copywriter input[type="number"]:focus {
  outline: none;
  box-shadow: 0 4px 16px rgba(0, 122, 255, 0.15);
}

.card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
  position: relative;
  overflow: hidden;
}

.card h2 {
  margin: 0 0 1.5rem 0;
  color: #1C1C1E;
  font-size: 1.5rem;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: relative;
  z-index: 1;
}

.form-row {
  display: flex;
  gap: 1.25rem;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  color: #1C1C1E;
  font-weight: 500;
}

.generate-btn {
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  margin-top: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
}

.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.output-section {
  margin-top: 2rem;
  position: relative;
  z-index: 1;
}

.tabs {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
}

.tab {
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-bottom: 2px solid transparent;
  border-radius: 14px 14px 0 0;
  cursor: pointer;
  font-size: 0.95rem;
  color: #1C1C1E;
  font-weight: 500;
}

.tab.active {
  background: rgba(102, 126, 234, 0.3);
  color: #667eea;
  border-bottom-color: #667eea;
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.content-editor textarea {
  width: 100%;
  min-height: 300px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.6;
  resize: vertical;
  color: #1C1C1E;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.06);
}

.content-editor textarea:focus {
  outline: none;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.06), 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.saved-history {
  margin-top: 2rem;
  position: relative;
  z-index: 1;
}

.saved-history h3 {
  margin: 0 0 1rem 0;
  color: #1C1C1E;
  font-size: 1.2rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.history-item {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.history-info h4 {
  margin: 0 0 0.25rem 0;
  color: #1C1C1E;
  font-size: 1rem;
}

.history-meta {
  margin: 0;
  font-size: 0.85rem;
  color: #6B6B7B;
}

.history-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.6rem 1.25rem;
  border-radius: 14px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.7);
  color: #1C1C1E;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.btn-danger {
  background: rgba(255, 59, 48, 0.1);
  color: #FF3B30;
  border: 1px solid rgba(255, 59, 48, 0.3);
}

.btn-sm {
  padding: 0.4rem 0.9rem;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }
  
  .tabs {
    flex-wrap: wrap;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons .btn {
    width: 100%;
  }
}
</style>
