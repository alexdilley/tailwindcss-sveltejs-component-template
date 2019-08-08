import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import sveltePreprocess from 'svelte-preprocess';
import pkg from './package.json';

const dev = !!process.env.ROLLUP_WATCH;
const name = pkg.name
  .replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
  .replace(/^\w/, m => m.toUpperCase())
  .replace(/-\w/g, m => m[1].toUpperCase());

export default {
  input: dev ? 'test/main.js' : 'src/index.svelte',
  output: [
    {
      file: 'public/bundle.js',
      format: 'iife',
      name: 'app',
      sourcemap: true,
    },
    { file: pkg.module, format: 'es' },
    { file: pkg.main, format: 'umd', name },
  ],
  plugins: [
    svelte({
      dev, // enable run-time checks in dev
      preprocess: sveltePreprocess({ postcss: true }),
    }),
    resolve({
      browser: true,
      dedupe: importee =>
        importee === 'svelte' || importee.startsWith('svelte/'),
    }),
    commonjs(),
    // Watch the `public` dir and refresh the browser on changes when in dev.
    dev && livereload('public'),
  ],
  watch: {
    clearScreen: false,
  },
};
