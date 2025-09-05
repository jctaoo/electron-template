<script setup lang="ts">
import MainWindowLayout from "@/layouts/MainWindowLayout.vue"
import { Button } from "@/components/ui/button"

const logout = async () => {
  await window.electronAPI.clearSession()
}
</script>

<template>
  <MainWindowLayout>
    <div class="w-full h-screen flex flex-col items-center justify-center gap-4">
      <h1 class="text-2xl font-bold">Hello World!!</h1>
      <Button class="min-w-32" @click="logout">退出登录</Button>
    </div>
  </MainWindowLayout>
</template>
