# 事件

## Promise 回调

当使用 Promise 方式时，可以处理对话框的关闭结果：

```js
async function showDialog() {
  try {
    const result = await this.$dialog({
      render: '确认执行操作？'
    })
    
    // result 包含 action 和 data
    console.log('操作结果:', result.action)
    console.log('携带数据:', result.data)
  } catch (error) {
    console.error('对话框错误:', error)
  }
}
```

## 拦截器事件

拦截器可以在对话框生命周期的不同阶段进行干预：

```js
// 前置拦截器
Dialog.interceptors.before.use((config) => {
  console.log('对话框即将打开:', config)
  return config
})

// 后置拦截器
Dialog.interceptors.after.use((result) => {
  console.log('对话框已关闭:', result)
  return result
})
``` 