import { defineConfig, mergeConfig } from 'vitest/config'

import { defaultConfig } from './vitest-config.mjs'

export default defineConfig(
  mergeConfig(defaultConfig, {
    test: {
      include: ['**/*.e2e-spec.ts'],
      setupFiles: ['./test/setup/mongo-database-test.ts'],
    },
  }),
)
