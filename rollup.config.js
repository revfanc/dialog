import resolve from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.js",
  external: ["vue"], // Vue 作为外部依赖
  output: [
    {
      file: "dist/dialog.umd.js",
      format: "umd",
      name: "Dialog",
      globals: {
        vue: "Vue",
      },
    },
    {
      file: "dist/dialog.esm.js",
      format: "es",
    },
  ],
  plugins: [
    postcss({
      minimize: true,
      extract: false,
    }),
    babel({
      exclude: "node_modules/**",
      extensions: [".js", ".jsx"],
    }),
    resolve(),
    terser(),
  ],
};
