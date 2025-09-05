<script setup lang="ts">
import AuthLayout from "@/layouts/AuthLayout.vue"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const submit = async () => {}
</script>

<template>
  <AuthLayout>
    <div class="space-y-3">
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
        <Label for="password">新密码</Label>
        <Input id="password" type="password" placeholder="输入新密码" />
      </div>
      <div class="space-y-2">
        <Label for="confirm">确认新密码</Label>
        <Input id="confirm" type="password" placeholder="再次输入新密码" />
      </div>
      <Button class="w-full" @click="submit">确认修改</Button>
    </div>
  </AuthLayout>
</template>