import resolve from '@rollup/plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import { defineConfig } from 'rollup'

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/dialog.umd.js',
      format: 'umd',
      name: 'Dialog',
      globals: {
        vue: 'Vue'
      }
    },
    {
      file: 'dist/dialog.esm.js',
      format: 'es'
    }
  ],
  external: ['vue'],
  plugins: [
    resolve(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist'
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    postcss({
      extract: true,
      modules: false
    }),
    terser()
  ]
}) 