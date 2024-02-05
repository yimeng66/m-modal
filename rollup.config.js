const { defineConfig } = require('rollup');

const babel = require('@rollup/plugin-babel');
const nodeResolve = require('@rollup/plugin-node-resolve');
const postcss = require('rollup-plugin-postcss');

function buildConfig(options) {
  const { pkg, jsName, external } = options;

  return {
    input: [`${pkg}/src/index.ts`],
    output: [
      {
        format: 'esm',
        file: `${pkg}/dist/esm/index.esm.js`,
        sourcemap: true,
      },
      {
        format: 'commonjs',
        file: `${pkg}/dist/common/index.js`,
        sourcemap: true,
      },
      {
        format: 'umd',
        file: `${pkg}/dist/umd/index.umd.js`,
        sourcemap: true,
        name: jsName,
      },
    ],
    plugins: [
      postcss({
        extract: 'index.css',
      }),
      babel({
        babelHelpers: 'bundled',
        exclude: /node_modules/,
        extensions: ['.ts', '.tsx'],
      }),
      nodeResolve({ extensions: ['.ts', '.tsx', '.js', '.jsx'] }),
    ],
    external: external || [],
  };
}

module.exports = defineConfig([
  buildConfig({ pkg: 'packages/core', jsName: 'MModalCore' }),
  buildConfig({
    pkg: 'packages/vue',
    jsName: 'MModal',
    external: ['vue', '@ym/modal-core'],
  }),
]);
