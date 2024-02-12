import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

type CardContentRef = HTMLDivElement

export type CardContentProps = HTMLAttributes<HTMLDivElement>

export const CardContent = forwardRef<CardContentRef, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  ),
)
CardContent.displayName = 'Card.Content'
