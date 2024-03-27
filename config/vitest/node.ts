import tsConfigPaths from 'vite-tsconfig-paths'
import { UserConfig } from 'vitest/config'

type Plugin = NonNullable<UserConfig['plugins']>[0]

export const config: UserConfig = {
  plugins: [tsConfigPaths() as Plugin],
  test: {
    globals: true,
    root: './',
  },
}
