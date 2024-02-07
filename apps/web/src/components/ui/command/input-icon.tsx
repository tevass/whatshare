import { forwardRef, HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

export type CommandInputIconProps = HTMLAttributes<HTMLDivElement>

export const CommandInputIcon = forwardRef<
  HTMLDivElement,
  CommandInputIconProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mr-2 h-4 w-4 shrink-0 opacity-50', className)}
    {...props}
  />
))
CommandInputIcon.displayName = 'Command.InputIcon'
