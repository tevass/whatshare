import { config } from '@whatshare/tsup-config/react'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.ts'],
  ...config,
})
