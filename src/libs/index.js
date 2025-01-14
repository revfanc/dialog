import Vue from 'vue'
import Chain from './chain'
import DialogComponent from './Dialog'
import './index.css'

let multiple = true
let queue = []

let zIndex = 999

const removeNode = el => el.parentNode?.removeChild(el)

const isInDocument = el => document.body.contains(el)

function createInstance () {
  queue = queue.filter(item => !item.$el.parentNode || isInDocument(item.$el))

  if (!queue.length || multiple) {
    const instance = new (Vue.extend(DialogComponent))({
      el: document.createElement('div')
    })
    document.body.appendChild(instance.$el)

    queue.push(instance)
  }

  return queue[queue.length - 1]
}

function Dialog (options) {
  if (!options || typeof options !== 'object') {
    throw new TypeError('Options must be an object')
  }

  if (!options.content) {
    throw new TypeError('The "content" property is required in options')
  }

  return new Promise((resolve, reject) => {
    const instance = createInstance()

    instance.clear = (action, data) => {
      if (multiple) {
        instance.$on('closed', () => {
          queue = queue.filter(item => item !== instance)

          removeNode(instance.$el)
          instance.$destroy()
        })
      }
      instance.value = false
      instance.resolve({ action, data, options })
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
  if (!queue.length) {
    return
  }
  if (all) {
    queue.forEach(instance => instance.clear('close'))
  } else {
    queue[queue.length - 1].instance.clear('close')
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

Dialog.install = Vue => {
  Vue.prototype.$dialog = Dialog
}

export default Dialog

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Dialog)
}
