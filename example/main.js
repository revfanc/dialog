import Vue from "vue";
import App from "./App.vue";
import Dialog from "../src/index";

Vue.use(Dialog);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
