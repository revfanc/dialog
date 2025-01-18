# 配置参考

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

## 配置项说明

### 基础配置

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| render | 对话框内容 | Function/String/Object | - |
| position | 对话框位置 | String | 'center' |
| closeOnClickOverlay | 点击遮罩层是否关闭 | Boolean | false |
| overlayStyle | 遮罩层样式 | Object | {} |
| zIndex | 层级 | Number | 999 |
| beforeClose | 关闭前的回调函数 | Function | null |

### 动画相关

对话框提供了以下内置动画：

- fade: 淡入淡出效果
- center: 缩放效果
- top: 顶部滑入
- bottom: 底部滑入
- left: 左侧滑入
- right: 右侧滑入

动画效果会根据 position 属性自动选择。 