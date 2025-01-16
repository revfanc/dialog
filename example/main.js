import Vue from "vue";
import App from "./App.jsx";
import Dialog from "../src/index";

Vue.use(Dialog);

import HelloWorld from "./components/HelloWorld.vue";
Vue.component("HelloWorld", HelloWorld);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
