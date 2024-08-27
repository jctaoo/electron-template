<script setup lang="ts">
import MainTitleBar from '@renderer/components/MainTitleBar.vue';
</script>

<template>
  <div class="main-window-layout">
    <div class="main-window-layout__header">
      <MainTitleBar />
    </div>
    <div class="main-window-layout__content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.main-window-layout {
  height: 100vh;
  width: 100vw;
  user-select: none;
}

.main-window-layout__header {
  height: 50px;
  background-color: transparent;
  -webkit-app-region: drag;

  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
  right: 0;
}
</style>