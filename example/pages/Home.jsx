import HelloWorld from "../components/HelloWorld.vue";
export default {
  name: "Home",
  methods: {
    showDialog() {
      try {
        const h = this.$createElement;
        this.$dialog({
          render: <div>111</div>,
        });
      } catch (error) {
        console.log("error :>> ", error);
      }
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
