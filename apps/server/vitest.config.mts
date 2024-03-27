import { config } from '@whatshare/vitest-config'
import swc from 'unplugin-swc'
import { defineConfig, mergeConfig, UserConfig } from 'vitest/config'

export default defineConfig(
  mergeConfig(config, {
    plugins: [
      swc.vite({
        module: { type: 'es6' },
      }),
    ],
  } as UserConfig),
)
