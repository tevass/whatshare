import tsConfigPaths from 'vite-tsconfig-paths'
import { UserConfig } from 'vitest/config'

export const config: UserConfig = {
  plugins: [tsConfigPaths()],
  test: {
    globals: true,
  },
}
