// import HelloWorld from "../components/HelloWorld.vue";
export default {
  name: "Home",
  data () {
    return {
      params: {
        a: 1
      },
    }
  },
  methods: {
    showDialog() {
      try {
        this.$dialog({
          render(h, { action })  {
            return <HelloWorld params={this.params} onClick={() => action("confirm")}>11</HelloWorld>;
          },
        });

        setTimeout(() => {
          this.params.a = 2
        }, 2000);
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
