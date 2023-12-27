import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.ts'],
  format: ['cjs'],
  dts: true,
  clean: true,
})
