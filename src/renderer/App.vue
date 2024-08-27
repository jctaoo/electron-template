<template>
  <NConfigProvider :theme-overrides="themOverrides">
    <RouterView />
  </NConfigProvider>
</template>

<script setup lang="ts">
import { ButtonProps, GlobalThemeOverrides, NButton, NConfigProvider } from 'naive-ui';
import { RouterView } from 'vue-router';

const themOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: "#4880FF",
    baseColor: "#f0f2f5",
    borderRadius: "8px",
  },
  Input: {
    borderHover: "1px solid #4880FF",
    borderFocus: "1px solid #4880FF",
  },
  Button: {
    textColor: "#4880FF",
  }
};
</script>

<style>
</style>
