<script setup lang="ts">
import AuthLayout from "@/layouts/AuthLayout.vue"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const register = async () => {
  // mock
}
</script>

<template>
  <AuthLayout>
    <div class="space-y-3">
      <div class="space-y-2">
        <Label for="nickname">昵称</Label>
        <Input id="nickname" placeholder="请输入昵称" />
      </div>
      <div class="space-y-2">
        <Label for="account">登录账号</Label>
        <Input id="account" placeholder="请输入登录账号" />
      </div>
      <div class="space-y-2">
        <Label for="code">验证码</Label>
        <div class="flex gap-2">
          <Input id="code" placeholder="请输入验证码" />
          <Button variant="outline">获取验证码</Button>
        </div>
      </div>
      <div class="space-y-2">
        <Label for="password">密码</Label>
        <Input id="password" type="password" placeholder="输入新密码" />
      </div>
      <div class="space-y-2">
        <Label for="confirm">确认密码</Label>
        <Input id="confirm" type="password" placeholder="再次输入新密码" />
      </div>
      <div class="space-y-2">
        <Label for="invite">邀请码（选填）</Label>
        <Input id="invite" placeholder="请输入邀请码 (选填)" />
      </div>
      <Button class="w-full" @click="register">立即注册</Button>
    </div>
  </AuthLayout>
</template>