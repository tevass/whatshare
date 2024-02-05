import createTheme from 'tailwindcss-themer'
import type createPlugin from 'tailwindcss/plugin'

import {
  colors,
  borderRadius,
  fontSize,
  fontFamily,
  fontWeight,
  lineHeight,
} from '@whatshare/ui-tokens'

import { lightTheme } from './light'

export const plugin = createTheme({
  defaultTheme: {
    extend: {
      colors,
      borderRadius,
      fontSize,
      fontFamily,
      fontWeight,
      lineHeight,
    },
  },
  themes: [lightTheme],
}) as ReturnType<typeof createPlugin>
