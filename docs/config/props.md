# 属性配置

## 基础属性

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| value | 是否显示对话框 | Boolean | false |
| render | 对话框内容 | Function/String/Object | - |
| position | 对话框位置 | String | 'center' |
| closeOnClickOverlay | 点击遮罩层是否关闭 | Boolean | false |
| overlayStyle | 遮罩层样式 | Object | {} |
| zIndex | 层级 | Number | 999 |
| beforeClose | 关闭前的回调函数 | Function | null |

## render 参数

| 参数 | 说明 | 类型 | 说明 |
|------|------|------|------|
| Function | 函数 | Function | 函数返回值为 VNode；函数参数第一个是 h 函数、第二个是Dialog实例，实例有个方法 action 可以触发关闭弹窗； |
| String | 字符串 | String | 字符串会直接渲染文字，自带模板 |
| Object | 对象 | Object | 对象为 VNode 对象 |

## position 可选值

| 值 | 说明 |
|------|------|
| center | 居中显示 |
| top | 顶部显示 |
| bottom | 底部显示 |
| left | 左侧显示 |
| right | 右侧显示 |

## closeOnClickOverlay 示例

```js
this.$dialog({
  render: '内容',
  closeOnClickOverlay: true
})
```

## overlayStyle 示例

```js
{
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(3px)'
}
```

## beforeClose 参数

| 参数 | 说明 | 类型 |
|------|------|------|
| done | 关闭对话框的方法 | Function |
| action | 触发关闭的来源 | String |
| data | 关闭时携带的数据 | Any | 

```js
this.$dialog({
  render: '内容',
  beforeClose: (done, action, data) => {
    done()
  }
})
```

## Promise 回调

| 参数 | 说明 | 类型 |
|------|------|------|
| action | 触发关闭的来源 | String |
| data | 关闭时携带的数据 | Any |
| options | 配置对象 | Object |

```js
this.$dialog({
  render: '内容',
}).then((result) => {
  const { action, data, options } = result
})
```
