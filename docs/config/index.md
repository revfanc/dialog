# 配置参考

## 配置项说明

### 基础配置

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| position | 对话框位置 | String | 'center' |
| closeOnClickOverlay | 点击遮罩层是否关闭 | Boolean | false |
| overlayStyle | 遮罩层样式 | Object | {} |
| zIndex | 层级 | Number | 999 |

## 全局配置

你可以通过 `Dialog.setOptions()` 方法设置全局默认配置：

```js
Dialog.setOptions({
  position: 'center',
  closeOnClickOverlay: true,
  zIndex: 1000,
  overlayStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  }
})
```

## 实例配置

每个对话框实例可以通过传入配置对象来覆盖全局配置：

```js
this.$dialog({
  render: '对话框内容',
  position: 'bottom',
  closeOnClickOverlay: true,
  overlayStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  beforeClose: (done) => {
    // 关闭前的处理逻辑
    done()
  }
})
```
