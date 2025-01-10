<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <button class="btn" @click="click">按钮</button>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data () {
    return {
      msg: '123'
    }
  },
  methods: {
    click () {
      this.$dialog({
        content: () => import('./components/HelloWorld.vue'),
        props: {
          msg: 'xxxxxxxxxxxxxxxx'
        }
      }).then((res) => {
        console.log('res :>> ', res)
      })
    }
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.dialog {
  width: 300px;
  height: 300px;
  background-color: #fff;
}
</style>
