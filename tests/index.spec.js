/* global describe, it, expect, beforeEach, afterEach, jest */

import Dialog from "../src/index";
import Vue from "vue";

describe("Dialog Plugin", () => {
  let vm = null;
  beforeEach(() => {
    // 安装插件
    Vue.use(Dialog);

    // 创建一个 Vue 实例来获取 h 函数
    vm = new Vue({
      render: (h) => h("div"),
    }).$mount();
  });

  afterEach(() => {});

  describe("Dialog", () => {
    // 核心功能
    it("should show dialog with text message", async () => {
      const message = "Test Text Message";
      Dialog({
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

    it("should show dialog with component", async () => {
      let result = null;

      // 获取h函数
      const h = vm.$createElement;
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
                click: () => Dialog.close(true),
              },
            },
            "Confirm"
          ),
        ]
      );

      Dialog({
        render: message,
      }).then((res) => {
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
      Dialog({
        render: message,
      }).then((res) => {
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

    it("should show dialog with error", async () => {
      let result;
      Dialog({
        render() {
          return null;
        },
      }).then((res) => {
        result = res;
      });

      // 等待渲染
      await Vue.nextTick();

      // 检查弹窗内容是否展示错误信息
      expect(document.querySelector(".dialog-container h1").textContent).toBe(
        "出错了, 渲染内容错误，请稍后再试！"
      );

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
    // 核心功能
  });
});
