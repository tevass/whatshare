import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

type CommandInputWrapperRef = HTMLDivElement

export type CommandInputWrapperProps = HTMLAttributes<HTMLDivElement>

export const CommandInputWrapper = forwardRef<
  CommandInputWrapperRef,
  CommandInputWrapperProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center border-b px-3', className)}
    cmdk-input-wrapper=""
    {...props}
  />
))
CommandInputWrapper.displayName = 'Command.InputWrapper'
