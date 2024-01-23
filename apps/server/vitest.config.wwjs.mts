import { config } from '@whatshare/vitest-config/node'
import swc from 'unplugin-swc'
import { defineConfig, mergeConfig, UserConfig } from 'vitest/config'

export default defineConfig(
  mergeConfig(config, {
    test: {
      include: ['**/*.wwjs-spec.ts'],
      setupFiles: ['./test/setup/mongo-memory-server.ts'],
      hookTimeout: 1000 * 60 * 1, // 1 min
    },
    plugins: [
      swc.vite({
        module: { type: 'es6' },
      }),
    ],
  } as UserConfig),
)
