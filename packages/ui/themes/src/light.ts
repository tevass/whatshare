import type { ThemeConfig } from 'tailwindcss-themer/lib/utils/optionsUtils'

import { colors } from '@whatshare/ui-tokens'
import { extendsTheme } from './utils/extends-theme'

export const lightTheme: ThemeConfig = {
  name: 'light',
  extend: extendsTheme({
    colors: {
      background: {
        DEFAULT: colors.woodsmoke[50],
        secondary: colors.woodsmoke[100],
      },
      foreground: {
        DEFAULT: colors.woodsmoke[950],
        muted: colors.woodsmoke[400],
      },
      primary: {
        DEFAULT: colors.brand[500],
        hover: colors.brand[600],
        active: colors.brand[700],
        foreground: colors.white,
      },
      danger: {
        DEFAULT: colors.stiletto[600],
        hover: colors.stiletto[700],
        active: colors.stiletto[800],
        foreground: colors.white,
      },
      border: {
        DEFAULT: colors.woodsmoke[200],
        muted: colors.woodsmoke[100],
      },
    },
  }),
}
