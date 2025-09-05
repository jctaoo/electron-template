<script setup lang="ts">
import { WINDOW_PATH } from "@common/path"
import LinkButton from "@/components/LinkButton.vue"
import AuthLayout from "@/layouts/AuthLayout.vue"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Separator from "@/components/ui/separator/Separator.vue"
import { useRouter } from "vue-router"

const login = async () => {
  await window.electronAPI.storeLoginToken('token')
}

const router = useRouter()
const goToForgotPassword = async () => router.push(WINDOW_PATH.forgetPage)
const goToSignUp = async () => router.push(WINDOW_PATH.registerPage)
const wechatLogin = async () => router.push(WINDOW_PATH.wechatLoginPage)
</script>

<template>
  <AuthLayout disable-back>
    <Tabs defaultValue="signin" class="w-full">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="signin">密码登录</TabsTrigger>
        <TabsTrigger value="code">验证码登录</TabsTrigger>
      </TabsList>

      <TabsContent value="signin" class="mt-4 space-y-3">
        <div class="space-y-2">
          <Label for="account">登录账号</Label>
          <Input id="account" placeholder="请输入登录账号" />
        </div>
        <div class="space-y-2">
          <Label for="password">登录密码</Label>
          <Input id="password" type="password" placeholder="请输入登录密码" />
        </div>
        <Button class="w-full" @click="login">立即登录</Button>
      </TabsContent>

      <TabsContent value="code" class="mt-4 space-y-3">
        <div class="space-y-2">
          <Label for="phone">登录账号</Label>
          <Input id="phone" placeholder="请输入登录账号" />
        </div>
        <div class="space-y-2">
          <Label for="code">验证码</Label>
          <div class="flex gap-2">
            <Input id="code" placeholder="请输入验证码" />
            <Button variant="outline">获取验证码</Button>
          </div>
        </div>
        <Button class="w-full" @click="login">立即登录</Button>
      </TabsContent>
    </Tabs>

    <div class="flex items-center justify-between mt-3 text-sm text-gray-600">
      <LinkButton text="忘记密码" @click="goToForgotPassword" />
      <LinkButton text="立即注册" @click="goToSignUp" />
    </div>

    <Separator class="my-4" />
    <div class="text-center text-gray-500 text-sm">其他登录方式（示例占位）</div>
  </AuthLayout>
</template>

<style scoped></style>