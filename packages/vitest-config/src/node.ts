import tsConfigPaths from 'vite-tsconfig-paths'
import { UserConfig } from 'vitest/config'

const config: UserConfig = {
  plugins: [tsConfigPaths()],
  test: {
    globals: true,
  },
}

export default config
