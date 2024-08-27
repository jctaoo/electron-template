<script setup>
import { WINDOW_PATH } from "@common/path";
import LinkButton from "@renderer/components/LinkButton.vue";
import AuthLayout from "@renderer/layouts/AuthLayout.vue";
import { NFlex, NButton, NTabs, NTabPane, NForm, NFormItemRow, NInput, NDivider, NQrCode } from "naive-ui"
import { useRouter } from "vue-router";

const login = async () => {
    console.log('login');
    await window.electronAPI.storeLoginToken('token');
};
</script>

<template>
    <AuthLayout>
        <NFlex vertical justify="center" align="center">
            <n-qr-code value="text" :size="200" padding="0" />
            <span class="mt-3 text-gray-500">使用微信扫一扫登录</span>
        </NFlex>
    </AuthLayout>
</template>

<style scoped></style>