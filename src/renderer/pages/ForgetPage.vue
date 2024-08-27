<script setup lang="ts">
import AuthLayout from "@renderer/layouts/AuthLayout.vue";
import { NFlex, NButton, NForm, NFormItemRow, NInput, NDivider, NH3 } from "naive-ui"

function login() {
  console.log('login');
}
</script>

<template>
  <AuthLayout>
    <NH3>找回密码</NH3>
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
      <n-form-item-row :show-label="false">
        <n-input size="large" placeholder="输入新密码" type="password" />
      </n-form-item-row>
      <n-form-item-row :show-label="false">
        <n-input size="large" placeholder="再次输入新密码" type="password" />
      </n-form-item-row>
    </n-form>
    <n-button type="primary" block secondary strong size="large" @click="login">
      立即登录
    </n-button>
  </AuthLayout>
</template>