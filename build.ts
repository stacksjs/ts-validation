import { dts } from 'bun-plugin-dtsx'

await Bun.build({
  minify: true,
  entrypoints: ['src/index.ts'],
  outdir: './dist',
  splitting: true,
  target: 'bun',
  format: 'esm',
  plugins: [dts()],
})
