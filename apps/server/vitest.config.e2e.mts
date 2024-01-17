import { config } from '@whatshare/vitest-config/node'
import swc from 'unplugin-swc'
import { defineConfig, mergeConfig, UserConfig } from 'vitest/config'

export default defineConfig(
  mergeConfig(config, {
    test: {
      include: ['**/*.e2e-spec.ts'],
      setupFiles: ['./test/setup/mongo-memory-server.ts'],
    },
    plugins: [
      swc.vite({
        module: { type: 'es6' },
      }),
    ],
  } as UserConfig),
)