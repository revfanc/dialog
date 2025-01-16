export default {
  name: "Home",
  methods: {
    showDialog() {
      this.$dialog.alert({
        content(h) {
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
      <div>
        <button onClick={this.showDialog}>show dialog</button>
      </div>
    );
  },
};
