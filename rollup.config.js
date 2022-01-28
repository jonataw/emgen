import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';
import babel from '@rollup/plugin-babel';

const extensions = ['.ts'];

const banner = `// ${pkg.name} v${pkg.version} - ${pkg.license} @ ${pkg.author}`;

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: 'inline',
        banner,
        exports: 'auto'
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: 'inline',
        banner,
        exports: 'auto'
      }
    ],
    external: [
      'juice',
      'deepmerge',
      '@vue/compiler-sfc',
      '@vue/server-renderer',
      'vue',
      'vue-i18n'
    ],
    plugins: [
      resolve({
        extensions
      }),
      babel({
        exclude: 'node_modules/**',
        extensions
      })
    ]
  }
];
