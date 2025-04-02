import { createApp, App } from 'vue'
import Interceptors from './interceptors'
import DialogComponent from './Dialog'
import './style.css'

import { merge, removeNode, isInDocument } from './utils'

interface DialogOptions {
  value?: boolean
  render: Function | string | object
  position?: string
  closeOnClickOverlay?: boolean
  overlayStyle?: Record<string, any>
  zIndex?: number
  beforeClose?: (done: (...args: any[]) => void, ...args: any[]) => void
}

interface DialogInstance {
  $el: HTMLElement
  value: boolean
  resolve: (result: { action: string; data: any; options: DialogOptions }) => void
  reject: (error: any) => void
  $emit: (event: string, ...args: any[]) => void
  $destroy: () => void
  __context__?: any
}

let queue: DialogInstance[] = []
let _store: any
let _router: any

const interceptors = new Interceptors()

function createInstance(): DialogInstance {
  queue = queue.filter(
    (item) => !item.$el.parentNode || isInDocument(item.$el)
  )

  const app = createApp(DialogComponent)
  const instance = app.mount(document.createElement('div')) as DialogInstance
  document.body.appendChild(instance.$el)

  queue.push(instance)

  return queue[queue.length - 1]
}

function Dialog(options: DialogOptions) {
  if (!options || typeof options !== 'object') {
    throw new TypeError('Options must be an object')
  }

  if (!options.render) {
    throw new TypeError('The "render" property is required in options')
  }

  const promise = (options: DialogOptions) => {
    return new Promise((resolve, reject) => {
      const instance = createInstance()

      instance.__context__ = this

      instance.$emit('action', (action: string, data: any) => {
        instance.$emit('closed', () => {
          queue = queue.filter((item) => item !== instance)
          removeNode(instance.$el)
          instance.$destroy()
        })

        instance.value = false
        instance.resolve({ action, data, options })
      })

      instance.$emit('opened', () => {
        Dialog.currentOptions.zIndex += 10
      })

      merge(instance, Dialog.currentOptions, options, {
        resolve,
        reject,
      })
    })
  }

  return interceptors._execute(promise, options)
}

Dialog.defaultOptions = {
  value: true,
  render: null,
  position: 'center',
  closeOnClickOverlay: false,
  overlayStyle: {},
  zIndex: 999,
  beforeClose: null,
}

Dialog.close = (all?: boolean) => {
  if (!queue.length) {
    return
  }
  if (all) {
    queue.forEach((instance) => instance.$emit('action', 'close'))
  } else {
    queue[queue.length - 1].$emit('action', 'close')
  }
}

Dialog.getInstances = () => {
  return queue
}

Dialog.interceptors = interceptors

Dialog.resetOptions = () => {
  Dialog.currentOptions = merge({}, Dialog.defaultOptions)
}

Dialog.setOptions = (options: Partial<DialogOptions>) => {
  Dialog.currentOptions = merge({}, Dialog.currentOptions, options)
}

Dialog.resetOptions()

Dialog.install = (app: App, options?: { store?: any; router?: any }) => {
  const { store, router } = options || {}
  _store = store
  _router = router

  app.config.globalProperties.$dialog = Dialog
}

export default Dialog

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $dialog: typeof Dialog
  }
}

if (typeof window !== 'undefined' && (window as any).Vue) {
  ;(window as any).Vue.use(Dialog)
} 