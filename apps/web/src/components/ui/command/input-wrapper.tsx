import { forwardRef, HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

export type CommandInputWrapperProps = HTMLAttributes<HTMLDivElement>

export const CommandInputWrapper = forwardRef<
  HTMLDivElement,
  CommandInputWrapperProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center px-3 border-b', className)}
    cmdk-input-wrapper=""
    {...props}
  />
))
CommandInputWrapper.displayName = 'Command.InputWrapper'
