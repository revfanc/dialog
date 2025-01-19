# 快速开始

## 安装

```bash
# 使用 npm
npm install @revfanc/dialog

# 使用 yarn
yarn add @revfanc/dialog
```

## 注册组件

### 全局注册

```js
import Vue from 'vue'
import Dialog from '@revfanc/dialog'

Vue.use(Dialog)
```

### 局部注册

```js
import Dialog from '@revfanc/dialog'

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

## 基本示例

```vue
<template>
  <div>
    <button @click="showBasicDialog">显示基础对话框</button>
    <button @click="showCustomDialog">显示自定义对话框</button>
  </div>
</template>

<script>
export default {
  methods: {
    showBasicDialog() {
      this.$dialog({
        render: '这是一个基础对话框'
      })
    },
    
    async showCustomDialog() {
      try {
        const result = await this.$dialog({
          render: (h, { action }) => h('div', [
            h('h3', '自定义标题'),
            h('p', '这是自定义内容'),
            h('button', {
              on: { click: () => action('confirm', { name: 'revfanc' }) }
            }, '确认')
          ])
        })
        
        if (result.action === 'confirm') {
          console.log('用户点击了确认，传入的数据为：', JSON.stringify(result.data))
        }
      } catch (error) {
        console.error('对话框出错:', error)
      }
    }
  }
}
</script>
``` 