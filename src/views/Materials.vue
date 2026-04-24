<template>
  <div class="materials">
    <div class="card">
      <h2>资料管理</h2>
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="搜索资料..."
        />
        <select v-model="clubFilter" v-if="userRole === 'admin'">
          <option value="">全部社团</option>
          <option value="计算机协会">计算机协会</option>
          <option value="文学社">文学社</option>
          <option value="篮球队">篮球队</option>
          <option value="志愿者协会">志愿者协会</option>
          <option value="摄影社">摄影社</option>
        </select>
        <select v-model="categoryFilter">
          <option value="">全部分类</option>
          <option value="文档">文档</option>
          <option value="图片">图片</option>
          <option value="视频">视频</option>
          <option value="其他">其他</option>
        </select>
        <router-link to="/add-material" class="btn btn-primary" v-if="userRole === 'admin' || userRole === 'leader'">上传资料</router-link>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>资料名称</th>
            <th>社团</th>
            <th>分类</th>
            <th>上传人</th>
            <th>大小</th>
            <th>上传时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="material in filteredMaterials" :key="material.id">
            <td>{{ material.name }}</td>
            <td>{{ material.club }}</td>
            <td>{{ material.category }}</td>
            <td>{{ material.uploader }}</td>
            <td>{{ material.size }}</td>
            <td>{{ material.uploadTime }}</td>
            <td>
              <button @click="previewMaterial(material.id)" class="btn btn-primary">预览</button>
              <button @click="downloadMaterial(material.id)" class="btn btn-secondary">下载</button>
              <router-link :to="`/edit-material/${material.id}`" class="btn btn-primary" v-if="canEdit(material)">编辑</router-link>
              <button @click="deleteMaterial(material.id)" class="btn btn-danger" v-if="canEdit(material)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredMaterials.length === 0" class="empty-state">
        <p>没有找到资料</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Materials',
  data() {
    return {
      searchTerm: '',
      clubFilter: '',
      categoryFilter: '',
      materials: []
    }
  },
  computed: {
    userInfo() {
      const userInfo = localStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    },
    userRole() {
      return this.userInfo ? this.userInfo.role : '';
    },
    userClub() {
      return this.userInfo ? this.userInfo.club : '';
    },
    filteredMaterials() {
      return this.materials.filter(material => {
        // 系统管理员可以查看所有资料
        if (this.userRole === 'admin') {
          const matchesSearch = material.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                               material.uploader.toLowerCase().includes(this.searchTerm.toLowerCase());
          const matchesClub = !this.clubFilter || material.club === this.clubFilter;
          const matchesCategory = !this.categoryFilter || material.category === this.categoryFilter;
          return matchesSearch && matchesClub && matchesCategory;
        }
        // 其他角色只能查看自己社团的资料
        else if (this.userRole === 'advisor' || this.userRole === 'leader' || this.userRole === 'member') {
          const matchesClub = material.club === this.userClub;
          const matchesSearch = material.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                               material.uploader.toLowerCase().includes(this.searchTerm.toLowerCase());
          const matchesCategory = !this.categoryFilter || material.category === this.categoryFilter;
          return matchesClub && matchesSearch && matchesCategory;
        }
        return false;
      });
    }
  },
  mounted() {
    // 组件挂载时加载资料数据
    this.loadMaterials();
    // 监听localStorage变化
    window.addEventListener('storage', this.handleStorageChange);
    // 监听页面可见性变化，当页面重新可见时重新加载数据
    this.handleVisibilityChange = () => {
      if (!document.hidden) {
        this.loadMaterials();
      }
    };
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  },
  beforeUnmount() {
    // 组件卸载时移除监听器
    window.removeEventListener('storage', this.handleStorageChange);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  },
  methods: {
    loadMaterials() {
      // 从localStorage读取资料数据
      const materialsData = localStorage.getItem('materials');
      if (materialsData) {
        this.materials = JSON.parse(materialsData);
      } else {
        // 初始资料数据
        const initialMaterials = [
          { id: 1, name: '编程大赛规则.pdf', club: '计算机协会', category: '文档', uploader: '张三', uploadTime: '2026-04-01 10:00', size: '1.2MB' },
          { id: 2, name: '文学社招新海报.jpg', club: '文学社', category: '图片', uploader: '李四', uploadTime: '2026-04-02 14:00', size: '2.5MB' },
          { id: 3, name: '篮球训练计划.xlsx', club: '篮球队', category: '文档', uploader: '王五', uploadTime: '2026-04-03 09:00', size: '800KB' },
          { id: 4, name: '志愿者培训视频.mp4', club: '志愿者协会', category: '视频', uploader: '赵六', uploadTime: '2026-04-04 16:00', size: '50MB' },
          { id: 5, name: '摄影技巧手册.pdf', club: '摄影社', category: '文档', uploader: '孙七', uploadTime: '2026-04-05 11:00', size: '3.5MB' }
        ];
        // 保存初始资料数据到localStorage
        localStorage.setItem('materials', JSON.stringify(initialMaterials));
        this.materials = initialMaterials;
      }
    },
    handleStorageChange(event) {
      // 当localStorage中的materials数据发生变化时，重新加载资料数据
      if (event.key === 'materials') {
        this.loadMaterials();
      }
    },
    canEdit(material) {
      // 系统管理员可以编辑所有资料
      if (this.userRole === 'admin') {
        return true;
      }
      // 社团指导老师和负责人只能编辑自己社团的资料
      else if ((this.userRole === 'advisor' || this.userRole === 'leader') && material.club === this.userClub) {
        return true;
      }
      return false;
    },
    deleteMaterial(id) {
      if (confirm('确定要删除该资料吗？')) {
        // 从localStorage中删除资料
        const materialsData = localStorage.getItem('materials');
        if (materialsData) {
          let materials = JSON.parse(materialsData);
          materials = materials.filter(material => material.id !== id);
          localStorage.setItem('materials', JSON.stringify(materials));
          this.loadMaterials();
        }
      }
    },
    previewMaterial(id) {
      // 查找资料
      const material = this.materials.find(m => m.id === id);
      if (material) {
        // 调试信息
        console.log('预览资料:', material);
        console.log('fileContent存在:', material.fileContent ? '是' : '否');
        if (material.fileContent) {
          console.log('fileContent长度:', material.fileContent.length);
          console.log('fileContent前100个字符:', material.fileContent.substring(0, 100));
        }
        
        // 创建预览弹窗
        const previewDiv = document.createElement('div');
        previewDiv.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 1000;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
        `;
        
        // 预览内容
        let previewContent = `
          <h3 style="margin-top: 0;">${material.name}</h3>
          <div style="margin-bottom: 15px;">
            <p><strong>所属社团：</strong>${material.club}</p>
            <p><strong>分类：</strong>${material.category}</p>
            <p><strong>上传人：</strong>${material.uploader}</p>
            <p><strong>上传时间：</strong>${material.uploadTime}</p>
            <p><strong>文件大小：</strong>${material.size}</p>
            <p><strong>描述：</strong>${material.description || '无'}</p>
            <p><strong>文件内容：</strong>${material.fileContent ? '已上传' : '未上传'}</p>
            ${material.fileContent ? `<p><strong>文件内容长度：</strong>${material.fileContent.length} 字符</p>` : ''}
          </div>
          <div style="border-top: 1px solid #eee; padding-top: 15px;">
            <h4>文件预览</h4>
        `;
        
        // 根据文件类型和fileContent显示预览
        if (material.fileContent) {
          if (material.category === '图片' || (material.name && (material.name.endsWith('.jpg') || material.name.endsWith('.jpeg') || material.name.endsWith('.png') || material.name.endsWith('.gif')))) {
            previewContent += `
              <div style="text-align: center; margin: 20px 0;">
                <img src="${material.fileContent}" 
                     alt="${material.name}" 
                     style="max-width: 100%; max-height: 400px; border-radius: 4px;">
              </div>
            `;
          } else if (material.category === '文档' || (material.name && (material.name.endsWith('.txt') || material.name.endsWith('.doc') || material.name.endsWith('.docx') || material.name.endsWith('.pdf')))) {
            previewContent += `
              <div style="background: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
                <pre style="margin: 0; white-space: pre-wrap; font-family: Arial, sans-serif;">
${material.description || '文档内容预览...'}
                </pre>
              </div>
            `;
          } else if (material.category === '视频' || (material.name && (material.name.endsWith('.mp4') || material.name.endsWith('.avi') || material.name.endsWith('.mov')))) {
            previewContent += `
              <div style="text-align: center; margin: 20px 0;">
                <video controls style="max-width: 100%; max-height: 400px; border-radius: 4px;">
                  <source src="${material.fileContent}" type="video/mp4">
                  您的浏览器不支持视频播放。
                </video>
              </div>
            `;
          } else if (material.category === '音频' || (material.name && (material.name.endsWith('.mp3') || material.name.endsWith('.wav') || material.name.endsWith('.ogg')))) {
            previewContent += `
              <div style="text-align: center; margin: 20px 0;">
                <audio controls style="max-width: 100%;">
                  <source src="${material.fileContent}" type="audio/mpeg">
                  您的浏览器不支持音频播放。
                </audio>
              </div>
            `;
          } else {
            previewContent += `
              <div style="background: #f5f5f5; padding: 20px; border-radius: 4px; margin: 20px 0; text-align: center;">
                <p>文件预览：${material.name}</p>
                <p>分类：${material.category}</p>
                <p>文件大小：${material.size}</p>
                <p>文件内容已上传</p>
              </div>
            `;
          }
        } else {
          previewContent += `
            <div style="background: #f5f5f5; padding: 20px; border-radius: 4px; margin: 20px 0; text-align: center;">
              <p>文件预览：${material.name}</p>
              <p>分类：${material.category}</p>
              <p>文件大小：${material.size}</p>
              <p>文件内容未上传</p>
            </div>
          `;
        }
        
        // 关闭按钮
        previewContent += `
          </div>
          <div style="text-align: right; margin-top: 20px;">
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="padding: 8px 16px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
              关闭
            </button>
          </div>
        `;
        
        previewDiv.innerHTML = previewContent;
        document.body.appendChild(previewDiv);
      }
    },
    downloadMaterial(id) {
      // 这里可以添加下载逻辑
      alert('下载资料：' + id);
    }
  }
}
</script>

<style scoped>
.materials {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #95a5a6;
}
</style>