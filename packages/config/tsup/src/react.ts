import { replaceTscAliasPaths } from 'tsc-alias'
import type { Options } from 'tsup'

export const config: Options = {
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  bundle: true,
  outDir: 'dist',
  async onSuccess() {
    await replaceTscAliasPaths({
      outDir: 'dist',
    })
  },
}
