import { UserConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'
import swc from 'unplugin-swc'

export const defaultConfig: UserConfig = {
  test: {
    globals: true,
    root: './',
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
}
