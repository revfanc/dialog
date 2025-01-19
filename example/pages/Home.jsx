import HelloWorld from "../components/HelloWorld.vue";
export default {
  name: "Home",
  methods: {
    showDialog() {
      try {
        this.$dialog({
          render(_, { action }) {
            return <div onClick={() => action("confirm")}>11</div>;
          },
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
