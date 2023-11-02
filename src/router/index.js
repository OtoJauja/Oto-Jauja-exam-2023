import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import Login from '@/views/Login.vue'
import Songs from '@/views/Songs.vue'
import Albums from '@/views/Albums.vue'
import About from '@/views/About.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: Songs,
        },
        {
            path: '/albums',
            component: Albums,
        },
        {
            path: '/about',
            component: About,
        },
        {
            path: '/login',
            component: Login,
        }
    ]
})
router.beforeEach((to, from, next) => {
    if (to.matched.length > 0) {
      if (!useAuthStore.authenticated && to.path !== '/login') {
        next('/login');
      } else if (useAuthStore.authenticated && to.path === '/login') {
        next(from ? from.path : '/');
      } else {
        next();
      }
    } else {
      next('/');
    }
  })


export default router
