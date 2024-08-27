<script setup lang="ts">
import WindowLayout from "@renderer/layouts/WindowLayout.vue";
import { NButton, NFlex, NIcon } from "naive-ui"
import { ArrowBack } from "@vicons/ionicons5"
import { useRoute, useRouter } from "vue-router";

const props = withDefaults(defineProps<{
  disableBack: boolean
}>(), {
  disableBack: false
});

const router = useRouter();

const back = () => {
  router.back();
};
</script>

<template>
  <WindowLayout>
    <NFlex class="page-container">
      <div class="relative">
        <span class="h-full overflow-hidden">
          <div class="side-image" />
        </span>
        <img src="../assets/login/over.png" class="side-image-over" />
      </div>
      <main class="relative h-full flex items-center justify-center">
        <NButton v-if="!props.disableBack" secondary circle class="absolute left-3 top-5" @click="back">
          <template #icon>
            <n-icon>
              <ArrowBack />
            </n-icon>
          </template>
        </NButton>
        <div class="w-full">
          <slot></slot>
        </div>
      </main>
    </NFlex>
  </WindowLayout>
</template>

<style scoped>
.page-container {
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
}

.side-image-over {
  position: absolute;
  bottom: 0;
  right: -50px;
}

.side-image {
  height: 100vh;
  background-image: url('../assets/login/side.png');
  width: 300px;
  background-size: cover;
  background-position: center;
}

main {
  flex: 1;
  padding: 0 8%;
}
</style>