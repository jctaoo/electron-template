export const WINDOW_PATH = {
  loginPage: '/auth/login',
  forgetPage: '/auth/forget',
  registerPage: '/auth/register',
  wechatLoginPage: '/auth/wechat-login',

  homePage: '/',
}

export function isAuthPage(path: string) {
  return path.startsWith('/auth/');
}