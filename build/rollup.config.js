import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import pkg from '../package.json';
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
        banner,
        exports: 'auto'
      },
      {
        file: pkg.module,
        format: 'es',
        banner,
        exports: 'auto'
      }
    ],
    external: ['juice'],
    plugins: [
      resolve({
        extensions
      }),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        extensions
      }),
      terser()
    ]
  }
];
