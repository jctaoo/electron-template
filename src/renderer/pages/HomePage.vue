<script setup>
const logout = async () => {
  await window.electronAPI.clearSession();
};
</script>

<template>
  <h1>HomePage</h1>
  <button @click="logout">logout</button>
</template>
