import createTheme from 'tailwindcss-themer'
import type createPlugin from 'tailwindcss/plugin'

import { defaultTheme } from './default-theme'
import { lightTheme } from './light'

export const plugin = createTheme({
  defaultTheme: {
    extend: defaultTheme,
  },
  themes: [lightTheme],
}) as ReturnType<typeof createPlugin>
