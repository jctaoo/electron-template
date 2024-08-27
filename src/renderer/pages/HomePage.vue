<script setup>
import MainWindowLayout from "@renderer/layouts/MainWindowLayout.vue";
import { NButton, NH1 } from "naive-ui";

const logout = async () => {
  await window.electronAPI.clearSession();
};
</script>

<template>
  <MainWindowLayout>
    <div class="w-full h-screen flex flex-col items-center justify-center">
      <NH1>Hello World!!</NH1>
      <NButton @click="logout" size="large" type="primary">退出登录</NButton>
    </div>
  </MainWindowLayout>
</template>
