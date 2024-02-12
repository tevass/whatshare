import { PopoverContent } from './content'
import { Popover as _Popover } from './popover'
import { PopoverTrigger } from './trigger'

export const Popover = Object.assign(
  {},
  {
    Root: _Popover,
    Trigger: PopoverTrigger,
    Content: PopoverContent,
  },
)

export type { PopoverContentProps } from './content'
export type { PopoverProps } from './popover'
export type { PopoverTriggerProps } from './trigger'

