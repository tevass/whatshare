import { defineConfig, mergeConfig } from 'vitest/config'

import { defaultConfig } from './vitest-config.mjs'

export default defineConfig(mergeConfig(defaultConfig, {}))
