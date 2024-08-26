<script setup>
import log from 'electron-log/renderer';

const login = async () => {
  await window.electronAPI.storeLoginToken('token');
};

const logDemo = () => {
  log.info('Demo log');
};
</script>

<template>
  <h1>Login Page</h1>
  <button @click="login">Login</button>
  <button @click="logDemo">Log Demo</button>
</template>