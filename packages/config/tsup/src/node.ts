import type { Options } from 'tsup'

export const config: Options = {
  format: ['cjs', 'esm'],
  dts: true,
  bundle: false,
}
