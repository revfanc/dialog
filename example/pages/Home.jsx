import { defineAsyncComponent } from "vue";

const generator = (loader) => {
  return defineAsyncComponent({
    // 加载函数
    loader,

    // 加载异步组件时使用的组件
    loadingComponent: LoadingComponent,
    // 展示加载组件前的延迟时间，默认为 200ms
    delay: 200,

    // 加载失败后展示的组件
    errorComponent: ErrorComponent,
    // 如果提供了一个 timeout 时间限制，并超时了
    // 也会显示这里配置的报错组件，默认值是：Infinity
    timeout: 5000
  })
};

const LoadingComponent = () => {
  return <div>Loading...</div>;
};

const ErrorComponent = () => {
  return <div>出错了，渲染内容错误，请稍后再试！</div>;
};


const HelloWorld = generator(() => import("../components/HelloWorld.vue").then(async(m) => {
  console.log(1);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log(2);
  return m;
}))

export default {
  name: "Home",
  methods: {
    showDialog() {
      try {
        this.$dialog({
          render(_, { action }) {
            return <HelloWorld onClick={() => action("confirm")}>11</HelloWorld>;
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
