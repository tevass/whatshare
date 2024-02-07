import { cn } from '@/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

export type CardFooterProps = HTMLAttributes<HTMLElement>

export const CardFooter = forwardRef<HTMLElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <footer
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  ),
)
CardFooter.displayName = 'Card.Footer'
