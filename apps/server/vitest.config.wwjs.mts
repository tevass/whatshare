import { defineConfig, mergeConfig } from 'vitest/config'

import { defaultConfig } from './vitest-config.mjs'

export default defineConfig(
  mergeConfig(defaultConfig, {
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
  }),
)
