# 高级用法

## 拦截器使用

Dialog 提供了强大的拦截器机制，可以在显示前和关闭后进行拦截处理。

### 前置拦截器

```js
Dialog.interceptors.before.use(
  (config) => {
    // 在显示对话框前修改配置
    config.overlayStyle = {
      ...config.overlayStyle,
      backgroundColor: 'rgba(0, 0, 0, 0.8)'
    }
    return config
  },
  (error) => {
    // 处理错误
    return Promise.reject(error)
  }
)
```

### 后置拦截器

```js
Dialog.interceptors.after.use(
  (result) => {
    // 对话框关闭后的处理
    console.log('Dialog closed with:', result)
    return result
  },
  (error) => {
    // 处理错误
    console.error('Dialog error:', error)
    return Promise.reject(error)
  }
)
```

## 多实例管理

Dialog 支持多个实例的管理：

```js
// 获取所有实例
const instances = Dialog.getInstances()

// 关闭最上层对话框
Dialog.close()

// 关闭所有对话框
Dialog.close(true)
```

## 自定义动画

通过 CSS 自定义动画效果：

| 类名 | 说明 |
|------|------|
| fade-**-** | 淡入动画 |
| center-**-** | 中心动画 |
| top-**-** | 顶部动画 |
| bottom-**-** | 底部动画 |
| left-**-** | 左侧动画 |
| right-**-** | 右侧动画 |

```css
/* 自定义淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* 自定义滑动动画 */
.center-enter-active,
.center-leave-active {
  transition: transform 0.5s ease;
}

.center-enter,
.center-leave-to {
  transform: translateY(100%);
}
``` 