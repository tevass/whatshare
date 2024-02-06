import type { ThemeConfig } from 'tailwindcss/types/config'
import { lightTheme } from './light'

export const defaultTheme: Partial<ThemeConfig> = lightTheme.extend
