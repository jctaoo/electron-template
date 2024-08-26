import { WINDOW_PATH } from '@common/path'
import { createRouter, createWebHashHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    // home and login
    { path: WINDOW_PATH.homePage, component: () => import('./pages/HomePage.vue') },
    { path: WINDOW_PATH.loginPage, component: () => import('./pages/LoginPage.vue') },
  ],
})