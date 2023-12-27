import { config } from '@whatshare/tsup-config/node'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.ts'],
  ...config,
})
