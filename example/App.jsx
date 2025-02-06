import Home from "./pages/Home.jsx";
export default {
  name: "App",
  components: {
    Home,
  },
  methods: {
    showDialog() {
      this.$dialog({
        render(h) {
          return (
            <div class="dialog">
              <h1>hello</h1>
              <HelloWorld />
            </div>
          );
        },
      });
    },
  },
  render(h) {
    return (
      <div id="app">
        <Home />
        <button onClick={this.showDialog}>show dialog by App</button>
      </div>
    );
  },
};
