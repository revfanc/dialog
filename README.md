# @revfanc/dialog

一个简单、灵活、功能强大的 Vue.js 对话框组件。

## 特性

- 🚀 简单易用 - 提供简单直观的 API
- 🎨 可定制性强 - 支持自定义内容、样式和动画效果
- 💪 可靠性强 - 内置滚动锁定，完善的类型支持
- 🔄 拦截器支持 - 提供强大的拦截器机制

## 安装

```bash
npm install @revfanc/dialog
```

## 快速开始

```vue
<template>
  <div>
    <button @click="showDialog">打开对话框</button>
  </div>
</template>

<script setup>
import Dialog from '@revfanc/dialog'

const showDialog = () => {
  Dialog({
    render: 'hello world',
  });
};
</script>
```

## 文档

访问我们的[在线文档](https://revfanc.github.io/dialog/)了解更多信息：

- [快速开始](https://revfanc.github.io/dialog/guide/getting-started)
- [基础用法](https://revfanc.github.io/dialog/guide/basic-usage)
- [高级用法](https://revfanc.github.io/dialog/guide/advanced-usage)
- [API 参考](https://revfanc.github.io/dialog/config/)

## 开发

```bash
# 安装依赖
npm install

# 运行开发服务器
npm run dev

# 构建库
npm run build

# 运行测试
npm run test

# 构建文档
cd docs
npm install
npm run dev
```

## License

[MIT](LICENSE)
