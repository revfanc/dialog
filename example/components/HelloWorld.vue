<template>
  <div class="hello-world-container">
    <h1>hello world</h1>
    <p>params: {{ params && params.a }}</p>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: ["params"],
};
</script>
<style scoped>
.hello-world-container {
  width: 100px;
  height: 100px;
  background: red;
}
h1 {
  color: white;
}
</style>
