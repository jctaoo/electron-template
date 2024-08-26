<script setup>
const login = async () => {
  await window.electronAPI.storeLoginToken('token');
};
</script>

<template>
  <h1>Login Page</h1>
  <button @click="login">Login</button>
</template>