<script setup>
import { WINDOW_PATH } from "@common/path";
import LinkButton from "@renderer/components/LinkButton.vue";
import AuthLayout from "@renderer/layouts/AuthLayout.vue";
import { NFlex, NButton, NTabs, NTabPane, NForm, NFormItemRow, NInput, NDivider } from "naive-ui"
import { useRouter } from "vue-router";

const login = async () => {
  console.log('login');
  await window.electronAPI.storeLoginToken('token');
};

const router = useRouter();

const goToForgotPassword = async () => {
  router.push(WINDOW_PATH.forgetPage);
};

const goToSignUp = async () => {
  router.push(WINDOW_PATH.registerPage);
};

const wechatLogin = async () => {
  router.push(WINDOW_PATH.wechatLoginPage);
};
</script>

<template>
  <AuthLayout disable-back>
    <n-tabs class="card-tabs" default-value="signin" size="large" animated pane-wrapper-style="margin: 0 -4px"
          pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;">
          <n-tab-pane name="signin" tab="密码登录">
            <n-form>
              <n-form-item-row :show-label="false">
                <n-input size="large" placeholder="请输入登录账号" />
              </n-form-item-row>
              <n-form-item-row :show-label="false">
                <n-input size="large" placeholder="请输入登录密码" type="password" />
              </n-form-item-row>
            </n-form>
            <n-button type="primary" block secondary strong size="large" @click="login">
              立即登录
            </n-button>
          </n-tab-pane>
          <n-tab-pane name="signup" tab="验证码登录">
            <n-form>
              <n-form-item-row :show-label="false">
                <n-input size="large" placeholder="请输入登录账号">
                  <template #prefix>
                    <NFlex align="center" size="small">
                      <span>+86</span>
                      <NDivider vertical :style="{ height: '1.3em', marginLeft: 0 }" />
                    </NFlex>
                  </template>
                </n-input>
              </n-form-item-row>
              <n-form-item-row :show-label="false">
                <n-input size="large" placeholder="请输入验证码" type="password">
                  <template #suffix>
                    <n-button size="small" quaternary>获取验证码</n-button>
                  </template>
                </n-input>
              </n-form-item-row>
            </n-form>
            <n-button type="primary" block secondary strong size="large" @click="login">
              立即登录
            </n-button>
          </n-tab-pane>
        </n-tabs>

        <NFlex justify="space-between" class="mt-3">
          <LinkButton text="忘记密码" @click="goToForgotPassword" />
          <LinkButton text="立即注册" @click="goToSignUp" />
        </NFlex>

        <NDivider class="mt-3 px-[20%] text-gray-400">其他登录方式</NDivider>

        <NFlex justify="center">
          <NButton circle size="large" @click="wechatLogin">
            <template #icon>
              <n-icon class="w-full h-full">
                <img src="../assets/login/wechat.png" />
              </n-icon>
            </template>
          </NButton>
        </NFlex>
  </AuthLayout>
</template>

<style scoped>
</style>