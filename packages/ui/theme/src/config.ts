import plugin from 'tailwindcss/plugin'

import {
  borderRadius,
  colors,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
} from '@whatshare/ui-tokens'

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const themeConfig = plugin(() => {}, {
  theme: {
    extend: {
      colors,
      borderRadius,
      fontSize,
      fontFamily,
      fontWeight,
      lineHeight,
    },
  },
})
