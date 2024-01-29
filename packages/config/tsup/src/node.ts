import { replaceTscAliasPaths } from 'tsc-alias'
import type { Options } from 'tsup'

export const config: Options = {
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  bundle: false,
  outDir: 'dist',
  async onSuccess() {
    await replaceTscAliasPaths({
      outDir: 'dist',
    })
  },
}
