import Vue from 'vue'
import Chain from './chain'
import DialogComponent from './Dialog'
import { removeNode } from './utils'
import './index.css'

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
  if (typeof options !== 'object' || options === null) {
    throw new TypeError('Options must be an object')
  }

  if (!('content' in options)) {
    throw new Error('The "content" property is required in options')
  }

  return new Promise((resolve, reject) => {
    const instance = createInstance()

    instance.clear = (...res) => {
      const [action, data] = res
      if (multiple) {
        instance.$on('closed', () => {
          queue = queue.filter(item => item !== instance)

          removeNode(instance.$el)
          instance.$destroy()
        })
      }
      instance.value = false
      instance.resolve({
        action,
        data,
        options
      })
    }

    zIndex += 10

    Object.assign(instance, Dialog.currentOptions, options, { zIndex, resolve, reject })
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
      queue.forEach(instance => instance.clear('close'))
    } else {
      queue[queue.length - 1].instance.clear('close')
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

Dialog.getInstances = () => {
  return queue
}

Dialog.chain = new Chain()

Dialog.alert = async options => Dialog.chain.handler(Dialog, options)

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
