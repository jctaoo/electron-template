<script setup>
import WindowLayout from "@renderer/layouts/WindowLayout.vue";
import { NFlex, NImage, NButton } from "naive-ui"

const login = async () => {
  console.log('login');
  await window.electronAPI.storeLoginToken('token');
};
</script>

<template>
  <WindowLayout>
    <NFlex class="page-container">
      <img src="../assets/login/side.png" class="side-image" />
    </NFlex>
  </WindowLayout>
</template>

<style scoped>
.page-container {
  height: 100vh;
  justify-content: center;
  align-items: center;
}

.side-image {
  height: 100vh;
}
</style>