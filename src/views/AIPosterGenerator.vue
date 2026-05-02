<template>
  <div class="ai-poster-generator">
    <div class="card">
      <div class="feature-header">
        <div class="feature-icon">🎨</div>
        <div class="feature-title">
          <h2>AI海报生成器</h2>
          <div class="feature-tags">
            <span class="tag">✨ 活动海报</span>
            <span class="tag">🎭 社团宣传</span>
          </div>
        </div>
      </div>
      <p class="feature-desc">输入活动信息，AI一键生成精美海报，让你的活动更加吸睛！</p>
      
      <div class="input-section">
        <div class="form-group">
          <label for="posterTheme">海报主题</label>
          <input type="text" id="posterTheme" v-model="inputData.theme" placeholder="例如：校园编程大赛、社团招新">
        </div>
        
        <div class="form-group">
          <label for="posterDescription">海报描述</label>
          <textarea id="posterDescription" v-model="inputData.description" rows="4" placeholder="描述海报的风格、元素、配色等，例如：科技感、蓝色渐变、包含计算机元素、现代简约风格"></textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="posterTime">活动时间</label>
            <input type="text" id="posterTime" v-model="inputData.time" placeholder="例如：2024年12月25日 14:00">
          </div>
          
          <div class="form-group">
            <label for="posterLocation">活动地点</label>
            <input type="text" id="posterLocation" v-model="inputData.location" placeholder="例如：教学楼A栋301">
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="posterSize">海报尺寸</label>
            <select id="posterSize" v-model="inputData.size">
              <option value="1024x1024">正方形 (1024×1024)</option>
              <option value="1024x1536">竖版 (1024×1536)</option>
              <option value="1536x1024">横版 (1536×1024)</option>
              <option value="1200x628">社交媒体 (1200×628)</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="posterStyle">风格预设</label>
            <select id="posterStyle" v-model="inputData.style">
              <option value="">自定义</option>
              <option value="科技感">科技感</option>
              <option value="文艺清新">文艺清新</option>
              <option value="复古怀旧">复古怀旧</option>
              <option value="简约现代">简约现代</option>
              <option value="活泼可爱">活泼可爱</option>
              <option value="中国风">中国风</option>
            </select>
          </div>
        </div>
        
        <button class="btn btn-primary generate-btn" @click="generatePoster" :disabled="generating">
          {{ generating ? '生成中...' : '🎨 生成海报' }}
        </button>
      </div>
      
      <div class="output-section" v-if="generatedPoster">
        <h3>🖼️ 生成的海报</h3>
        <div class="poster-preview">
          <img :src="generatedPoster" alt="生成的海报" @load="onImageLoaded">
          <div class="loading-overlay" v-if="isLoadingImage">
            <div class="spinner"></div>
          </div>
        </div>
        
        <div class="action-buttons">
          <button class="btn btn-secondary" @click="downloadPoster">📥 下载海报</button>
          <button class="btn btn-primary" @click="regeneratePoster">🔄 重新生成</button>
        </div>
      </div>
      
      <div class="history-section" v-if="history.length > 0">
        <h3>📚 历史记录</h3>
        <div class="history-grid">
          <div class="history-item" v-for="(item, index) in history" :key="index">
            <img :src="item.image" :alt="item.theme" @click="loadHistoryItem(item)">
            <div class="history-info">
              <p>{{ item.theme }}</p>
              <span class="history-time">{{ item.time }}</span>
            </div>
            <button class="delete-btn" @click="deleteHistory(index)">🗑️</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AIPosterGenerator',
  data() {
    return {
      inputData: {
        theme: '',
        description: '',
        time: '',
        location: '',
        size: '1024x1024',
        style: ''
      },
      generating: false,
      isLoadingImage: false,
      generatedPoster: null,
      history: []
    }
  },
  mounted() {
    this.loadHistory();
  },
  methods: {
    async generatePoster() {
      if (!this.inputData.theme) {
        alert('请输入海报主题！');
        return;
      }
      
      this.generating = true;
      this.isLoadingImage = true;
      this.generatedPoster = null;
      
      try {
        const [width, height] = this.inputData.size.split('x').map(Number);
        
        let prompt = `海报设计，主题：${this.inputData.theme}`;
        if (this.inputData.time) {
          prompt += `，时间：${this.inputData.time}`;
        }
        if (this.inputData.location) {
          prompt += `，地点：${this.inputData.location}`;
        }
        if (this.inputData.style) {
          prompt += `，风格：${this.inputData.style}`;
        }
        if (this.inputData.description) {
          prompt += `，描述：${this.inputData.description}`;
        }
        prompt += `，高清，精美，专业设计，包含活动信息展示`;
        
        console.log('=== 开始调用Doubao-Seedream-4.0生成海报 ===');
        console.log('Prompt:', prompt);
        
        const response = await fetch('/api/generate-poster', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt: prompt,
            width: width,
            height: height
          })
        });
        
        const result = await response.json();
        
        if (result.success && result.image_url) {
          this.generatedPoster = result.image_url;
          console.log('海报生成成功:', result.image_url);
          
          this.addToHistory({
            theme: this.inputData.theme,
            image: result.image_url,
            time: new Date().toLocaleString('zh-CN')
          });
        } else {
          throw new Error(result.error || '生成失败');
        }
      } catch (error) {
        console.error('海报生成失败:', error.message);
        alert('生成失败，请重试！\n' + error.message);
        this.generatedPoster = this.generateFallbackPoster();
      } finally {
        this.generating = false;
      }
    },
    
    onImageLoaded() {
      this.isLoadingImage = false;
    },
    
    generateFallbackPoster() {
      const themes = ['校园活动', '社团招新', '精彩活动', '等你来参与'];
      const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'];
      const randomTheme = themes[Math.floor(Math.random() * themes.length)];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      return `https://picsum.photos/1024/1024?random=${Date.now()}`;
    },
    
    regeneratePoster() {
      this.generatePoster();
    },
    
    downloadPoster() {
      if (!this.generatedPoster) return;
      
      const link = document.createElement('a');
      link.href = this.generatedPoster;
      link.download = `poster_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    
    addToHistory(item) {
      this.history.unshift(item);
      if (this.history.length > 10) {
        this.history = this.history.slice(0, 10);
      }
      localStorage.setItem('posterHistory', JSON.stringify(this.history));
    },
    
    loadHistory() {
      const saved = localStorage.getItem('posterHistory');
      if (saved) {
        try {
          this.history = JSON.parse(saved);
        } catch (e) {
          console.error('加载历史失败:', e);
        }
      }
    },
    
    loadHistoryItem(item) {
      this.inputData.theme = item.theme;
      this.generatedPoster = item.image;
    },
    
    deleteHistory(index) {
      if (confirm('确定删除这条记录吗？')) {
        this.history.splice(index, 1);
        localStorage.setItem('posterHistory', JSON.stringify(this.history));
      }
    }
  }
}
</script>

<style scoped>
.ai-poster-generator {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.feature-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(250, 143, 251, 0.3) 0%, rgba(245, 87, 108, 0.3) 100%);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 20px;
  border: 1px solid rgba(250, 143, 251, 0.3);
  box-shadow: 0 8px 32px rgba(250, 143, 251, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3);
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
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.feature-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  box-shadow: 0 8px 24px rgba(250, 143, 251, 0.4);
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.feature-title h2 {
  margin: 0 0 0.75rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1C1C1E;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
  color: #f5576c;
  border: 1px solid rgba(250, 143, 251, 0.3);
}

.feature-desc {
  margin-top: 1rem;
  font-size: 1rem;
  color: #6B6B7B;
  text-align: center;
  line-height: 1.6;
}

.card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  color: #1C1C1E;
  font-weight: 500;
}

.form-row {
  display: flex;
  gap: 1.25rem;
}

.form-row .form-group {
  flex: 1;
}

input, textarea, select {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 12px 16px;
  font-size: 15px;
  color: #1C1C1E;
  transition: all 0.25s ease;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  box-shadow: 0 4px 16px rgba(250, 143, 251, 0.2);
  border-color: rgba(250, 143, 251, 0.4);
}

.generate-btn {
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(250, 143, 251, 0.4);
}

.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.output-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.output-section h3 {
  margin: 0 0 1rem 0;
  color: #1C1C1E;
  font-size: 1.25rem;
}

.poster-preview {
  position: relative;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.poster-preview img {
  width: 100%;
  max-height: 600px;
  object-fit: contain;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(250, 143, 251, 0.3);
  border-top-color: #f093fb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(250, 143, 251, 0.35);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.8);
  color: #1C1C1E;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.btn-secondary:hover {
  background: white;
  border-color: rgba(250, 143, 251, 0.3);
}

.history-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.history-section h3 {
  margin: 0 0 1rem 0;
  color: #1C1C1E;
  font-size: 1.25rem;
}

.history-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.history-item {
  position: relative;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.25s ease;
}

.history-item:hover {
  transform: translateY(-4px);
}

.history-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.history-info {
  padding: 0.5rem;
}

.history-info p {
  margin: 0;
  font-size: 0.85rem;
  color: #1C1C1E;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-time {
  font-size: 0.7rem;
  color: #999;
}

.delete-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.history-item:hover .delete-btn {
  opacity: 1;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons .btn {
    width: 100%;
  }
}
</style>