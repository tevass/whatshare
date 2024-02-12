import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

type CardDescriptionRef = HTMLParagraphElement

export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>

export const CardDescription = forwardRef<
  CardDescriptionRef,
  CardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'Card.Description'
