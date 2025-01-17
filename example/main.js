import Vue from "vue";
import App from "./App.jsx";
import Dialog from "../src/index";

Vue.use(Dialog);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
