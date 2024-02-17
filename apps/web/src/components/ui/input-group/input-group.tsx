import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

type InputGroupRef = HTMLDivElement

export type InputGroupProps = HTMLAttributes<HTMLDivElement>

export const InputGroup = forwardRef<InputGroupRef, InputGroupProps>(
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
InputGroup.displayName = 'InputGroup'
