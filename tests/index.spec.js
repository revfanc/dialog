/* global describe, it, expect, beforeEach, afterEach, jest */

import Dialog from "../src/index";
import Vue from "vue";

describe("Dialog Plugin", () => {
  let instance;

  beforeEach(() => {
    // 清理 DOM
    document.body.innerHTML = "";
    // 安装插件
    Vue.use(Dialog);
  });

  afterEach(() => {
    // 清理实例
    if (instance && instance.$el) {
      document.body.removeChild(instance.$el);
    }
    instance = null;
  });

  describe("Dialog.alert", () => {
    it("should show alert dialog with message", async () => {
      const message = "Test Alert Message";
      instance = await Dialog.alert({
        render: message,
      });

      // 检查 DOM 中是否包含消息
      expect(document.body.textContent).toContain(message);
      // 检查是否添加了正确的类名
      expect(document.querySelector(".dialog-content")).toBeTruthy();
    });

    it("should resolve when confirmed", async () => {
      const promise = Dialog.alert("Test");
      instance = await promise;

      // 触发确认
      instance.action("confirm");
      await promise;

      // 检查对话框是否被移除
      expect(document.querySelector(".dialog-content")).toBeFalsy();
    });
  });
});
