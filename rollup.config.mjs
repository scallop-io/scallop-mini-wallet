import tsConfigPaths from 'rollup-plugin-tsconfig-paths';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import dts from 'rollup-plugin-dts';
import image from '@rollup/plugin-image';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import gzipPlugin from 'rollup-plugin-gzip';
import cssnano from 'cssnano';
import packageJson from './package.json' assert { type: 'json' };
import tsConfig from './tsconfig.json' assert { type: 'json' };

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      cssnano({
        preset: 'default',
      }),
      nodeResolve({ browser: true, preferBuiltins: false, mainFields: ['browser'] }),
      commonjs(),
      json(),
      typescript({ tsconfig: './tsconfig.json' }),
      tsConfigPaths(),
      postcss(),
      image(),
      terser(),
      gzipPlugin(),
    ],
  },
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [
      dts({
        compilerOptions: {
          paths: tsConfig.compilerOptions.paths,
        },
      }),
    ],
    external: [/\.css$/, /\.scss$/],
  },
];
