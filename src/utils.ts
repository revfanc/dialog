import { createApp, getCurrentInstance, reactive } from 'vue';
import type { Component } from 'vue';

export function useExpose<T = Record<string, any>>(apis: T) {
  const instance = getCurrentInstance();
  if (instance) {
    Object.assign(instance.proxy as object, apis);
  }
}

export function useState() {
  const state = reactive<{
    modelValue: boolean;
    [key: string]: any;
  }>({
    modelValue: false,
  });

  const toggle = (modelValue: boolean) => {
    state.modelValue = modelValue;
  };

  const open = (props: Record<string, any>) => {
    Object.assign(state, props);
    toggle(true);
  };

  const close = () => toggle(false);

  useExpose({ open, close, toggle });

  return {
    open,
    close,
    state,
    toggle,
  };
}

export function mountComponent(RootComponent: Component): {
  instance: any;
  unmount: () => void;
} {
  const app = createApp(RootComponent);
  const root = document.createElement('div');

  document.body.appendChild(root);

  return {
    instance: app.mount(root),
    unmount() {
      app.unmount();
      document.body.removeChild(root);
    },
  };
}