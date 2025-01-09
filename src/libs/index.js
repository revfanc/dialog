import Vue from 'vue'
import Chain from './chain'
import DialogComponent from './Dialog.vue'
import { removeNode } from './utils'

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

    if (options.content) {
      instance.$slots.default = [options.content]
    }

    instance.clear = (result) => {
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

    zIndex += 10

    Object.assign(instance, Dialog.currentOptions, options, { zIndex, resolve, reject })

    if (!options.content) {
      instance.value = false
      instance.clear({ action: 'error', params: 'No content!' })
    }
  })
}

Dialog.defaultOptions = {
  value: true,
  params: null,
  position: 'center',
  overlayStyle: null,
  beforeClose: null
}

Dialog.close = all => {
  if (queue.length) {
    const closeParams = { action: 'close', params: null }
    if (all) {
      queue.forEach(instance => {
        instance.clear(closeParams)
      })
      queue = []
    } else if (!multiple) {
      queue[queue.length - 1].clear(closeParams)
    } else {
      const instance = queue.pop()
      instance.clear(closeParams)
    }
  }
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
