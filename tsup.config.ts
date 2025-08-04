import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'styled-components', 'uuid', 'kit'],
  treeshake: true,
  minify: false,
  splitting: false,
  outDir: 'dist',
  target: ['es2020', 'node18'],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
  onSuccess: 'tsc --emitDeclarationOnly --declaration',
  noExternal: ['kit'],
});
