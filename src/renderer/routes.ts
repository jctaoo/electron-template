import { createRouter, createWebHashHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    // home and login
    { path: '/', component: () => import('./pages/HomePage.vue') },
    { path: '/login', component: () => import('./pages/LoginPage.vue') },
  ],
})