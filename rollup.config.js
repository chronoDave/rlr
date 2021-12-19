/* eslint-disable no-param-reassign */
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

const input = 'src/index.ts';
const output = type => `dist/rlr.${type}`;

const transpile = {
  input,
  external: ['fs', 'util', 'stream'],
  plugins: [
    esbuild({
      target: 'esnext'
    })
  ],
  output: [{
    file: output('cjs'),
    exports: 'auto',
    format: 'cjs'
  }, {
    file: output('mjs'),
    exports: 'auto',
    format: 'es'
  }]
};

const types = {
  input,
  external: ['fs'],
  plugins: [dts()],
  output: {
    file: output('d.ts'),
    format: 'es'
  }
};

export default cla => {
  const { noEmit } = cla;
  delete cla.noEmit;

  return noEmit ?
    transpile :
    [transpile, types];
};
