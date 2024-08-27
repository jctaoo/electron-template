import { WINDOW_PATH } from '@common/path'
import { createRouter, createWebHashHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: WINDOW_PATH.homePage, component: () => import('./pages/HomePage.vue') },

    // auth
    { path: WINDOW_PATH.loginPage, component: () => import('./pages/LoginPage.vue') },
    { path: WINDOW_PATH.forgetPage, component: () => import('./pages/ForgetPage.vue') },
    { path: WINDOW_PATH.registerPage, component: () => import('./pages/RegisterPage.vue') },
    { path: WINDOW_PATH.wechatLoginPage, component: () => import('./pages/WechatLoginPage.vue') },
  ],
})