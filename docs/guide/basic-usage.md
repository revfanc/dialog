# 基础用法

## 文本内容

最简单的使用方式是传入一个字符串：

```js
this.$dialog({
  render: '这是一个简单的对话框'
})
```

## 自定义位置

支持多种展示位置：

```js
// 顶部展示
this.$dialog({
  render: '顶部对话框',
  position: 'top'
})

// 底部展示
this.$dialog({
  render: '底部对话框',
  position: 'bottom'
})

// 左侧展示
this.$dialog({
  render: '左侧对话框',
  position: 'left'
})

// 右侧展示
this.$dialog({
  render: '右侧对话框',
  position: 'right'
})
```

## 自定义内容

支持传入 Vue 组件或渲染函数：

```vue
<template>
  <button @click="showCustomDialog">显示自定义对话框</button>
</template>

<script>
export default {
  methods: {
    showCustomDialog() {
      this.$dialog({
        render: (h) => h('div', [
          h('h1', '自定义标题'),
          h('p', '这是一段自定义内容'),
          h('button', {
            on: {
              click: () => {
                // 处理按钮点击
              }
            }
          }, '确定')
        ])
      })
    }
  }
}
</script>
```

## Promise 支持

支持 Promise 方式处理对话框的关闭事件：

```js
async function showDialog() {
  try {
    const result = await this.$dialog({
      render: '确认删除吗？'
    })
    
    if (result.action === 'confirm') {
      // 用户点击确认
      await deleteItem()
    }
  } catch (err) {
    // 处理错误
  }
}
```

## 关闭前确认

使用 beforeClose 控制关闭行为：

```js
this.$dialog({
  render: '需要确认才能关闭的对话框',
  beforeClose: (done, action) => {
    if (action === 'close') {
      if (window.confirm('确认关闭吗？')) {
        done()
      }
    } else {
      done()
    }
  }
})
``` 