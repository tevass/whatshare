import { cn } from '@/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'Card.Description'
