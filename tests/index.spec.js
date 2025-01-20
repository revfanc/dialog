/* global describe, it, expect, beforeEach, afterEach, jest */

import Dialog from "../src/index";
import Vue from "vue";

describe("Dialog test", () => {
  let self = null;
  beforeEach(() => {
    // 安装插件
    Vue.use(Dialog);

    // 创建一个 Vue 实例
    self = new Vue({
      render: (h) => h("div"),
    }).$mount();
  });

  afterEach(() => {
    // 关闭所有对话框
    self.$dialog.close(true);

    // 销毁实例
    self.$destroy();
    self = null;
  });

  // 测试插件是否安装
  it("should install Dialog plugin", () => {
    Vue.use(Dialog);

    // 创建一个 Vue 实例
    let vm = new Vue({
      render: (h) => h("div"),
    }).$mount();

    // 检查 Dialog 是否在 Vue 实例的原型链上
    expect(vm.$dialog).toBeDefined();

    // 销毁实例
    vm.$destroy();
    vm = null;
  });

  // 测试文本消息
  it("should show dialog with text message", async () => {
    const message = "Test Text Message";
    self.$dialog({
      render: message,
    });

    // 等待渲染
    await Vue.nextTick();

    // 检查弹窗是否存在
    expect(document.querySelector(".dialog-container")).toBeTruthy();

    // 检查弹窗内容是否正确
    expect(document.querySelector(".dialog-container h1").textContent).toBe(
      message
    );

    // 检查弹窗是否有遮罩层
    expect(document.querySelector(".dialog-overlay")).toBeTruthy();

    // 检查弹窗是否可以关闭
    const closeButton = document.querySelector(
      ".dialog-content--normal button"
    );
    expect(closeButton).toBeTruthy();
    closeButton.click();

    // 等待300ms
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 检查弹窗是否被移除
    expect(document.querySelector(".dialog-container")).toBeFalsy();
  });

  // 测试组件消息
  it("should show dialog with component", async () => {
    let result = null;

    // 获取h函数
    const h = self.$createElement;

    // 创建组件消息
    const message = h(
      "div",
      {
        class: "dialog-comp",
      },
      [
        h(
          "div",
          {
            class: "msg",
          },
          "Test Component Message"
        ),
        h(
          "button",
          {
            class: "close",
            on: {
              click: () => self.$dialog.close(true),
            },
          },
          "Confirm"
        ),
      ]
    );

    self
      .$dialog({
        render: message,
      })
      .then((res) => {
        result = res;
      });

    // 等待渲染
    await Vue.nextTick();

    // 检查弹窗内容是否正确
    expect(document.querySelector(".dialog-comp .msg").textContent).toBe(
      "Test Component Message"
    );

    // 检查弹窗是否有遮罩层
    expect(document.querySelector(".dialog-overlay")).toBeTruthy();

    // 检查弹窗是否可以关闭
    const closeButton = document.querySelector(".dialog-comp .close");
    expect(closeButton).toBeTruthy();
    closeButton.click();

    // 等待300ms
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 检查弹窗是否被移除
    expect(document.querySelector(".dialog-comp")).toBeFalsy();

    // 检查结果是否正确
    expect(result && result.action).toBe("close");
  });

  // 测试渲染消息
  it("should show dialog with render", async () => {
    let result = null;
    const message = (h, { action }) => {
      return (
        <div class="dialog-rend">
          <div class="msg">Test Render Message</div>
          <button
            class="close"
            onClick={() => action("confirm", "我点击了确定")}
          >
            Confirm
          </button>
        </div>
      );
    };
    self
      .$dialog({
        render: message,
      })
      .then((res) => {
        result = res;
      });

    // 等待渲染
    await Vue.nextTick();

    // 检查弹窗内容是否正确
    expect(document.querySelector(".dialog-rend .msg").textContent).toBe(
      "Test Render Message"
    );

    // 检查弹窗是否有遮罩层
    expect(document.querySelector(".dialog-overlay")).toBeTruthy();

    // 检查弹窗是否可以关闭
    const closeButton = document.querySelector(".dialog-rend .close");
    expect(closeButton).toBeTruthy();
    closeButton.click();

    // 等待300ms
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 检查弹窗是否被移除
    expect(
      document.querySelector(".dialog-container .dialog-rend")
    ).toBeFalsy();

    // 检查结果是否正确
    expect(result && result.data).toBe("我点击了确定");
  });

  // 测试错误消息
  it("should show dialog with error", async () => {
    let result;
    self
      .$dialog({
        render() {
          return null;
        },
      })
      .then((res) => {
        result = res;
      });

    // 等待渲染
    await Vue.nextTick();

    // 检查弹窗内容是否展示错误信息
    expect(document.querySelector(".dialog-container h1").textContent).toBe(
      "出错了, 渲染内容错误，请稍后再试！"
    );

    // 检查弹窗是否有遮罩层
    expect(document.querySelector(".dialog-overlay")).toBeTruthy();

    // 检查弹窗是否可以关闭
    const closeButton = document.querySelector(".dialog-container button");
    expect(closeButton).toBeTruthy();
    closeButton.click();

    // 等待300ms
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 检查弹窗是否被移除
    expect(document.querySelector(".dialog-container h1")).toBeFalsy();

    // 检查结果是否正确
    expect(result && result.action).toBe("confirm");
  });

  it("should throw error when options is not an object", () => {
    expect(() => Dialog()).toThrow("Options must be an object");
    expect(() => Dialog(null)).toThrow("Options must be an object");
    expect(() => Dialog("string")).toThrow("Options must be an object");
  });

  it("should throw error when render is not provided", () => {
    expect(() => Dialog({})).toThrow(
      'The "render" property is required in options'
    );
  });

  it("should close all dialogs when Dialog.close(true) is called", async () => {
    // 创建多个对话框
    Dialog({ render: "Dialog 1" });
    Dialog({ render: "Dialog 2" });
    Dialog({ render: "Dialog 3" });

    await Vue.nextTick();

    // 检查是否创建了3个对话框
    expect(document.querySelectorAll(".dialog-container").length).toBe(3);

    // 关闭所有对话框
    Dialog.close(true);

    // 等待动画结束
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 检查是否所有对话框都被关闭
    expect(document.querySelectorAll(".dialog-container").length).toBe(0);
  });

  it("should get correct dialog instances", async () => {
    Dialog({ render: "Dialog 1" });
    Dialog({ render: "Dialog 2" });

    await Vue.nextTick();

    const instances = Dialog.getInstances();
    expect(instances.length).toBe(2);

    // 关闭所有对话框
    Dialog.close(true);

    // 等待动画结束
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 检查是否所有对话框都被关闭
    expect(document.querySelectorAll(".dialog-container").length).toBe(0);
  });

  it("should set custom options correctly", async () => {
    Dialog.resetOptions();

    // 检查默认选项
    expect(Dialog.currentOptions.zIndex).toBe(999);

    Dialog.setOptions({
      position: "top",
      closeOnClickOverlay: true,
      zIndex: 2000,
    });

    Dialog({ render: "Test Message" });

    await Vue.nextTick();

    const overlay = document.querySelector(".dialog-overlay");
    expect(overlay.style.zIndex).toBe("2000");
    const content = document.querySelector(".dialog-content");
    expect(content.style.zIndex).toBe("2001");

    // 测试点击遮罩层关闭
    overlay.click();
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(document.querySelector(".dialog-container")).toBeFalsy();

    Dialog.resetOptions();
  });

  it("should reset options correctly", async () => {
    // 先设置自定义选项
    Dialog.setOptions({ zIndex: 2000 });

    // 重置选项
    Dialog.resetOptions();

    Dialog({ render: "Test Message" });

    await Vue.nextTick();

    const overlay = document.querySelector(".dialog-overlay");
    expect(overlay.style.zIndex).toBe("999");

    // 关闭所有对话框
    Dialog.close(true);

    // 等待动画结束
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 检查是否所有对话框都被关闭
    expect(document.querySelectorAll(".dialog-container").length).toBe(0);
  });

  it("should execute interceptors correctly", async () => {
    // 添加前置拦截器
    Dialog.interceptors.before.use((options) => {
      // 修改传入的选项
      return {
        ...options,
        position: "bottom",
      };
    });

    // 添加后置拦截器
    Dialog.interceptors.after.use((result) => {
      // 修改返回的结果
      return {
        ...result,
        intercepted: true,
      };
    });

    let dialogResult;
    Dialog({
      render: (h, { action }) => {
        return (
          <div>
            <div>Test Message</div>
            <button
              onClick={() => {
                action("close");
              }}
            >
              Close
            </button>
          </div>
        );
      },
      position: "center", // 初始位置为center
    })
      .then((res) => {
        dialogResult = res;
      })
      .catch((err) => {
        dialogResult = err;
      });

    await new Promise((resolve) => setTimeout(resolve, 300));

    // 验证前置拦截器是否生效（position 被修改为 top）
    const dialog = Dialog.getInstances()[0];

    expect(dialog.position).toBe("bottom");

    // 验证弹窗是否存在
    expect(document.querySelector(".dialog-container")).toBeTruthy();

    // 触发关闭
    const closeButton = document.querySelector(".dialog-container button");
    expect(closeButton).toBeTruthy();
    closeButton.click();

    // 等待关闭动画完成
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 验证后置拦截器是否生效
    expect(dialogResult.intercepted).toBe(true);

    // 清理拦截器
    Dialog.interceptors.before.clear();
    Dialog.interceptors.after.clear();
  });

  it("should handle interceptor rejection", async () => {
    // 添加拒绝的拦截器
    Dialog.interceptors.before.use((options) => {
      return Promise.reject("Interceptor rejected");
    });

    try {
      await Dialog({ render: "Test Message" });
    } catch (error) {
      expect(error).toBe("Interceptor rejected");
    }

    // 清理拦截器
    Dialog.interceptors.before.clear();
  });

  it("should be able to eject interceptors", () => {
    // 添加拦截器并获取 id
    const id = Dialog.interceptors.before.use((options) => {
      return {
        ...options,
        modified: true,
      };
    });

    // 移除该拦截器
    Dialog.interceptors.before.eject(id);

    // 验证拦截器数组中该位置为 null
    expect(Dialog.interceptors.before.interceptors[id]).toBe(null);
  });

  it("should manage dialogs in a queue", async () => {
    Dialog({ render: "Dialog 1" });
    Dialog({ render: "Dialog 2" });
    Dialog({ render: "Dialog 3" });

    await Vue.nextTick();

    expect(Dialog.getInstances().length).toBe(3);

    // 关闭最后一个对话框
    Dialog.close();
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(Dialog.getInstances().length).toBe(2);

    // 检查是否移除节点
    expect(document.querySelectorAll(".dialog-container").length).toBe(2);

    // 关闭所有对话框
    Dialog.close(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(Dialog.getInstances().length).toBe(0);

    // 检查是否移除节点
    expect(document.querySelectorAll(".dialog-container").length).toBe(0);
  });
});
