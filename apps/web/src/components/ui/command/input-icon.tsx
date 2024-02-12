import { Slot, SlotProps } from '@radix-ui/react-slot'
import { forwardRef, type ElementRef } from 'react'

import { cn } from '@/utils/cn'

type CommandInputIconRef = ElementRef<typeof Slot>

export type CommandInputIconProps = SlotProps

export const CommandInputIcon = forwardRef<
  CommandInputIconRef,
  CommandInputIconProps
>(({ className, ...props }, ref) => (
  <Slot
    ref={ref}
    className={cn('mr-2 h-4 w-4 shrink-0 opacity-50', className)}
    {...props}
  />
))
CommandInputIcon.displayName = 'Command.InputIcon'
