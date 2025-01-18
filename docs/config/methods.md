# 实例方法

## Dialog 实例方法

### close([all])

关闭对话框。

```js
// 关闭最上层对话框
Dialog.close()

// 关闭所有对话框
Dialog.close(true)
```

### getInstances()

获取当前所有对话框实例。

```js
const instances = Dialog.getInstances()
console.log(`当前有 ${instances.length} 个对话框`)
```

### setOptions(options)

设置全局默认配置。

```js
Dialog.setOptions({
  position: 'center',
  closeOnClickOverlay: true
})
```

### resetOptions()

重置全局配置为默认值。

```js
Dialog.resetOptions()
```

## 拦截器方法

### interceptors.before.use(resolved, rejected)

添加前置拦截器。

```js
Dialog.interceptors.before.use(
  (config) => {
    // 修改配置
    return config
  },
  (error) => {
    // 处理错误
    return Promise.reject(error)
  }
)
```

### interceptors.after.use(resolved, rejected)

添加后置拦截器。

```js
Dialog.interceptors.after.use(
  (result) => {
    // 处理结果
    return result
  },
  (error) => {
    // 处理错误
    return Promise.reject(error)
  }
)
```

## 回调函数

### beforeClose(done, action, data)

关闭前的回调函数。

| 参数 | 说明 | 类型 |
|------|------|------|
| done | 关闭对话框的方法 | Function |
| action | 触发关闭的来源 | String |
| data | 关闭时携带的数据 | Any |

```js
this.$dialog({
  render: '内容',
  beforeClose: (done, action, data) => {
    if (action === 'confirm') {
      // 确认关闭
      done()
    } else {
      // 取消关闭
      done(false)
    }
  }
})
``` 