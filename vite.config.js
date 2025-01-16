import { defineConfig } from "vite";
import vue2 from "@vitejs/plugin-vue2";
import vue2Jsx from "@vitejs/plugin-vue2-jsx";
import path from "path";

export default defineConfig({
  plugins: [
    vue2(),
    vue2Jsx(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./example"),
      vue: "vue/dist/vue.esm.js",
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json', '.vue']
  },
  server: {
    port: 3000,
    open: true,
  },
  root: "./example",
});
