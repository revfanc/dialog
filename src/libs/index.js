import Vue from 'vue'
import Chain from './chain'
import DialogComponent from './Dialog.vue'
import { removeNode } from './utils'

const chain = new Chain()
let multiple = false
let queue = []

let zIndex = 999

function isInDocument (element) {
  return document.body.contains(element)
}

function createInstance () {
  queue = queue.filter(item => !item.$el.parentNode || isInDocument(item.$el))

  if (!queue.length || multiple) {
    const instance = new (Vue.extend(DialogComponent))({
      el: document.createElement('div')
    })
    document.body.appendChild(instance.$el)
    instance.$on('input', value => {
      instance.value = value
    })

    queue.push(instance)
  }

  return queue[queue.length - 1]
}

function Dialog (options) {
  return new Promise((resolve, reject) => {
    const instance = createInstance()

    const dialogComponent = Dialog.components.find(item => item.key === options.key)?.component

    options.clear = (result) => {
      if (multiple) {
        instance.$on('closed', () => {
          queue = queue.filter(item => item !== instance)

          removeNode(instance.$el)
          instance.$destroy()
        })
      }
      instance.value = false
      instance.resolve({ ...result, options })
    }

    zIndex = zIndex + 10

    Object.assign(instance, Dialog.currentOptions, { zIndex }, options, { dialogComponent }, { resolve, reject })

    if (!dialogComponent) {
      instance.value = false
      instance.reject({
        action: 'error',
        message: '找不到对应弹窗组件，请检查传入的key是否有对应的组件'
      })
    }
  })
}

Dialog.defaultOptions = {
  value: true,
  component: null,
  params: null,
  position: 'center',
  overlayStyle: null,
  beforeClose: null,
  callback (action, params) {
    try {
      this.clear({ action, params })
    } catch (error) {
      this.reject({
        action: 'error',
        params: JSON.stringify(error) || '未知错误'
      })
    }
  }
}

Dialog.components = []

Dialog.close = all => {
  if (queue.length) {
    const closeParams = { action: 'close', params: null }
    if (all) {
      queue.forEach(instance => {
        instance.clear(closeParams)
      })
      queue = []
    } else if (!multiple) {
      queue[0].clear(closeParams)
    } else {
      const instance = queue.shift()
      instance.clear(closeParams)
    }
  }
}
Dialog.closePromisify = Dialog.close

/**
 * 添加
 * @param {*} params
 */
Dialog.add = params => {
  if (!Array.isArray(params) && !typeof params === 'function') {
    throw new Error('params must be array or function')
  }

  const routes = Array.isArray(params) ? params : [params]

  routes.forEach(element => {
    const index = Dialog.components.findIndex(item => item.key === element.key)
    if (index === -1) {
      Dialog.components.push(element)
    } else {
      Dialog.components.splice(index, 1, element)
    }
  })
}

Dialog.allowMultiple = (value = true) => {
  multiple = value
}

/**
 * 获取当前展示中的弹窗的数量
 * @return {number}
 */
Dialog.getCurrentCount = () => {
  const instances = queue.filter(instance => instance?.value) || []

  const length = instances.length

  return length
}

Dialog.getCurrentInstances = () => {
  const instances = queue.filter(instance => instance?.value) || []

  return instances
}

Dialog.chain = chain

Dialog.alert = async options => chain.handler(Dialog, options)

Dialog.resetOptions = () => {
  Dialog.currentOptions = { ...Dialog.defaultOptions }
}

Dialog.resetOptions()

export { Dialog }

export default {
  install (Vue) {
    Vue.prototype.$dialog = Dialog
  }
}
