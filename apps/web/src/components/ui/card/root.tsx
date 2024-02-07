import { cn } from '@/lib/utils'
import { forwardRef, HTMLAttributes } from 'react'

export type CardProps = HTMLAttributes<HTMLDivElement>

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-md border bg-shape text-shape-foreground shadow',
        className,
      )}
      {...props}
    />
  ),
)
Card.displayName = 'Card'
