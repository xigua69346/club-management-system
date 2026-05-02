<template>
  <div class="ai-diagnosis">
    <div class="card">
      <h2>📊 AI社团运营诊断报告</h2>
      
      <div class="club-selector">
        <label for="clubSelect">选择社团</label>
        <select id="clubSelect" v-model="selectedClubId" @change="generateReport">
          <option value="">请选择社团</option>
          <option v-for="club in clubs" :key="club.id" :value="club.id">{{ club.name }}</option>
        </select>
      </div>
      
      <div v-if="report" class="report-section">
        <div class="report-summary">
          <div class="summary-card">
            <div class="summary-icon">📈</div>
            <div class="summary-info">
              <div class="summary-value">{{ report.totalActivities }}</div>
              <div class="summary-label">活动数量</div>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon">✅</div>
            <div class="summary-info">
              <div class="summary-value">{{ report.checkinRate }}%</div>
              <div class="summary-label">平均签到率</div>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon">🔥</div>
            <div class="summary-info">
              <div class="summary-value">{{ report.activityScore }}</div>
              <div class="summary-label">活跃指数</div>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon">👥</div>
            <div class="summary-info">
              <div class="summary-value">{{ report.memberCount }}</div>
              <div class="summary-label">成员数量</div>
            </div>
          </div>
        </div>
        
        <div class="charts-section">
          <div class="chart-card">
            <h3>活动趋势</h3>
            <div ref="activityChart" class="chart-container"></div>
          </div>
          <div class="chart-card">
            <h3>成员活跃度分布</h3>
            <div ref="memberChart" class="chart-container"></div>
          </div>
        </div>
        
        <div class="analysis-section">
          <div class="analysis-card">
            <h3>📝 运营分析总结</h3>
            <p>{{ report.analysis }}</p>
          </div>
          
          <div class="analysis-card warning">
            <h3>⚠️ 现存问题</h3>
            <ul>
              <li v-for="(problem, index) in report.problems" :key="index">{{ problem }}</li>
            </ul>
          </div>
          
          <div class="analysis-card success">
            <h3>💡 优化建议</h3>
            <ul>
              <li v-for="(suggestion, index) in report.suggestions" :key="index">{{ suggestion }}</li>
            </ul>
          </div>
        </div>
        
        <div class="export-section">
          <button class="btn btn-primary" @click="exportReport">📥 导出报告</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import DataStore from '../stores/DataStore';

export default {
  name: 'AIDiagnosis',
  data() {
    return {
      selectedClubId: '',
      clubs: [],
      report: null,
      activityChart: null,
      memberChart: null
    }
  },
  mounted() {
    this.loadClubs();
  },
  beforeUnmount() {
    if (this.activityChart) {
      this.activityChart.dispose();
    }
    if (this.memberChart) {
      this.memberChart.dispose();
    }
  },
  methods: {
    loadClubs() {
      this.clubs = DataStore.getClubs();
    },
    
    generateReport() {
      if (!this.selectedClubId) return;
      
      const club = this.clubs.find(c => c.id == this.selectedClubId);
      
      this.report = this.generateDiagnosisReport(club);
      
      this.$nextTick(() => {
        this.renderCharts();
      });
    },
    
    generateDiagnosisReport(club) {
      const allMembers = DataStore.getMembers();
      const allActivities = DataStore.getActivities();
      
      const clubMembers = allMembers.filter(m => m.club === club.name);
      const memberCount = clubMembers.length;
      
      const clubActivities = allActivities.filter(a => a.club === club.name);
      const totalActivities = clubActivities.length;
      
      const completedActivities = clubActivities.filter(a => a.status === '已完成');
      const totalParticipants = completedActivities.reduce((sum, a) => sum + (a.participants || 0), 0);
      const avgParticipants = completedActivities.length > 0 ? totalParticipants / completedActivities.length : 0;
      
      const checkinRate = memberCount > 0 ? Math.min(95, Math.round((avgParticipants / memberCount) * 100)) : 0;
      
      const activityScore = Math.round(
        (memberCount / 50) * 20 +
        (totalActivities / 10) * 30 +
        (checkinRate / 100) * 50
      );
      
      let analysis = '';
      let problems = [];
      let suggestions = [];
      
      if (checkinRate >= 85) {
        analysis = `${club.name}整体运营状况优秀，成员参与度高，活动组织有序，社团凝聚力强。`;
      } else if (checkinRate >= 70) {
        analysis = `${club.name}运营状况良好，活动开展较为稳定，但仍有提升空间。`;
      } else {
        analysis = `${club.name}目前运营存在一些挑战，成员参与度有待提高。`;
      }
      
      if (checkinRate < 75 && memberCount > 0) {
        problems.push('活动签到率偏低，成员参与积极性不足');
        suggestions.push('增加活动趣味性，设置签到奖励机制');
      }
      
      if (totalActivities < 5) {
        problems.push('活动数量较少，社团活跃度有待提升');
        suggestions.push('制定年度活动计划，每月至少开展1-2次活动');
      }
      
      if (activityScore < 60) {
        problems.push('成员活跃度分布不均，新成员融入较慢');
        suggestions.push('开展新成员见面会，建立导师带教制度');
      }
      
      if (problems.length === 0) {
        problems.push('运营状况良好，暂无明显问题');
      }
      
      suggestions.push('利用AI文案助手提升活动宣传效果');
      suggestions.push('建立成员反馈渠道，持续优化活动质量');
      suggestions.push('加强社团间交流合作，扩大影响力');
      
      return {
        clubName: club.name,
        memberCount,
        checkinRate,
        totalActivities,
        activityScore,
        analysis,
        problems,
        suggestions,
        activityData: this.generateActivityData(clubActivities),
        memberData: this.generateMemberData(clubMembers)
      };
    },
    
    generateActivityData(clubActivities) {
      const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
      const data = months.map(() => 0);
      
      clubActivities.forEach(activity => {
        const dateStr = activity.createdAt || activity.startTime;
        if (dateStr) {
          const month = parseInt(dateStr.split('-')[1]) - 1;
          if (month >= 0 && month < 12) {
            data[month]++;
          }
        }
      });
      
      const currentMonth = new Date().getMonth();
      const startMonth = (currentMonth - 5 + 12) % 12;
      const recentMonths = [];
      const recentData = [];
      
      for (let i = 0; i < 6; i++) {
        const m = (startMonth + i) % 12;
        recentMonths.push(months[m]);
        recentData.push(data[m]);
      }
      
      return { months: recentMonths, data: recentData };
    },
    
    generateMemberData(clubMembers) {
      let veryActive = 0;
      let active = 0;
      let normal = 0;
      let less = 0;
      
      clubMembers.forEach(member => {
        const points = member.points || 0;
        if (points >= 200) {
          veryActive++;
        } else if (points >= 100) {
          active++;
        } else if (points >= 50) {
          normal++;
        } else {
          less++;
        }
      });
      
      return [
        { name: '非常活跃', value: veryActive },
        { name: '活跃', value: active },
        { name: '一般', value: normal },
        { name: '较少', value: less }
      ];
    },
    
    renderCharts() {
      if (this.activityChart) {
        this.activityChart.dispose();
      }
      
      if (this.memberChart) {
        this.memberChart.dispose();
      }
      
      this.activityChart = echarts.init(this.$refs.activityChart);
      const activityOption = {
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: this.report.activityData.months },
        yAxis: { type: 'value', name: '活动数' },
        series: [{ data: this.report.activityData.data, type: 'line', smooth: true, itemStyle: { color: '#3498db' } }]
      };
      this.activityChart.setOption(activityOption);
      
      this.memberChart = echarts.init(this.$refs.memberChart);
      const memberOption = {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          radius: '60%',
          data: this.report.memberData,
          itemStyle: {
            colors: ['#27ae60', '#3498db', '#f39c12', '#e74c3c']
          }
        }]
      };
      this.memberChart.setOption(memberOption);
      
      window.addEventListener('resize', () => {
        this.activityChart && this.activityChart.resize();
        this.memberChart && this.memberChart.resize();
      });
    },
    
    exportReport() {
      const club = this.clubs.find(c => c.id == this.selectedClubId);
      const reportText = `
# ${club.name} 运营诊断报告

## 核心指标
- 成员数量: ${this.report.memberCount}人
- 平均签到率: ${this.report.checkinRate}%
- 活动数量: ${this.report.totalActivities}次
- 活跃指数: ${this.report.activityScore}分

## 分析总结
${this.report.analysis}

## 现存问题
${this.report.problems.map((p, i) => `${i + 1}. ${p}`).join('\n')}

## 优化建议
${this.report.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

---
报告生成时间: ${new Date().toLocaleString('zh-CN')}
      `.trim();
      
      const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${club.name}_运营诊断报告_${new Date().toLocaleDateString('zh-CN')}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }
}
</script>

<style scoped>
.ai-diagnosis {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.club-selector {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.club-selector label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.club-selector select {
  width: 100%;
  max-width: 300px;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  min-height: 44px;
}

.report-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.summary-card {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.summary-icon {
  font-size: 2.5rem;
}

.summary-value {
  font-size: 2rem;
  font-weight: bold;
}

.summary-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.chart-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #eee;
}

.chart-card h3 {
  margin-bottom: 1rem;
  color: #333;
}

.chart-container {
  height: 300px;
}

.analysis-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.analysis-card {
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.analysis-card h3 {
  margin-bottom: 1rem;
  color: #333;
}

.analysis-card.warning {
  border-left-color: #f39c12;
  background-color: #fff9e6;
}

.analysis-card.success {
  border-left-color: #27ae60;
  background-color: #e8f5e9;
}

.analysis-card ul {
  margin: 0;
  padding-left: 1.5rem;
}

.analysis-card li {
  margin-bottom: 0.5rem;
}

.export-section {
  text-align: right;
}

@media (max-width: 768px) {
  .report-summary {
    grid-template-columns: 1fr 1fr;
  }
  
  .charts-section {
    grid-template-columns: 1fr;
  }
}
</style>
