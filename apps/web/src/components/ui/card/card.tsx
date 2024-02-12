import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

type CardRef = HTMLDivElement

export type CardProps = HTMLAttributes<HTMLDivElement>

export const Card = forwardRef<CardRef, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        className,
      )}
      {...props}
    />
  ),
)
Card.displayName = 'Card'
