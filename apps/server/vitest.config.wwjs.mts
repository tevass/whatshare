import { config } from '@whatshare/vitest-config/node'
import swc from 'unplugin-swc'
import { defineConfig, mergeConfig, UserConfig } from 'vitest/config'

export default defineConfig(
  mergeConfig(config, {
    test: {
      include: ['**/*.wwjs-spec.ts'],
      setupFiles: [
        './test/setup/mongo-database-test.ts',
        './test/setup/wwjs-session.ts',
      ],
      testTimeout: 1000 * 40, // 40 seconds
      fileParallelism: false,
      sequence: {
        setupFiles: 'list',
      },
    },
    plugins: [
      swc.vite({
        module: { type: 'es6' },
      }),
    ],
  } as UserConfig),
)
