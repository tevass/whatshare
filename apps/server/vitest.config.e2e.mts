import { config } from '@whatshare/vitest-config'
import swc from 'unplugin-swc'
import { defineConfig, mergeConfig, UserConfig } from 'vitest/config'

export default defineConfig(
  mergeConfig(config, {
    test: {
      include: ['**/*.e2e-spec.ts'],
      setupFiles: ['./test/setup/mongo-database-test.ts'],
    },
    plugins: [
      swc.vite({
        module: { type: 'es6' },
      }),
    ],
  } as UserConfig),
)
