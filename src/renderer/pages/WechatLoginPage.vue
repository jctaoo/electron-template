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
</script>

<template>
  <AuthLayout>
  </AuthLayout>
</template>

<style scoped>
</style>