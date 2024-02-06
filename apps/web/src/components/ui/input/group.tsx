import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

export type InputGroupProps = HTMLAttributes<HTMLDivElement>

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex relative w-full', className)}
        {...props}
      />
    )
  },
)
InputGroup.displayName = 'Input.Group'
