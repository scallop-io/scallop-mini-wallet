import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json'
import dts from 'rollup-plugin-dts';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import packageJson from './package.json' assert { type: 'json' };
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import tsConfig from './tsconfig.json' assert { type: 'json' };
export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      json(),
      commonjs(),
      nodePolyfills({
        exclude: ['crypto']
      }),
      peerDepsExternal(),
      typescript({ tsconfig: "./tsconfig.json" }),
      nodeResolve({ browser: true, preferBuiltins: false, mainFields: ['browser'] }),
      postcss(),
      terser(),
    ],
  },
  {
    input: "dist/esm/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts({
      compilerOptions: {
        baseUrl: tsConfig.compilerOptions.baseUrl,
        paths: tsConfig.compilerOptions.paths,
      },
    })],
    external: [/\.css$/, /\.scss$/],
  },
];