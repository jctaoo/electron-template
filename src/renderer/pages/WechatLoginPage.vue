<script setup lang="ts">
import AuthLayout from "@/layouts/AuthLayout.vue"
import { Button } from "@/components/ui/button"

const login = async () => {
  await window.electronAPI.storeLoginToken('token')
}
</script>

<template>
  <AuthLayout>
    <div class="flex flex-col items-center justify-center gap-4">
      <div class="size-48 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600" />
      <div class="text-gray-500">使用微信扫一扫登录（示例占位）</div>
      <Button class="w-full" @click="login">已完成扫码</Button>
    </div>
  </AuthLayout>
</template>

<style scoped></style>