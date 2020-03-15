import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'
import Login from '@/views/login'
import Home from '@/views/Home'
import Module from '@/views/Module'
import Session from '@/views/StudentView'
import dashboard from '@/components/dashboard'

Vue.use(VueRouter)

async function beforeEnter (_to, _from, next) {
  if (!store.getters['user/isAuthenticated']) {
    await store.dispatch('user/fetchUser')
  }
  if (store.getters['user/isAuthenticated']) {
    next()
    return
  }
  next('/login')
}
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    beforeEnter
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: dashboard,
    beforeEnter
  },
  {
    path: '/module/:id',
    component: Module
  },
  {
    path: '/sessions/:id/do',
    component: Session
  },
  {
    path: '/session/:id/do/:exercise',
    component: Session
  }

]

export default new VueRouter({
  routes
})
