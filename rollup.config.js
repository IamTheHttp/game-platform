import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import json from '@rollup/plugin-json';
import scss from 'rollup-plugin-scss';
import image from '@rollup/plugin-image';

export default [{
  external: ['react'],
  input: 'src/index.ts',
  output: [{
    file: "dist/build.js",
    format: 'commonjs'
  }],
  plugins: [
    json(),
    resolve(),
    typescript({ target: "es5"}),
    scss(), // will output compiled styles to output.css
    image()
  ]
}];

