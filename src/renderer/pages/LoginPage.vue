<script setup>
import LinkButton from "@renderer/components/LinkButton.vue";
import WindowLayout from "@renderer/layouts/WindowLayout.vue";
import { NFlex, NImage, NButton, NTabs, NTabPane, NForm, NFormItem, NFormItemRow, NInput, NDivider } from "naive-ui"

const login = async () => {
  console.log('login');
  await window.electronAPI.storeLoginToken('token');
};
</script>

<template>
  <WindowLayout>
    <NFlex class="page-container">
      <span class="side-image-container">
        <img src="../assets/login/side.png" class="side-image" />
      </span>
      <main>
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
          <LinkButton text="忘记密码" @click="login" />
          <LinkButton text="立即注册" @click="login" />
        </NFlex>
      </main>
    </NFlex>
  </WindowLayout>
</template>

<style scoped>
.page-container {
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
}

.side-image-container {
  height: 100%;
  overflow: hidden;
}

.side-image {
  height: 100vh;
  transform: scale(1.1);
}

main {
  flex: 1;
  padding: 0 8%;
  padding-bottom: 5%;
}
</style>