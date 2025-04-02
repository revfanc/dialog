import { h } from 'vue'
import Interceptors from './interceptors'
import RootComponent from './Dialog'
import './style.css'

import { mountComponent, useState } from './utils'

interface DialogOptions {
  modelValue?: boolean
  render: Function | object | null
  position?: 'center' | 'top' | 'bottom' | 'right' | 'left'
  closeOnClickOverlay?: boolean
  overlayStyle?: Record<string, any> | null
  zIndex?: number
  beforeClose?: ((close: (...args: any[]) => void, ...args: any[]) => void) | null
}

export interface DialogRes {
  action: string
  data?: any
}

interface DialogInstance {
  instance: any
  unmount: () => void
}

const INIT_OPTIONS: DialogOptions = {
  modelValue: true,
  render: null,
  position: 'center',
  closeOnClickOverlay: false,
  overlayStyle: null,
  zIndex: 999,
  beforeClose: null
}


const queue: DialogInstance[] = []

const interceptors = new Interceptors()

function createInstance(): DialogInstance {
  const Wrapper = {
    setup() {
      const { state } = useState();
      return () => h(RootComponent, {
        ...state,
      });
    },
  };

  const component = mountComponent(Wrapper)

  queue.push(component)

  return queue[queue.length - 1]
}

function useDialog(opts: DialogOptions) {
  let currentOptions: DialogOptions = Object.assign({}, INIT_OPTIONS, opts)

  const alert = (options: DialogOptions) => {
    return interceptors.execute((options: DialogOptions) => {
      return new Promise((resolve, reject) => {
        try {
          if (!options || typeof options !== 'object') {
            throw new TypeError('Options must be an object')
          }

          if (!options.render) {
            throw new TypeError('The "render" property is required in options')
          }

          const { instance, unmount } = createInstance()

          instance.open(
            Object.assign({}, currentOptions, options, {
              onAction: (res: DialogRes) => {
                resolve(res)
                unmount()
              },
            }),
          );
        } catch (error) {
          reject(error)
        }
      })
    }, options)
  }

  const close = (all?: boolean) => {
    if (!queue.length) {
      return
    }
    if (all) {
      queue.forEach((item) => item.instance.$emit('action', 'close'))
    } else {
      queue[queue.length - 1].instance.$emit('action', 'close')
    }
  }

  const getInstances = () => {
    return queue
  }

  const setOptions = (options: Partial<DialogOptions>) => {
    currentOptions = Object.assign({}, currentOptions, options)
  }

  return {
    alert,
    close,
    interceptors,
    getInstances,
    setOptions,
  }
}

export default useDialog
