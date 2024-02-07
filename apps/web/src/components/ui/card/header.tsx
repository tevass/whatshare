import { cn } from '@/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

export type CardHeaderProps = HTMLAttributes<HTMLElement>

export const CardHeader = forwardRef<HTMLElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <header
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  ),
)
CardHeader.displayName = 'Card.Header'
