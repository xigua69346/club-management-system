# 高校社团信息管理系统 - 开源代码与组件使用情况说明

## 一、项目简介

本项目是一个基于Vue 3框架开发的高校社团信息管理系统，适用于大学生计算机设计大赛（软件应用与开发·信息系统类）。系统实现了社团管理全流程信息化，满足信息检索迅速、存储量大、可靠性高等要求。

## 二、技术栈说明

### 2.1 前端框架

| 技术 | 版本 | 说明 | 许可证 |
|------|------|------|--------|
| Vue.js | ^3.5.13 | 渐进式JavaScript框架，用于构建用户界面 | MIT |
| Vue Router | ^4.4.5 | Vue.js官方路由管理器，用于构建单页面应用 | MIT |

### 2.2 构建工具

| 技术 | 版本 | 说明 | 许可证 |
|------|------|------|--------|
| Vite | ^6.0.1 | 新一代前端构建工具，提供极速的开发体验 | MIT |
| @vitejs/plugin-vue | ^5.2.1 | Vite的Vue.js插件 | MIT |

### 2.3 数据可视化

| 技术 | 版本 | 说明 | 许可证 |
|------|------|------|--------|
| ECharts | ^5.5.1 | 百度开源的数据可视化图表库 | Apache-2.0 |

### 2.4 二维码生成

| 技术 | 版本 | 说明 | 许可证 |
|------|------|------|--------|
| qrcode | ^1.5.4 | JavaScript二维码生成库 | MIT |

## 三、组件结构说明

### 3.1 核心组件

| 组件名称 | 文件路径 | 功能说明 |
|----------|----------|----------|
| App | src/App.vue | 根组件，包含导航栏和页面布局 |
| Home | src/views/Home.vue | 首页，展示系统概览信息 |
| Login | src/views/Login.vue | 用户登录页面 |
| Register | src/views/Register.vue | 用户注册页面 |

### 3.2 用户管理模块

| 组件名称 | 文件路径 | 功能说明 |
|----------|----------|----------|
| Users | src/views/Users.vue | 用户列表，展示所有用户信息 |
| AddUser | src/views/AddUser.vue | 添加用户表单 |
| EditUser | src/views/EditUser.vue | 编辑用户信息表单 |

### 3.3 成员管理模块

| 组件名称 | 文件路径 | 功能说明 |
|----------|----------|----------|
| Members | src/views/Members.vue | 成员列表，展示所有成员信息 |
| AddMember | src/views/AddMember.vue | 添加成员表单 |
| EditMember | src/views/EditMember.vue | 编辑成员信息表单 |

### 3.4 社团管理模块

| 组件名称 | 文件路径 | 功能说明 |
|----------|----------|----------|
| Clubs | src/views/Clubs.vue | 社团列表，展示所有社团信息 |
| AddClub | src/views/AddClub.vue | 添加社团表单 |
| EditClub | src/views/EditClub.vue | 编辑社团信息表单 |

### 3.5 活动管理模块

| 组件名称 | 文件路径 | 功能说明 |
|----------|----------|----------|
| Activities | src/views/Activities.vue | 活动列表，展示所有活动信息 |
| AddActivity | src/views/AddActivity.vue | 添加活动表单 |
| EditActivity | src/views/EditActivity.vue | 编辑活动信息表单 |

### 3.6 资料管理模块

| 组件名称 | 文件路径 | 功能说明 |
|----------|----------|----------|
| Materials | src/views/Materials.vue | 资料列表，展示所有资料信息 |
| AddMaterial | src/views/AddMaterial.vue | 添加资料表单 |
| EditMaterial | src/views/EditMaterial.vue | 编辑资料信息表单 |

### 3.7 统计分析模块

| 组件名称 | 文件路径 | 功能说明 |
|----------|----------|----------|
| Statistics | src/views/Statistics.vue | 统计分析页面，使用ECharts展示数据 |

## 四、功能特性说明

### 4.1 用户权限管理

系统实现了四类用户权限控制：
- **系统管理员(admin)**：拥有全部权限，可以管理所有用户、成员、社团等信息
- **社团指导老师(advisor)**：可以管理自己社团的成员和活动信息
- **社团负责人(leader)**：可以管理自己社团的成员、活动和资料信息
- **普通成员(member)**：只能查看自己社团的成员组成信息

### 4.2 数据存储

系统使用浏览器localStorage进行数据存储，实现了：
- 用户登录信息持久化
- 用户数据实时更新
- 成员数据实时更新
- 社团、活动、资料等数据管理

### 4.3 响应式设计

系统采用响应式设计，能够适配不同屏幕尺寸的设备，包括桌面端和移动端。

### 4.4 数据可视化

系统使用ECharts实现统计分析功能，包括：
- 社团成员统计
- 活动参与统计
- 资料使用统计等

## 五、第三方库使用情况

### 5.1 Vue.js生态系统

- **Vue 3**：核心框架
- **Vue Router 4**：路由管理
- **响应式系统**：数据绑定和状态管理

### 5.2 Vite生态

- **Vite**：开发服务器和构建工具
- **@vitejs/plugin-vue**：Vite对Vue 3的支持

### 5.3 其他开源库

- **ECharts**：数据可视化图表库
- **qrcode**：二维码生成功能

## 六、项目结构

```
college-club-management-system/
├── public/
├── src/
│   ├── assets/
│   ├── router/
│   │   └── index.js          # 路由配置
│   ├── views/                 # 页面组件
│   │   ├── Activities.vue
│   │   ├── AddActivity.vue
│   │   ├── AddClub.vue
│   │   ├── AddMaterial.vue
│   │   ├── AddMember.vue
│   │   ├── AddUser.vue
│   │   ├── Clubs.vue
│   │   ├── EditActivity.vue
│   │   ├── EditClub.vue
│   │   ├── EditMaterial.vue
│   │   ├── EditMember.vue
│   │   ├── EditUser.vue
│   │   ├── Home.vue
│   │   ├── Login.vue
│   │   ├── Materials.vue
│   │   ├── Members.vue
│   │   ├── Register.vue
│   │   ├── Statistics.vue
│   │   └── Users.vue
│   ├── App.vue               # 根组件
│   └── main.js               # 入口文件
├── index.html
├── package.json
└── vite.config.js            # Vite配置文件
```

## 七、许可证说明

本项目使用的所有开源技术均为开源许可证：

| 技术 | 许可证 |
|------|--------|
| Vue.js | MIT |
| Vue Router | MIT |
| Vite | MIT |
| @vitejs/plugin-vue | MIT |
| ECharts | Apache-2.0 |
| qrcode | MIT |

## 八、运行说明

### 8.1 安装依赖

```bash
npm install
```

### 8.2 启动开发服务器

```bash
npm run dev
```

### 8.3 构建生产版本

```bash
npm run build
```

### 8.4 预览生产版本

```bash
npm run preview
```

## 九、注意事项

1. 本项目为前端项目，数据存储在浏览器localStorage中，不适合生产环境使用
2. 如需后端支持，可以对接Java SSM或其他后端框架
3. 数据库可以使用MySQL或其他关系型数据库
4. 项目适用于大学生计算机设计大赛等校园场景

## 十、致谢

感谢以下开源项目为本系统提供技术支持：
- Vue.js团队
- Vite团队
- ECharts团队
- 所有其他开源贡献者
