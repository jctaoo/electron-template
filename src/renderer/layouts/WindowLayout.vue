<script setup lang="ts"></script>

<template>
  <div class="window-layout">
    <div class="window-layout__header">
    </div>
    <div class="window-layout__content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.window-layout {
  height: 100vh;
  width: 100vw;
}

.window-layout__header {
  height: 30px;
  background-color: transparent;
  -webkit-app-region: drag;

  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
  right: 0;
}
</style>