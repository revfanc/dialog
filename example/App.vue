<template>
  <div id="app">
    <Home></Home>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import Home from "./pages/Home.jsx";
export default {
  name: "App",
  components: {
    HelloWorld,
    Home,
  },
};
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  padding: 20px;
}
.dialog {
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
