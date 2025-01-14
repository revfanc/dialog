import Vue from 'vue'
import Chain from './chain'
import DialogComponent from './Dialog'
import { removeNode } from './utils'
import './index.css'

const chain = new Chain()
let multiple = true
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

    instance.clear = (...res) => {
      if (multiple) {
        instance.$on('closed', () => {
          queue = queue.filter(item => item !== instance)

          removeNode(instance.$el)
          instance.$destroy()
        })
      }
      instance.value = false
      instance.resolve({
        action: res[0],
        data: res[1],
        options
      })
    }

    zIndex += 10

    Object.assign(instance, Dialog.currentOptions, options, { zIndex, resolve, reject })

    if (!options.content) {
      instance.value = false
      instance.clear('error', 'content is required')
    }
  })
}

Dialog.defaultOptions = {
  value: true,
  content: null,
  props: {},
  position: 'center',
  closeOnClickOverlay: false,
  overlayStyle: {},
  zIndex: 999,
  beforeClose: null
}

Dialog.close = all => {
  if (queue.length) {
    if (all) {
      queue.forEach(instance => {
        instance.clear('close')
      })
      queue = []
    } else if (!multiple) {
      queue[queue.length - 1].clear('close')
    } else {
      const instance = queue.pop()
      instance.clear('close')
    }
  }
}

Dialog.action = (...args) => {
  if (queue.length) {
    queue[queue.length - 1].action(...args)
  }
}

Dialog.allowMultiple = (value = true) => {
  multiple = value
}

/**
 * 获取当前展示中的弹窗
 * @return {number}
 */
Dialog.getCurrentInstances = () => {
  const instances = queue.filter(instance => instance?.value) || []

  return instances
}

Dialog.chain = chain

Dialog.alert = async options => chain.handler(Dialog, options)

Dialog.resetOptions = () => {
  Dialog.currentOptions = { ...Dialog.defaultOptions }
}

Dialog.setOptions = options => {
  Dialog.currentOptions = { ...Dialog.currentOptions, ...options }
}

Dialog.resetOptions()

export { Dialog }

export default {
  install (Vue) {
    Vue.prototype.$dialog = Dialog
  }
}
