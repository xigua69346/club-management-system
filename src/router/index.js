import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Clubs from '../views/Clubs.vue'
import AddClub from '../views/AddClub.vue'
import EditClub from '../views/EditClub.vue'
import Members from '../views/Members.vue'
import AddMember from '../views/AddMember.vue'
import EditMember from '../views/EditMember.vue'
import Activities from '../views/Activities.vue'
import AddActivity from '../views/AddActivity.vue'
import EditActivity from '../views/EditActivity.vue'
import Materials from '../views/Materials.vue'
import AddMaterial from '../views/AddMaterial.vue'
import EditMaterial from '../views/EditMaterial.vue'
import Statistics from '../views/Statistics.vue'
import Login from '../views/Login.vue'
import Users from '../views/Users.vue'
import AddUser from '../views/AddUser.vue'
import EditUser from '../views/EditUser.vue'
import Register from '../views/Register.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/clubs',
    name: 'Clubs',
    component: Clubs
  },
  {
    path: '/add-club',
    name: 'AddClub',
    component: AddClub
  },
  {
    path: '/edit-club/:id',
    name: 'EditClub',
    component: EditClub
  },
  {
    path: '/members',
    name: 'Members',
    component: Members
  },
  {
    path: '/add-member',
    name: 'AddMember',
    component: AddMember
  },
  {
    path: '/edit-member/:id',
    name: 'EditMember',
    component: EditMember
  },
  {
    path: '/activities',
    name: 'Activities',
    component: Activities
  },
  {
    path: '/add-activity',
    name: 'AddActivity',
    component: AddActivity
  },
  {
    path: '/edit-activity/:id',
    name: 'EditActivity',
    component: EditActivity
  },
  {
    path: '/materials',
    name: 'Materials',
    component: Materials
  },
  {
    path: '/add-material',
    name: 'AddMaterial',
    component: AddMaterial
  },
  {
    path: '/edit-material/:id',
    name: 'EditMaterial',
    component: EditMaterial
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/users',
    name: 'Users',
    component: Users
  },
  {
    path: '/add-user',
    name: 'AddUser',
    component: AddUser
  },
  {
    path: '/edit-user/:username',
    name: 'EditUser',
    component: EditUser
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 获取登录信息
  const userInfo = localStorage.getItem('userInfo');
  const isLoggedIn = !!userInfo;
  
  // 登录页面、注册页面和首页不需要验证
  if (to.path === '/login' || to.path === '/register' || to.path === '/') {
    next();
    return;
  }
  
  // 其他页面需要登录
  if (!isLoggedIn) {
    next('/login');
    return;
  }
  
  // 解析用户信息
  const user = JSON.parse(userInfo);
  
  // 系统管理员可以访问所有页面
  if (user.role === 'admin') {
    next();
    return;
  }
  
  // 其他角色只能访问特定页面
  // 这里可以根据需要调整权限控制逻辑
  next();
});

export default router