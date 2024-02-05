import type { ThemeConfig } from 'tailwindcss/types/config'
import { merge } from 'ts-deepmerge'

import {
  borderRadius,
  colors,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
} from '@whatshare/ui-tokens'

export function extendsTheme(extend: Partial<ThemeConfig>): ThemeConfig {
  return merge(
    {
      colors,
      borderRadius,
      fontSize,
      fontFamily,
      fontWeight,
      lineHeight,
    },
    extend,
  ) as ThemeConfig
}
