import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

type CardTitleRef = HTMLHeadingElement

export type CardTitleProps = HTMLAttributes<HTMLHeadingElement>

export const CardTitle = forwardRef<CardTitleRef, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-2xl font-semibold leading-none tracking-tight',
        className,
      )}
      {...props}
    />
  ),
)
CardTitle.displayName = 'Card.Title'
