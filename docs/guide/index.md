# 介绍

@revfanc/dialog 是一个基于 Vue.js 的对话框组件库，专注于提供灵活且功能强大的对话框解决方案。它支持多种展示位置、自定义内容、动画效果，并内置了滚动锁定等实用功能。

## 特性

- 📦 **开箱即用**: 简单的 API 设计，快速集成到项目中
- 🎨 **灵活定位**: 支持上、下、左、右、中心等多种展示位置
- 🎭 **动画效果**: 内置丰富的过渡动画，提供流畅的用户体验
- 🔒 **滚动锁定**: 智能的滚动锁定机制，避免移动端滚动穿透
- 🔌 **拦截器机制**: 支持前置/后置拦截器，轻松控制对话框生命周期
- ⚡️ **轻量级**: 压缩后体积小，不会影响您的应用性能
- 💪 **类型支持**: 完善的 TypeScript 类型定义
- 🎯 **Promise 支持**: 支持 Promise 式的调用方式

## 安装

```bash
# 使用 npm
npm install @revfanc/dialog

# 使用 yarn
yarn add @revfanc/dialog

# 使用 pnpm
pnpm add @revfanc/dialog
```

## 全局注册

```js
import Vue from 'vue'
import Dialog from '@revfanc/dialog'

Vue.use(Dialog)
```

## 按需引入

```js
import Dialog from '@revfanc/dialog'

// 在组件中使用
export default {
  methods: {
    showDialog() {
      Dialog({
        render: '这是一个对话框'
      })
    }
  }
}
```

## 浏览器引入

```html
<script src="https://unpkg.com/vue@2.6.0"></script>
<script src="https://unpkg.com/@revfanc/dialog"></script>

<script>
  // 组件会自动注册为全局组件
  Vue.use(Dialog)
</script>
``` 