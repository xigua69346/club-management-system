import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import Clubs from '../views/Clubs.vue'
import Members from '../views/Members.vue'
import Activities from '../views/Activities.vue'
import Statistics from '../views/Statistics.vue'
import Materials from '../views/Materials.vue'
import Users from '../views/Users.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
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
    path: '/clubs',
    name: 'Clubs',
    component: Clubs
  },
  {
    path: '/members',
    name: 'Members',
    component: Members
  },
  {
    path: '/activities',
    name: 'Activities',
    component: Activities
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics
  },
  {
    path: '/materials',
    name: 'Materials',
    component: Materials
  },
  {
    path: '/users',
    name: 'Users',
    component: Users
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router