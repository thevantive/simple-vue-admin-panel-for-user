
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Logout from '@/views/Logout.vue'
import NotFound from '@/views/NotFound.vue'

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/beranda'
  },
  {
    path: '/beranda',
    name: 'Usaha Mikro',
    component: Home,
    meta: { auth: true }
  },
  {
    path: '/masuk',
    name: 'QTI CRUD TEST | Masuk',
    component: Login
  },
  {
    path: '/keluar',
    name: 'QTI CRUD TEST | Keluar',
    component: Logout
  },
  {
    path: '/:catchAll(.*)',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userIdentity = !!localStorage.getItem('userIdentity')
  const token = !!localStorage.getItem('webToken')

  /* memeriksa autentikasi */
  if (to.matched.some((record) => record.meta.auth)) {
    if (!token && !userIdentity) {
      next('/masuk')
      return
    }
  }

  /* memperbaharui nama halaman */
  document.title = to.name || 'Usaha Mikro'

  next()
})

export default router
