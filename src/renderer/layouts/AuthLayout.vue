<script setup lang="ts">
import WindowLayout from "@/layouts/WindowLayout.vue"
import { Button } from "@/components/ui/button"
import { useRouter } from "vue-router"

const props = withDefaults(defineProps<{ disableBack?: boolean }>(), {
  disableBack: false
})

const router = useRouter()
const back = () => router.back()
</script>

<template>
  <WindowLayout>
    <div class="w-screen h-screen flex items-center justify-center p-8 gap-12">
      <aside class="hidden md:block w-80 h-full rounded-2xl bg-gradient-to-b from-blue-600 to-blue-400" />
      <main class="relative flex-1 h-full flex items-center justify-center">
        <Button v-if="!props.disableBack" variant="ghost" class="absolute left-3 top-5" @click="back">
          返回
        </Button>
        <div class="w-full max-w-md">
          <slot />
        </div>
      </main>
    </div>
  </WindowLayout>
  
</template>

<style scoped>
</style>