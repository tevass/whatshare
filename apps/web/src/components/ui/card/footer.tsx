import { cn } from '@/utils/cn'
import { forwardRef, type HTMLAttributes } from 'react'

type CardFooterRef = HTMLElement

export type CardFooterProps = HTMLAttributes<HTMLElement>

export const CardFooter = forwardRef<CardFooterRef, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <footer
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  ),
)
CardFooter.displayName = 'Card.Footer'
