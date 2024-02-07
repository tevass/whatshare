'use client'

import { Popover as Root } from './root'
import { PopoverContent } from './content'
import { PopoverTrigger } from './trigger'

export const Popover = Object.assign(Root, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
})

export type { PopoverProps } from './root'
export type { PopoverContentProps } from './content'
export type { PopoverTriggerProps } from './trigger'
