import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import ResultPage from '@/views/ResultPage.vue'
import DaYunPage from '@/views/DaYunPage.vue'
import NamingPage from '@/views/NamingPage.vue'
import HeHunPage from '@/views/HeHunPage.vue'
import PayPage from '@/views/PayPage.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/result', name: 'result', component: ResultPage },
  { path: '/dayun', name: 'dayun', component: DaYunPage },
  { path: '/naming', name: 'naming', component: NamingPage },
  { path: '/hehun', name: 'hehun', component: HeHunPage },
  { path: '/pay', name: 'pay', component: PayPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
