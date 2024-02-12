import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

type CardHeaderRef = HTMLElement

export type CardHeaderProps = HTMLAttributes<HTMLElement>

export const CardHeader = forwardRef<CardHeaderRef, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <header
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  ),
)
CardHeader.displayName = 'Card.Header'
